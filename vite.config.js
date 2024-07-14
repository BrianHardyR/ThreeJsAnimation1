import { defineConfig } from "vite";

export default defineConfig({
    base: "/ThreeJsAnimation1/",
    // import glsl files as strings
    plugins: [
        {
            name: "glsl",
            transform(src, id) {
                if (id.endsWith(".glsl")) {
                    return `export default ${JSON.stringify(src)}`;
                }
            },
        },
    ],
});