import { spawn } from "cross-spawn";
import { createSpinner } from "nanospinner";
import { gitClone } from "../utils/gitUtils";
import { makeParentFolder } from "../utils/utils";

export async function executeCloneMERN(
  rootFolderName: string,
  githubLink: string,
  foldersToMake: string[]
): Promise<void> {
  try {
    await makeParentFolder(rootFolderName);
    process.chdir(`./${rootFolderName}`);
    console.log(`Switched working directory to ${process.cwd()}`);
    await gitClone(githubLink, foldersToMake);
  } catch (error) {
    process.exit(1);
  }
}

export async function findFoldersAndInstallPackages(
  foldersToSearch: string[],
  files: string[]
): Promise<void> {
  const spinner = createSpinner(
    "Checking the integrity of folder structure ..."
  );
  spinner.start();
  // means only one folder to find
  if (foldersToSearch.length === 1) {
    const folder = files.find((file) => file === foldersToSearch[0]);
    if (folder !== undefined) {
      spinner.success({
        text: "Verified Integrity of folder structure",
      });

      await installPackages(folder);
    } else {
      spinner.error({
        text: "Wrong folder structure found so could not complete the process",
      });

      process.exit(1);
    }
  } else {
    const clientFolder = files.find((file) => file === foldersToSearch[0]);
    const serverFolder = files.find((file) => file === foldersToSearch[1]);
    if (clientFolder !== undefined && serverFolder !== undefined) {
      spinner.success({ text: "Verified Integrity of folder structure" });

      await installPackages(clientFolder);
      await installPackages(serverFolder);
    } else {
      spinner.error({
        text: "Wrong folder structure found so could not complete the process",
      });

      process.exit(1);
    }
  }
}

async function installPackages(folder: string): Promise<void> {
  const spinner = createSpinner(
    `Setting packages for ${folder} please wait  ...`
  );
  spinner.start();
  const npmPackagesServer = spawn("npm", ["i"], { cwd: folder });
  npmPackagesServer.on("error", (error) => {
    spinner.error({
      text: ` 💀💀 npm i for failed for ${folder}.` + error,
    });
    process.exit(1);
  });
  npmPackagesServer.on("close", (code) => {
    if (code !== 0) {
      spinner.error({
        text:
          ` 💀💀 npm i failed due to invalid arguments for ${folder}` + code,
      });
      process.exit(1);
    } else {
      spinner.success({ text: `Installed npm packages for ${folder}` });
    }
  });
}
