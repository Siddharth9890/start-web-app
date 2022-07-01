import spawn from "cross-spawn";
import { createSpinner } from "nanospinner";

export async function initServer(
  npmPackagesForServer: string[],
  serverFolderName: string
): Promise<void> {
  const spinner = createSpinner("Setting node js environment please wait  ...");
  spinner.start();
  const npmInitServer = spawn("npm", ["init", "--y"], {
    cwd: serverFolderName,
  });
  npmInitServer.on("error", (error) => {
    spinner.error({ text: " 💀💀 Error occurred in npm init" + error });
    process.exit(1);
  });
  npmInitServer.on("close", (code) => {
    if (code !== 0) {
      spinner.error({ text: " 💀💀 Error occurred in npm init" + code });
      process.exit(1);
    } else {
      spinner.success({ text: "npm init successfully." });
      installPackagesForServer(npmPackagesForServer, serverFolderName);
    }
  });
}

async function installPackagesForServer(
  npmPackagesForServer: string[],
  serverFolderName: string
): Promise<void> {
  const spinner = createSpinner(
    `Setting packages for ${serverFolderName} please wait  ...`
  );
  spinner.start();
  const npmPackagesServer = spawn(
    "npm",
    ["i", "express", "mongoose", "dotenv", ...npmPackagesForServer],
    {
      cwd: serverFolderName,
    }
  );
  npmPackagesServer.on("error", (error) => {
    spinner.error({
      text: ` 💀💀 npm i  failed for ${serverFolderName}.` + error,
    });
    process.exit(1);
  });
  npmPackagesServer.on("close", (code) => {
    if (code !== 0) {
      spinner.error({
        text:
          ` 💀💀 npm i failed due to invalid arguments for ${serverFolderName}` +
          code,
      });
      process.exit(1);
    } else {
      spinner.success({
        text: `Installed npm packages for ${serverFolderName}`,
      });
    }
  });
}
