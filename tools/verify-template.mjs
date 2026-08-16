import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";

const requiredFiles = [
  "START_HERE.md",
  "README.md",
  "manifest.json",
  "docs/PROTOCOL_ROUTING_RULES.md",
  "docs/DEVELOPMENT_RULES.md",
  "docs/BATCH_COMPLETION_CHOICES.md"
];

const errors = [];

for (const path of requiredFiles) {
  try {
    await access(path, constants.R_OK);
  } catch {
    errors.push(`missing required file: ${path}`);
  }
}

let manifest;
try {
  manifest = JSON.parse(await readFile("manifest.json", "utf8"));
} catch (error) {
  errors.push(`invalid manifest.json: ${error.message}`);
}

if (manifest) {
  const expectedModes = ["create-new", "align-existing", "transform-existing"];
  const modes = manifest.workModes?.modes ?? [];
  for (const mode of expectedModes) {
    if (!modes.includes(mode)) errors.push(`manifest work mode missing: ${mode}`);
  }
  if (manifest.entrypoint !== "START_HERE.md") {
    errors.push("manifest entrypoint must be START_HERE.md");
  }
}

const startHere = await readFile("START_HERE.md", "utf8").catch(() => "");
for (const token of [
  "create-new",
  "align-existing",
  "transform-existing",
  "Build",
  "Commit",
  "公開反映",
  "必須の残作業"
]) {
  if (!startHere.includes(token)) errors.push(`START_HERE.md missing required concept: ${token}`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("template verification passed");
