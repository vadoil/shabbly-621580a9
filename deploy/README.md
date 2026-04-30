# 🚀 Деплой Shabbly на VPS

Автоматический деплой из GitHub Actions на VPS по SSH + rsync.

- **VPS IP:** `159.194.222.73`
- **Домен:** `shabbly.ru`, `www.shabbly.ru`
- **Папка сайта:** `/var/www/shabbly`
- **Стек на сервере:** Nginx + Certbot (SSL уже получен)

---

## 1. Первичная настройка сервера (один раз)

Подключитесь к серверу под root:

```bash
ssh root@159.194.222.73
```

Склонируйте репозиторий или скопируйте файлы из папки `deploy/`:

```bash
cd /tmp
git clone https://github.com/vadoil/shabbly.git
cd shabbly/deploy
chmod +x setup-server.sh
sudo bash setup-server.sh
```

Скрипт сделает:
- создаст пользователя `deploy`
- создаст папку `/var/www/shabbly` с нужными правами
- скопирует Nginx-конфиг и включит сайт
- подготовит `~/.ssh/authorized_keys` для пользователя `deploy`
- разрешит `deploy` делать `systemctl reload nginx` без пароля

---

## 2. Генерация SSH-ключа для деплоя

**На вашем локальном компьютере** (не на сервере):

```bash
ssh-keygen -t ed25519 -C "github-actions-shabbly" -f ~/.ssh/shabbly_deploy -N ""
```

Получите два файла:
- `~/.ssh/shabbly_deploy` — приватный ключ (пойдёт в GitHub Secrets)
- `~/.ssh/shabbly_deploy.pub` — публичный ключ (пойдёт на VPS)

### Положите публичный ключ на VPS

```bash
ssh-copy-id -i ~/.ssh/shabbly_deploy.pub deploy@159.194.222.73
```

Или вручную:

```bash
cat ~/.ssh/shabbly_deploy.pub | ssh root@159.194.222.73 \
  "cat >> /home/deploy/.ssh/authorized_keys && \
   chown deploy:deploy /home/deploy/.ssh/authorized_keys && \
   chmod 600 /home/deploy/.ssh/authorized_keys"
```

### Проверьте подключение

```bash
ssh -i ~/.ssh/shabbly_deploy deploy@159.194.222.73 "echo ok && ls /var/www/shabbly"
```

Должно вывести `ok` без запроса пароля.

---

## 3. GitHub Secrets

Откройте: **GitHub → Settings → Secrets and variables → Actions → New repository secret**

Добавьте 4 секрета:

| Имя секрета     | Значение                                                        |
|-----------------|-----------------------------------------------------------------|
| `VPS_HOST`      | `159.194.222.73`                                                |
| `VPS_USER`      | `deploy`                                                        |
| `VPS_SSH_KEY`   | Содержимое файла `~/.ssh/shabbly_deploy` (включая `-----BEGIN…` и `-----END…`) |
| `VPS_PATH`      | `/var/www/shabbly`                                              |

Чтобы вывести приватный ключ для копирования:

```bash
cat ~/.ssh/shabbly_deploy
```

Скопируйте **всё содержимое целиком**, включая строки `-----BEGIN OPENSSH PRIVATE KEY-----` и `-----END OPENSSH PRIVATE KEY-----`.

---

## 4. Запуск деплоя

После добавления секретов — любой push в `main` автоматически:

1. Установит зависимости (`npm ci`)
2. Соберёт Vite-проект (`npm run build`)
3. Зальёт `dist/` на VPS в `/var/www/shabbly` через `rsync --delete`

Также можно запустить вручную: **GitHub → Actions → Deploy to VPS → Run workflow**.

---

## 5. DNS

В панели регистратора домена создайте A-записи:

| Тип | Имя   | Значение         |
|-----|-------|------------------|
| A   | `@`   | `159.194.222.73` |
| A   | `www` | `159.194.222.73` |

---

## 6. SSL (если ещё не получен)

```bash
sudo certbot --nginx -d shabbly.ru -d www.shabbly.ru
```

Автообновление обычно уже настроено через systemd timer:

```bash
sudo systemctl status certbot.timer
```

---

## 7. Полезные команды

```bash
# Логи Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Проверить и перезагрузить Nginx
sudo nginx -t && sudo systemctl reload nginx

# Посмотреть содержимое сайта
ls -la /var/www/shabbly/
```

---

## Troubleshooting

- **`Permission denied (publickey)`** — проверьте, что приватный ключ в `VPS_SSH_KEY` скопирован полностью, и публичный лежит в `/home/deploy/.ssh/authorized_keys` с правами `600`.
- **`rsync: failed to set permissions`** — выполните `sudo chown -R deploy:www-data /var/www/shabbly`.
- **404 на `/some-route`** — проверьте, что в Nginx-конфиге есть `try_files $uri $uri/ /index.html;`.
- **Сайт не открывается на shabbly.ru** — проверьте DNS (`dig shabbly.ru +short`) и `sudo nginx -t`.
