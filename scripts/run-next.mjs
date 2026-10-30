import { spawn } from "node:child_process";
import { resolve } from "node:path";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const [command, ...args] = process.argv.slice(2);
if (!["dev", "build", "start"].includes(command)) {
  throw new Error("Expected one of: dev, build, start.");
}

const nextCli = resolve("node_modules/next/dist/bin/next");
const child = spawn(process.execPath, [nextCli, command, "web", ...args], {
  env: process.env,
  stdio: "inherit",
});

child.once("error", (error) => {
  console.error("Could not start Next.js:", error.message);
  process.exitCode = 1;
});

child.once("close", (code) => {
  process.exitCode = code ?? 1;
});
