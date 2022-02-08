const inquirer = require("inquirer");

const { makeFolders, makeParentFolder, checkPackages, handleAnswer } = require("../utils");
const { initClient } = require("./clientHelperFunctions/clientHelper");

// get the input info about the project and then proceed to set-up
async function functionForCreatingReactProject(rootFolderName) {
  let rootFolders = [];
  let frontendPackages = [];
  const frontendAnswer = await inquirer.prompt({
    name: "frontendFolderName",
    type: "input",
    message: "Name of your frontend folder",
    default() {
      return "client";
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
  const confirmation = await inquirer.prompt({
    name: "confirm",
    type: "confirm",

    message:
      "The packages entered must be valid other wise the process may fail",
    default() {
      return "y/N";
    },
  });
  if (confirmation.confirm === true) {
    rootFolders.push(frontendAnswer.frontendFolderName);

    let temp = fPackages.frontendPackages.split(" ");
    temp.forEach((package) => frontendPackages.push(package));

    if (fPackages.frontendPackages.length === 0)
      executeCreateReact(rootFolders, frontendPackages, rootFolderName);
    else if ((await checkPackages(frontendPackages)) === true)
      executeCreateReact(rootFolders, frontendPackages, rootFolderName);
  } else {
    handleAnswer(false);
  }
}

// make parent folder and files and then call the init functions
async function executeCreateReact(
  rootFolders,
  frontendPackages,
  ProjectFolder
) {
  try {
    await makeParentFolder(ProjectFolder);
    process.chdir(`./${ProjectFolder}`);
    console.log(`Switched working directory to ${process.cwd()}`);

    await makeFolders(rootFolders);

    initClient(frontendPackages, rootFolders[0]);
  } catch (error) {
    process.exit(1);
  }
}

module.exports = functionForCreatingReactProject;
