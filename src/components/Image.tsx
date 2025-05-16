import NextImage from "next/image";
import { tmdbService } from "@/services/tmdb";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function Image({
  src,
  alt,
  width = 500,
  height = 750,
  className = "",
  priority = false,
}: ImageProps) {
  const imageUrl = src.startsWith("http") ? src : tmdbService.getImageUrl(src);

  return (
    <NextImage
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={true}
    />
  );
}
