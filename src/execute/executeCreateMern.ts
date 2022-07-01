import fs from "fs";
import path from "path";
import { makeFolders, makeParentFolder } from "../utils/utils";
import { initClient } from "./initClient";
import { initServer } from "./initServer";

export async function executeCreateMERN(
  foldersToMake: string[],
  frontendPackages: string[],
  backendPackages: string[],
  rootFolderName: string,
  tailwindSupport: boolean
): Promise<void> {
  try {
    await makeParentFolder(rootFolderName);
    process.chdir(`./${rootFolderName}`);
    console.log(`Switched working directory to ${process.cwd()}`);

    await makeFolders(foldersToMake);
    fs.copyFile(
      path.resolve(__dirname, "../default_files/.gitignore"),
      path.resolve(process.cwd(), `./${foldersToMake[1]}/.gitignore`),
      () => {}
    );

    fs.copyFile(
      path.resolve(__dirname, "../default_files/server.js"),
      path.resolve(process.cwd(), `./${foldersToMake[1]}/index.js`),
      () => {}
    );

    fs.copyFile(
      path.resolve(__dirname, "../default_files/.env"),
      path.resolve(process.cwd(), `./${foldersToMake[1]}/.env`),
      () => {}
    );
    await initServer(backendPackages, foldersToMake[1]!);
    await initClient(frontendPackages, foldersToMake[0]!, tailwindSupport);
  } catch (error) {
    process.exit(1);
  }
}
