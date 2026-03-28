import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const args = new Set(process.argv.slice(2));
const portArg = [...args].find((arg) => arg.startsWith("--port="));
const port = portArg ? Number(portArg.split("=")[1]) : 3000;
const cleanNext = args.has("--next");
const cleanCache = args.has("--cache");

function safeExec(command) {
  try {
    return execSync(command, { stdio: ["ignore", "pipe", "ignore"] }).toString();
  } catch {
    return "";
  }
}

function killPort(targetPort) {
  if (!targetPort || Number.isNaN(targetPort)) return;

  if (process.platform === "win32") {
    const output = safeExec(`netstat -ano | findstr :${targetPort}`);
    const pids = [...new Set(
      output
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => line.includes("LISTENING"))
        .map((line) => line.split(/\s+/).at(-1))
        .filter((pid) => pid && /^\d+$/.test(pid))
    )];

    for (const pid of pids) {
      safeExec(`taskkill /PID ${pid} /F`);
    }
    return;
  }

  const pids = safeExec(`lsof -ti:${targetPort}`)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  for (const pid of pids) {
    safeExec(`kill -9 ${pid}`);
  }
}

function removeDirIfExists(relativePath) {
  const fullPath = resolve(process.cwd(), relativePath);
  if (!existsSync(fullPath)) return;

  try {
    rmSync(fullPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
    return;
  } catch {
    if (process.platform === "win32") {
      safeExec(`cmd /c rmdir /s /q "${fullPath}"`);
    } else {
      safeExec(`rm -rf "${fullPath}"`);
    }
  }
}

killPort(port);
if (cleanNext) {
  removeDirIfExists(".next");
  removeDirIfExists(".next-dev");
}
if (cleanCache) removeDirIfExists("node_modules/.cache");
