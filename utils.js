const fs = require("fs");
const path = require("path");
const spawn = require("cross-spawn");
const { createSpinner } = require("nanospinner");
const names = require("all-the-package-names");
const {
  installPackagesForServer,
} = require("./src/serverHelperFunctions/serverHelper");
const {
  installPackagesForClient,
} = require("./src/clientHelperFunctions/clientHelper");

// make the parent folder function
async function makeParentFolder(parentFolderName) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path.resolve(process.cwd(), `./${parentFolderName}`), (error) => {
      if (error) {
        console.log("💀💀 something went wrong -> \n", error);
        reject();
      } else {
        console.log("Created root parent folder.");
        resolve();
      }
    });
  });
}

// make sub folders like client,server function
async function makeFolders(folders) {
  if (folders.length === 0) {
    console.log("No folders were made in root directory.");
    return;
  }
  return new Promise((resolve, reject) => {
    folders.map((folder) => {
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

// just a standard function
function handleAnswer(rootFolderName) {
  const spinner = createSpinner({ text: "" });

  spinner.error({ text: `💀💀💀  ${rootFolderName} not created` });
  process.exit(1);
}

// clone the given repo and then check for folders if any
async function gitClone(link, folderStructureChoice) {
  const spinner = createSpinner("Downloading files and folder  ...");
  spinner.start();
  const gitRemote = spawn("git", ["clone", `${link}`]);
  gitRemote.on("error", (error) => {
    spinner.error({ text: " 💀💀 git cloning  failed.", error });
    process.exit(1);
  });
  gitRemote.on("close", (code) => {
    if (code !== 0) {
      spinner.error({ text: " 💀💀 git cloning  failed.", code });
      process.exit(1);
    } else {
      process.chdir(getFolderName(link));

      fs.readdir(process.cwd(), function (err, files) {
        if (err) {
          spinner.error({ text: err });
          process.exit(1);
        }
        findFoldersAndInstallPackages(folderStructureChoice, spinner, files);
      });
      spinner.success({ text: "Git repository setup complete." });
    }
  });
}

// so if found the folders then go and install packages
function findFoldersAndInstallPackages(folderStructureChoice, spinner, files) {
  if (folderStructureChoice.length === 1) {
    const folderToInstallPackages = files.find(
      (file) => file === folderStructureChoice[0]
    );
    if (folderToInstallPackages === "server")
      installPackagesForServer([], folderToInstallPackages, false, false);
    else if (folderToInstallPackages === "client")
      installPackagesForClient([], folderToInstallPackages, false);
    else {
      spinner.error({
        text: "Wrong folder structure found so could not complete the process",
      });
      process.exit(1);
    }
  } else {
    const clientFolderToInstallPackages = files.find(
      (file) => file === folderStructureChoice[0]
    );
    const serverFolderToInstallPackages = files.find(
      (file) => file === folderStructureChoice[1]
    );
    if (
      clientFolderToInstallPackages === "client" &&
      serverFolderToInstallPackages === "server"
    ) {
      installPackagesForClient([], clientFolderToInstallPackages, false);
      installPackagesForServer([], serverFolderToInstallPackages, false, false);
    }
  }
}

// standard function to check whether the link is a github link or not
function checkValidLink(link) {
  if (link.includes("https://github.com") && link.includes(".git")) return true;
  else return false;
}

// helper function to parse the github link
function getFolderName(link) {
  let firstPart = link.slice(19);
  let indexOfSlash = firstPart.indexOf("/");
  let indexOfGit = firstPart.indexOf(".git");
  let thirdPart = firstPart.slice(indexOfSlash + 1, indexOfGit);
  return thirdPart;
}

// check if the packages given are valid or not
async function checkPackages(listPackages1, listPackages2 = []) {
  const spinner = createSpinner(
    "Checking the entered packages are valid or not"
  );
  spinner.start();
  let result = true;
  listPackages1.length > 0
    ? listPackages1.forEach((package) => (result = names.includes(package)))
    : (result = true);
  if (result === false) {
    spinner.error({
      text: "Entered packages are invalid hence cannot start the process",
    });
    process.exit(1);
  }
  listPackages2.length > 0
    ? listPackages2.forEach((package) => (result = names.includes(package)))
    : (result = true);
  if (result === false) {
    spinner.error({
      text: "Entered packages are invalid hence cannot start the process",
    });
    process.exit(1);
  }
  spinner.success({ text: "Entered packages are valid hence proceeding" });
  return result;
}

module.exports = {
  makeFolders,
  makeParentFolder,
  gitClone,
  checkValidLink,
  checkPackages,
  handleAnswer,
};
