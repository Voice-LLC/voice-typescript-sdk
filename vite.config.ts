import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.json",
      include: ["src"],
      insertTypesEntry: true,
    }),
  ],
  build: {
    target: "node20",
    lib: {
      entry: "src/index.ts",
      name: "VoiceClient",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: (id) => !id.startsWith(".") && !id.startsWith("/"),
    },
  },
});
