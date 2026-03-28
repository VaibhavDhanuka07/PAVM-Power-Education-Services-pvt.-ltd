import { spawnSync } from "node:child_process";
import path from "node:path";

const scriptPath = path.join(process.cwd(), "scripts", "generate-university-media-placeholders.py");

const attempts = [
  ["python", [scriptPath]],
  ["py", ["-3", scriptPath]],
];

for (const [command, args] of attempts) {
  const result = spawnSync(command, args, { stdio: "inherit" });

  if (!result.error) {
    process.exit(result.status ?? 0);
  }

  if (result.error.code !== "ENOENT") {
    console.error(`Failed running ${command}:`, result.error.message);
    process.exit(1);
  }
}

console.error("Python was not found. Install Python 3 and Pillow to generate university media.");
process.exit(1);
