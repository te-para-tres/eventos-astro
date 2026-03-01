// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import node from "@astrojs/node";

const baseUrl = import.meta.env.PUBLIC_BASE_URL;

// https://astro.build/config
export default defineConfig({
  output: "server",
  base: baseUrl,
  integrations: [tailwind(), react()],
  adapter: node({
    mode: "standalone",
  }),
});
