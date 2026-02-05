export type MediaType = "image" | "video";

export type GalleryItem = {
  id: string;
  title: string;
  meta: string;
  thumbnail: string;
  caption: string;
  instagramUrl?: string;
  mediaType?: MediaType;
  videoUrl?: string;
  layout?: "tall" | "wide";
};

