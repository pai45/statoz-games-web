#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const npmEntrypoint = process.env.npm_execpath;
const vercelEntrypoint = path.join(
  projectRoot,
  "node_modules",
  "vercel",
  "dist",
  "index.js",
);

const help = `StatOz deployment CLI

Usage:
  npm run deploy:setup                 Link this folder to Vercel
  npm run deploy:check                 Run lint and a production build
  npm run deploy                       Create a preview deployment
  npm run deploy:prod                  Create a production deployment

Options:
  --skip-checks                        Deploy without the local preflight
  --help                               Show this help

Any other options are forwarded to Vercel. For example:
  npm run deploy -- --skip-checks --logs
  npm run deploy:prod -- --force
`;

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

function run(command, args, label) {
  console.log(`\n==> ${label}`);

  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    fail(result.error.message);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runPreflight() {
  if (!npmEntrypoint) {
    fail("Run this CLI through one of the npm deployment scripts.");
  }

  run(process.execPath, [npmEntrypoint, "run", "lint"], "Linting");
  run(
    process.execPath,
    [npmEntrypoint, "run", "build"],
    "Building for production",
  );
}

const [command = "preview", ...rawOptions] = process.argv.slice(2);

if (command === "--help" || command === "-h" || rawOptions.includes("--help")) {
  console.log(help);
  process.exit(0);
}

const skipChecks = rawOptions.includes("--skip-checks");
const vercelOptions = rawOptions.filter((option) => option !== "--skip-checks");

if (command === "check") {
  runPreflight();
  console.log("\nPreflight passed. The app is ready to deploy.");
  process.exit(0);
}

if (!existsSync(vercelEntrypoint)) {
  fail("Vercel CLI is missing. Run `npm install` and try again.");
}

if (command === "setup") {
  run(
    process.execPath,
    [vercelEntrypoint, "link", ...vercelOptions],
    "Linking the Vercel project",
  );
  process.exit(0);
}

if (command !== "preview" && command !== "production") {
  fail(`Unknown command: ${command}\n\n${help}`);
}

if (!skipChecks) {
  runPreflight();
} else {
  console.log("\n==> Skipping local preflight checks");
}

const productionOptions = command === "production" ? ["--prod"] : [];
run(
  process.execPath,
  [vercelEntrypoint, "deploy", ...productionOptions, ...vercelOptions],
  `Creating a ${command} deployment`,
);
