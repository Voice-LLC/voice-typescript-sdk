import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.json",
      include: ["src"],
      insertTypesEntry: true,
      bundleTypes: true,
    }),
  ],
  build: {
    target: "node22",
    lib: {
      entry: "src/index.ts",
      name: "VoiceClient",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^@bufbuild\//, /^@connectrpc\//, '@microsoft/signalr', /^node:/],
    },
  },
});
