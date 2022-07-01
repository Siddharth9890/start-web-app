import fs from "fs";
import { spawn } from "child_process";

import { createSpinner } from "nanospinner";
import { findFoldersAndInstallPackages } from "../execute/executeCloneMern";

export async function checkWhetherGitIsInstalledOrNot(): Promise<boolean> {
  const spinner = createSpinner("Checking for valid git install  ...");
  let isValid = true;
  spinner.start();
  const gitCheck = spawn("git", ["--version"]);
  gitCheck.on("error", (error) => {
    spinner.error({ text: " 💀💀 git failed." + error });
    isValid = false;
  });
  gitCheck.on("close", (code) => {
    if (code !== 0) {
      spinner.error({ text: " 💀💀 git failed" + code });
      isValid = false;
    } else {
      spinner.success({ text: "Valid git install found." });
      isValid = true;
    }
  });
  return isValid;
}

export async function gitClone(
  githubLink: string,
  foldersToSearch: string[]
): Promise<void> {
  const spinner = createSpinner("Downloading files and folder  ...");
  spinner.start();
  const gitRemote = spawn("git", ["clone", `${githubLink}`]);
  gitRemote.on("error", (error) => {
    spinner.error({ text: " 💀💀 git cloning  failed." + error });
    process.exit(1);
  });
  gitRemote.on("close", (code) => {
    if (code !== 0) {
      spinner.error({ text: " 💀💀 git cloning  failed." + code });
      process.exit(1);
    } else {
      process.chdir(extractFolderNameFromGitLink(githubLink));

      fs.readdir(process.cwd(), function (err, files) {
        if (err) {
          spinner.error({ text: err.toString() });
          process.exit(1);
        }
        findFoldersAndInstallPackages(foldersToSearch, files);
      });
      spinner.success({ text: "Git repository setup complete." });
    }
  });
}

// helper function to parse the github link
function extractFolderNameFromGitLink(githubLink: string): string {
  let firstPart = githubLink.slice(19);
  let indexOfSlash = firstPart.indexOf("/");
  let indexOfGit = firstPart.indexOf(".git");
  let thirdPart = firstPart.slice(indexOfSlash + 1, indexOfGit);
  return thirdPart;
}
