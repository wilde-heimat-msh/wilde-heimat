import type { Waschbaer } from "@/data/waschbaeren";
import type { WaschbaerGalerieFoto } from "@/data/photos";

export type WaschbaerRecord = Waschbaer & {
  id: string;
  published: boolean;
  sortOrder: number;
};

export type WaschbaerGalleryItem = WaschbaerGalerieFoto & {
  id: string;
  waschbaerId: string;
  sortOrder: number;
};

export type WaschbaerWithGallery = WaschbaerRecord & {
  gallery: WaschbaerGalleryItem[];
};

export type WaschbaerPublic = Waschbaer & {
  profilFoto: string;
  hasEchteFotos: boolean;
};

export type WaschbaerInput = {
  slug: string;
  name: string;
  aufgenommen: string;
  eigenschaften: string[];
  kurztext: string;
  geschichte: string;
  charakter: string;
  farbe: string;
  published?: boolean;
  sortOrder?: number;
};

export type WaschbaerGalleryInput = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  featured?: boolean;
  objectPosition?: string;
  sortOrder?: number;
};
