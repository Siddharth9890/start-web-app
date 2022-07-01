import path from "path";
import fs from "fs";

export async function makeParentFolder(rootFolderName: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.mkdir(
      path.resolve(process.cwd(), `./${rootFolderName}`),
      (error: any) => {
        if (error) {
          console.log("💀💀 something went wrong -> \n", error);
          reject();
        } else {
          console.log("Created root parent folder.");
          resolve();
        }
      }
    );
  });
}

export async function deleteProject(rootFolderName: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.rm(
      path.resolve(process.cwd(), `./${rootFolderName}`),
      { recursive: true },
      (err) => {
        if (err) {
          reject(err);
        }

        resolve();
      }
    );
  });
}

export async function makeFolders(foldersToMake: string[]): Promise<void> {
  if (foldersToMake.length === 0) {
    console.log("No folders were made in root directory.");
    return;
  }
  return new Promise<void>((resolve, reject) => {
    foldersToMake.map((folder) => {
      fs.mkdir(folder, (error) => {
        if (error) {
          console.log(" 💀💀 something went wrong", error);
          reject();
        }
      });
    });
    resolve();
  });
}

export async function makeFolder(folderToMake: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.mkdir(folderToMake, (error) => {
      if (error) {
        console.log(" 💀💀 something went wrong", error);
        reject();
      }
    });
    resolve();
  });
}
