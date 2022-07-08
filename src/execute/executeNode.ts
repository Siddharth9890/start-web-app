import fs from "fs";
import path from "path";
import { makeFolder, makeParentFolder } from "../utils/utils";
import { initServer } from "./initServer";

export async function executeCreateNode(
  rootFolderName: string,
  backendFolderName: string,
  backendPackages: string[]
): Promise<void> {
  try {
    await makeParentFolder(rootFolderName);
    process.chdir(`./${rootFolderName}`);
    console.log(`Switched working directory to ${process.cwd()}`);

    await makeFolder(backendFolderName);

    fs.copyFile(
      path.resolve(__dirname, "../../src/default_files/server.js"),
      path.resolve(process.cwd(), `./${backendFolderName}/index.js`),
      () => {}
    );

    fs.copyFile(
      path.resolve(__dirname, "../../src/default_files/.gitignore"),
      path.resolve(process.cwd(), `./${backendFolderName}/.gitignore`),
      () => {}
    );

    fs.copyFile(
      path.resolve(__dirname, "../../src/default_files/.env"),
      path.resolve(process.cwd(), `./${backendFolderName}/.env`),
      () => {}
    );

    await initServer(backendPackages, backendFolderName);
  } catch (error) {
    process.exit(1);
  }
}
