// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import react from "@astrojs/react";
import solidJs from "@astrojs/solid-js";
import alpinejs from "@astrojs/alpinejs";


// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: [{ find: "@", replacement: "/src" }],
		},
		base: import.meta.env.DEV ? "/" : "/tool-islands"
	},

	integrations: [
		vue(),
		svelte(),
		alpinejs(),
		react({ include: ["**/tools/jwt-encode/*"] }),
		solidJs({ include: ["**/tools/jwt-decode/*"] })
	]
});