import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Alineado con `noUnusedParameters` de tsconfig: el prefijo `_` marca
      // un parámetro o binding deliberadamente sin usar.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
  // La carpeta de handoff es referencia, no código del proyecto.
  { ignores: ["design_handoff_argos_alumni/**", ".next/**", "node_modules/**", "next-env.d.ts"] },
];

export default eslintConfig;
