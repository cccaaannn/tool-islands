// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import react from "@astrojs/react";
import solidJs from "@astrojs/solid-js";
import alpinejs from "@astrojs/alpinejs";
import preact from "@astrojs/preact";


// https://astro.build/config
export default defineConfig({
    base: import.meta.env.DEV ? "/" : "/tool-islands/",
    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: [{ find: "@", replacement: "/src" }],
        }
    },

    integrations: [
      vue(),
      svelte(),
      alpinejs(),
      react({ include: ["**/tools/jwt-encode/*"] }),
      solidJs({ include: ["**/tools/jwt-decode/*"] }),
      preact({ include: ["**/tools/str-escape/*"] })
    ]
});