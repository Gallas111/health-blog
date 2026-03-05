import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Vercel 무료 플랜 이미지 최적화 한도 초과(402) 방지
      // next/image 대신 일반 <img> 태그 사용
      "no-restricted-imports": ["error", {
        paths: [{
          name: "next/image",
          message: "Vercel 무료 플랜 이미지 최적화 한도 초과 방지: next/image 대신 <img> 태그를 사용하세요.",
        }],
      }],
    },
  },
]);

export default eslintConfig;
