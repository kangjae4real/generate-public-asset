import { PublicAssets } from "@/types/asset";
import NextImage, { ImageProps as NextImageProps } from "next/image";

interface ImageProps extends Omit<NextImageProps, "src"> {
  src: string | PublicAssets;
}

export default function Image(props: ImageProps) {
  return (
    <NextImage {...props} /> 
  );
}