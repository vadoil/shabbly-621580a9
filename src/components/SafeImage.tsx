import { Music } from "lucide-react";
import { useState, type ImgHTMLAttributes } from "react";
import { proxify } from "@/lib/storage";

type SafeImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  iconSize?: number;
  loading?: "eager" | "lazy";
  referrerPolicy?: ImgHTMLAttributes<HTMLImageElement>["referrerPolicy"];
};

const SafeImage = ({
  src,
  alt,
  className,
  fallbackClassName = "w-full h-full flex items-center justify-center text-muted-foreground",
  iconSize = 48,
  loading = "lazy",
  referrerPolicy,
}: SafeImageProps) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={fallbackClassName} aria-label={alt}>
        <Music size={iconSize} />
      </div>
    );
  }

  return (
    <img
      src={proxify(src)}
      alt={alt}
      loading={loading}
      referrerPolicy={referrerPolicy}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

export default SafeImage;
