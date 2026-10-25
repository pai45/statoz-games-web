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
    // Generated standalone game bundle, including vendored React/Three.js.
    // Its authored TypeScript is validated in the game workspace.
    "public/games/**",
    "vendor/cricketv2/**",
    "vendor/vibebasketball/**",
    "vendor/websoccer/**",
    "vendor/open-golf/**",
    "vendor/final-third/dist/**",
    ".cache/vibe-*/**",
    ".cache/vibe-*.mjs",
    "test-results/vibe-basketball/**",
    "test-results/stadium-cricket/**",
    "public/embedded-games/**",
    // Generated diagnostic renderer bundles; authored game and review scripts remain linted.
    "test-results/retro-hoops-*/**",
    ".cache/penalty-model-v5/review.js",
    ".cache/penalty-model-v6/review.js",
    ".cache/penalty-model-v7/review.js",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
