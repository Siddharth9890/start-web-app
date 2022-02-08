const fs = require("fs");
const path = require("path");

const inquirer = require("inquirer");

const {
  makeFolders,
  makeParentFolder,
  checkPackages,
  handleAnswer,
} = require("../utils");
const { initServer } = require("./serverHelperFunctions/serverHelper");

// get the input info about the project and then proceed to set-up
async function functionForCreatingNODEProject(rootFolderName) {
  let rootFolders = [];
  let backendPackages = [];

  const backendAnswer = await inquirer.prompt({
    name: "backendFolderName",
    type: "input",
    message: "Name of your backend folder",
    default() {
      return "server";
    },
  });

  const bPackages = await inquirer.prompt({
    name: "backendPackages",
    type: "input",
    message: "Any packages to be installed for backend",
    default() {
      return "express mongoose dotenv";
    },
  });
  const confirmation = await inquirer.prompt({
    name: "confirm",
    type: "confirm",

    message:
      "The packages entered must be valid npm packages other wise the process may fail",
    default() {
      return "y/N";
    },
  });
  if (confirmation.confirm === true) {
    rootFolders.push(backendAnswer.backendFolderName);

    let temp = bPackages.backendPackages.split(" ");
    temp.forEach((package) => backendPackages.push(package));

    if ((await checkPackages(backendPackages)) === true)
      executeCreateNode(rootFolders, backendPackages, rootFolderName);
  } else {
    handleAnswer(false);
  }
}

// make parent folder and files and then call the init functions
async function executeCreateNode(rootFolders, backendPackages, rootFolderName) {
  try {
    await makeParentFolder(rootFolderName);
    process.chdir(`./${rootFolderName}`);
    console.log(`Switched working directory to ${process.cwd()}`);

    await makeFolders(rootFolders);

    fs.copyFile(
      path.resolve(__dirname, "./default_files/server.js"),
      path.resolve(process.cwd(), "./server/index.js"),
      () => {}
    );

    fs.copyFile(
      path.resolve(__dirname, "./default_files/.gitignore"),
      path.resolve(process.cwd(), "./server/.gitignore"),
      () => {}
    );

    fs.copyFile(
      path.resolve(__dirname, "./default_files/.env"),
      path.resolve(process.cwd(), "./server/.env"),
      () => {}
    );

    initServer(backendPackages, rootFolders[1]);
  } catch (error) {
    process.exit(1);
  }
}

module.exports = functionForCreatingNODEProject;
