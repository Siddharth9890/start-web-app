import spawn from "cross-spawn";
import { createSpinner } from "nanospinner";
import { installTailwind } from "./installTailwind";

export async function initClient(
  npmPackagesForClient: string[],
  clientFolderName: string,
  tailwindSupport = false
): Promise<void> {
  const spinner = createSpinner(
    "Setting react js environment please wait  ..."
  );
  spinner.start();
  const npmInitClient = spawn("npx", [
    "create-react-app",
    `./${clientFolderName}`,
  ]);

  npmInitClient.on("error", (error) => {
    spinner.error({
      text: " 💀💀 Error occurred in npx create-react-app" + error,
    });
    process.exit(1);
  });
  npmInitClient.on("close", (code) => {
    if (code !== 0) {
      spinner.error({
        text: " 💀💀 Error occurred in npx create-react-app." + code,
      });
      process.exit(1);
    }
    spinner.success({ text: "React app setup done." });
    if (npmPackagesForClient.length === 0) {
      spinner.success({ text: "No npm packages were added for react app." });
      if (tailwindSupport) installTailwind(clientFolderName);
    } else {
      installPackagesForClient(
        npmPackagesForClient,
        clientFolderName,
        tailwindSupport
      );
    }
  });
}

async function installPackagesForClient(
  npmPackagesForServer: string[],
  clientFolderName: string,
  tailwindSupport = false
): Promise<void> {
  const spinner = createSpinner(
    `Setting packages for ${clientFolderName} please wait  ...`
  );
  spinner.start();
  const npmPackagesServer = spawn("npm", ["i", ...npmPackagesForServer], {
    cwd: clientFolderName,
  });
  npmPackagesServer.on("error", (error) => {
    spinner.error({
      text: ` 💀💀 npm i failed for ${clientFolderName}.` + error,
    });
    process.exit(1);
  });
  npmPackagesServer.on("close", (code) => {
    if (code !== 0) {
      spinner.error({
        text:
          ` 💀💀 npm i failed due to invalid arguments for ${clientFolderName}` +
          code,
      });
      process.exit(1);
    } else {
      spinner.success({
        text: `Installed npm packages for ${clientFolderName}`,
      });
      if (tailwindSupport) installTailwind(clientFolderName);
    }
  });
}
