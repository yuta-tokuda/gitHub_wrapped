import type { MetadataRoute } from "next";

import { APP_URL } from "@/constants/app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: APP_URL,
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
