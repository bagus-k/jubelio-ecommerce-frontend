import Image from "next/image";
import { useState } from "react";

const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-[200px] bg-gray-100 rounded-md">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400">Image unavailable</span>
        </div>
      ) : (
        <Image
          src={src}
          fill
          alt={alt}
          className="object-contain transition-opacity duration-300"
          loading="lazy"
          quality={75}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      )}
    </div>
  );
};

export default ProductImage;
