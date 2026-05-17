import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { existsSync, readFileSync } from "node:fs";

const env = existsSync(".env")
  ? Object.fromEntries(
      readFileSync(".env", "utf8")
        .split(/\r?\n/)
        .map((line) => line.match(/^([^#=]+)=['"]?(.+?)['"]?$/))
        .filter(Boolean)
        .map((match) => [match[1].trim(), match[2].trim()]),
    )
  : {};

const storageUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
const buckets = (process.env.STORAGE_BUCKETS || "covers,audio").split(",").map((bucket) => bucket.trim()).filter(Boolean);
const outputDir = process.env.STORAGE_DIR || "/var/www/shabbly-storage";

if (!storageUrl || !anonKey) {
  throw new Error("Не найдены VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY в окружении или .env");
}

const headers = {
  apikey: anonKey,
  Authorization: `Bearer ${anonKey}`,
  "Content-Type": "application/json",
};

const encodePath = (path) => path.split("/").map(encodeURIComponent).join("/");

async function listObjects(bucket, prefix = "") {
  const response = await fetch(`${storageUrl}/storage/v1/object/list/${bucket}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ prefix, limit: 1000, offset: 0, sortBy: { column: "name", order: "asc" } }),
  });

  if (!response.ok) {
    throw new Error(`Не удалось получить список ${bucket}/${prefix}: ${response.status} ${await response.text()}`);
  }

  const entries = await response.json();
  const files = [];

  for (const entry of entries) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (!entry.id || !entry.metadata) {
      files.push(...await listObjects(bucket, path));
    } else {
      files.push(path);
    }
  }

  return files;
}

async function downloadObject(bucket, path) {
  const response = await fetch(`${storageUrl}/storage/v1/object/public/${bucket}/${encodePath(path)}`);
  if (!response.ok) {
    throw new Error(`Не удалось скачать ${bucket}/${path}: ${response.status} ${await response.text()}`);
  }

  const target = join(outputDir, bucket, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(await response.arrayBuffer()));
}

let total = 0;

for (const bucket of buckets) {
  const files = await listObjects(bucket);
  console.log(`==> ${bucket}: ${files.length} файлов`);
  for (const file of files) {
    await downloadObject(bucket, file);
    total += 1;
  }
}

console.log(`✅ Storage синхронизирован в ${outputDir}: ${total} файлов`);