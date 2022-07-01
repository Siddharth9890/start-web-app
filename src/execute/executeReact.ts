import { makeFolder, makeParentFolder } from "../utils/utils";
import { initClient } from "./initClient";

export async function executeCreateReact(
  rootFolderName: string,
  frontendFolderName: string,
  frontendPackages: string[],
  tailwindSupport: boolean
): Promise<void> {
  try {
    await makeParentFolder(rootFolderName);
    process.chdir(`./${rootFolderName}`);
    console.log(`Switched working directory to ${process.cwd()}`);

    await makeFolder(frontendFolderName);

    await initClient(frontendPackages, frontendFolderName, tailwindSupport);
  } catch (error) {
    process.exit(1);
  }
}
