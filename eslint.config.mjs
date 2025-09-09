import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Ignore generated Prisma/client runtime and wasm bundles
      "src/generated/**",
      "src/generated/prisma/**",
      "src/generated/prisma/runtime/**",
      "src/generated/prisma/wasm*.js",
      // Ignore type augmentation file if noisy
      "src/types/next-auth.d.ts",
    ],
  },
];

export default eslintConfig;
