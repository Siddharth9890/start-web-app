import spawn from "cross-spawn";
import { createSpinner } from "nanospinner";
import fs from "fs";
import path from "path";

export async function installTailwind(clientFolderName: string): Promise<void> {
  const spinner = createSpinner(
    "Setting tailwind css environment please wait  ..."
  );
  spinner.start();
  const npmTailwind = spawn(
    "npm",
    ["i", "-D", "tailwindcss", "postcss", "autoprefixer"],
    {
      cwd: `./${clientFolderName}`,
    }
  );

  npmTailwind.on("error", (error) => {
    spinner.error({ text: " 💀💀 npm i for tailwind failed." + error });
  });
  npmTailwind.on("close", (code) => {
    if (code !== 0) {
      spinner.error({
        text:
          " 💀💀 npm i for tailwind failed due to invalid arguments." + code,
      });
      process.exit(1);
    } else {
      spinner.success({ text: "Installed tailwind packages for react app." });
      const npxTailwind = spawn("npx", ["tailwindcss", "init", "-p"], {
        cwd: `./${clientFolderName}`,
      });
      npxTailwind.on("error", (error) => {
        spinner.error({ text: " 💀💀 npm i for tailwind failed." + error });
      });
      npxTailwind.on("close", (code) => {
        if (code !== 0) {
          spinner.error({
            text:
              " 💀💀 npx for tailwind failed  due to invalid arguments." + code,
          });
          process.exit(1);
        } else {
          spinner.success({
            text: "Created tailwind.config.js react app.",
          });
          process.chdir(`./${clientFolderName}`);

          fs.copyFile(
            path.resolve(
              path.join(__dirname, "../default_files/tailwind.config.js")
            ),
            path.resolve(process.cwd(), "./tailwind.config.js"),
            () => {}
          );
          fs.copyFile(
            path.resolve(path.join(__dirname, "../default_files/index.css")),
            path.resolve(process.cwd(), "./src/index.css"),
            () => {}
          );
        }
      });
    }
  });
}
