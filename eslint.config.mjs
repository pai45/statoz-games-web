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
    // Immutable third-party REA exports are inspected data, not authored source.
    ".local-game-assets/**",
    "vendor/cricketv2/**",
    "vendor/vibebasketball/**",
    "vendor/websoccer/**",
    "vendor/open-golf/**",
    // Isolated supplied portfolio game; checked with its own TypeScript project.
    "vendor/portfolio-formula/**",
    "vendor/holdover/**",
    "vendor/hoop-legacy/**",
    "vendor/final-third/dist/**",
    // Vendored UI UX Pro Max skill tooling (see .codex/skills/THIRD_PARTY_NOTICES.md).
    ".codex/skills/{banner-design,brand,design,design-system,slides,ui-styling,ui-ux-pro-max}/**",
    ".cache/vibe-*/**",
    ".cache/vibe-*.mjs",
    ".cache/removed-exports/**",
    ".cache/removed-games/**",
    ".cache/device-cache-e2e/**",
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
