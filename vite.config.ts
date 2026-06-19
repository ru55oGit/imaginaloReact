import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

const jsxInSvgJs = {
  name: "jsx-in-svg-js",
  enforce: "pre" as const,
  async transform(code: string, id: string) {
    if (!/src\/components\/SVG\/.*\.js$/.test(id)) {
      return null;
    }

    return transformWithEsbuild(code, id, {
      loader: "jsx",
      jsx: "automatic",
    });
  },
};

export default defineConfig({
  plugins: [jsxInSvgJs, react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          mui: ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
          ui: ["swiper", "react-slick", "react-simple-keyboard", "hypher", "hyphenation.es"],
        },
      },
    },
  },
});
