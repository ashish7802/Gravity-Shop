"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

const FALLBACK_IMAGE = "/sneakers.png";

/**
 * A drop-in replacement for next/image that gracefully handles
 * invalid or unreachable image URLs by falling back to a local asset.
 * Handles external URLs, data URIs, and local public assets.
 */
export function SafeImage({ src, alt, ...props }: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasErrored(false);
    setIsLoaded(false);
  }, [src]);

  const isExternal = typeof imgSrc === "string" && imgSrc.startsWith("http");
  const isDataUri = typeof imgSrc === "string" && imgSrc.startsWith("data:");
  const isCloudinary = typeof imgSrc === "string" && imgSrc.includes("res.cloudinary.com");

  const handleError = () => {
    if (!hasErrored) {
      setHasErrored(true);
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  // For data URIs and external non-Cloudinary URLs, use plain <img> to prevent Next.js image domain errors
  if (isDataUri || (isExternal && !isCloudinary)) {
    const { fill, width, height, ...restProps } = props as Record<string, unknown>;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={typeof imgSrc === "string" ? imgSrc : FALLBACK_IMAGE}
        alt={alt}
        onError={handleError}
        onLoad={() => setIsLoaded(true)}
        style={fill ? { position: "absolute", width: "100%", height: "100%", objectFit: "contain" } : { width: width as number, height: height as number }}
        className={`transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-[4px] scale-[1.03]"
        } ${(restProps.className as string) || ""}`}
      />
    );
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      onLoad={() => setIsLoaded(true)}
      className={`transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-[4px] scale-[1.03]"
      } ${props.className || ""}`}
    />
  );
}
