import chalk from "chalk";
import { loadDefaultCover } from "./dist/node.js";

const line = chalk.gray("─".repeat(52));

console.log();
console.log(chalk.bold.cyan("  MYTHRART") + chalk.gray(" • ASSETS CHECK"));
console.log(line);

try {
  console.log(chalk.blue("  ◉  Loading default cover..."));

  const data = await loadDefaultCover();

  console.log(chalk.green("  ✔  Default cover loaded successfully"));
  console.log();

  console.log(chalk.bold("  Asset information"));
  console.log(line);
  console.log(`  ${chalk.gray("Status")}       ${chalk.green("READY")}`);
  console.log(`  ${chalk.gray("File")}         ${chalk.white("default_cover_image.png")}`);
  console.log(
    `  ${chalk.gray("Size")}         ${chalk.white(
      `${(data.byteLength / 1024).toFixed(2)} KiB`,
    )}`,
  );
  console.log(`  ${chalk.gray("Bytes")}        ${chalk.white(data.byteLength.toLocaleString("en-US"))}`);
  console.log(`  ${chalk.gray("Type")}         ${chalk.white(data.constructor.name)}`);
  console.log(line);
  console.log(chalk.green.bold("  ✔  All checks passed"));
} catch (error) {
  console.log();
  console.error(chalk.red.bold("  ✖  Failed to load default cover"));

  if (error instanceof Error) {
    console.error(chalk.red(`     ${error.message}`));
  } else {
    console.error(chalk.red(`     ${String(error)}`));
  }
}

console.log();