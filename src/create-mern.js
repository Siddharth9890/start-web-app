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
const { initClient } = require("./clientHelperFunctions/clientHelper");

// get the input info about the project and then proceed to set-up
async function functionForCreatingMERNProject(rootFolderName) {
  let rootFolders = [];
  let frontendPackages = [];
  let backendPackages = [];
  const frontendAnswer = await inquirer.prompt({
    name: "frontendFolderName",
    type: "input",
    message: "Name of your frontend folder",
    default() {
      return "client";
    },
  });
  const backendAnswer = await inquirer.prompt({
    name: "backendFolderName",
    type: "input",
    message: "Name of your backend folder",
    default() {
      return "server";
    },
  });
  const fPackages = await inquirer.prompt({
    name: "frontendPackages",
    type: "input",
    message: "Any packages to be installed for frontend",
    default() {
      return "";
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
      "The packages entered must be valid we will validate them before starting the process other wise the process may fail",
    default() {
      return "y/N";
    },
  });
  if (confirmation.confirm === true) {
    // extract information given to us
    rootFolders.push(
      frontendAnswer.frontendFolderName,
      backendAnswer.backendFolderName
    );

    let temp = fPackages.frontendPackages.split(" ");
    temp.forEach((package) => frontendPackages.push(package));

    temp = bPackages.backendPackages.split(" ");
    temp.forEach((package) => backendPackages.push(package));

    // so if no frontend packages are given then proceed with backend packages only
    if (fPackages.frontendPackages.length === 0) {
      if ((await checkPackages(backendPackages)) === true)
        executeCreateMERN(
          rootFolders,
          frontendPackages,
          backendPackages,
          rootFolderName
        );
    } else {
      if ((await checkPackages(frontendPackages, backendPackages)) === true)
        executeCreateMERN(
          rootFolders,
          frontendPackages,
          backendPackages,
          rootFolderName
        );
    }
  } else {
    handleAnswer(rootFolderName);
  }
}

// make parent folder and files and then call the init functions
async function executeCreateMERN(
  rootFolders,
  frontendPackages,
  backendPackages,
  rootFolderName
) {
  try {
    await makeParentFolder(rootFolderName);
    process.chdir(`./${rootFolderName}`);
    console.log(`Switched working directory to ${process.cwd()}`);

    await makeFolders(rootFolders);

    fs.copyFile(
      path.resolve(__dirname, "./default_files/.gitignore"),
      path.resolve(process.cwd(), "./server/.gitignore"),
      () => {}
    );

    fs.copyFile(
      path.resolve(__dirname, "./default_files/server.js"),
      path.resolve(process.cwd(), "./server/index.js"),
      () => {}
    );

    fs.copyFile(
      path.resolve(__dirname, "./default_files/.env"),
      path.resolve(process.cwd(), "./server/.env"),
      () => {}
    );

    initServer(backendPackages, rootFolders[1]);
    initClient(frontendPackages, rootFolders[0]);
  } catch (error) {
    process.exit(1);
  }
}

module.exports = functionForCreatingMERNProject;
