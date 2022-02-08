const spawn = require("cross-spawn");

const inquirer = require("inquirer");
const { createSpinner } = require("nanospinner");

const {
  makeParentFolder,
  gitClone,
  checkValidLink,
  handleAnswer,
} = require("../utils");

// get the input info about the project and then proceed to set-up
async function functionForCloningMERNProject(rootFolderName) {
  let folderStructureChoice = [];
  const githubLink = await inquirer.prompt({
    name: "github",
    type: "input",
    message: "Please provide a valid  git hub link",
    default() {
      return "";
    },
  });
  const answers = await inquirer.prompt({
    name: "folderStructure",
    type: "list",
    message: "Basic Folder structure of your project\n",
    choices: ["CLIENT AND SERVER", "ONLY SERVER", "ONLY CLIENT"],
  });
  const confirmation = await inquirer.prompt({
    name: "confirm",
    type: "confirm",
    message:
      "The git link must be valid && the basic folder structure must also be valid otherwise the process may fail",
    default() {
      return "y/N";
    },
  });

  if (confirmation.confirm === true) {
    if (answers.folderStructure === "CLIENT AND SERVER")
      folderStructureChoice.push("client", "server");
    else if (answers.folderStructure === "ONLY SERVER")
      folderStructureChoice.push("server");
    else folderStructureChoice.push("client");

    gitInstallCheck(rootFolderName, githubLink.github, folderStructureChoice);
  } else {
    handleAnswer(rootFolderName);
  }
}

// first check for a valid git install
const gitInstallCheck = async (rootFolderName, link, folderStructureChoice) => {
  const spinner = createSpinner("Checking for valid git install  ...");
  spinner.start();
  const gitCheck = spawn("git", ["--version"]);
  gitCheck.on("error", (error) => {
    spinner.error({ text: " 💀💀 git failed.", error });
    process.exit(1);
  });
  gitCheck.on("close", (code) => {
    if (code !== 0) {
      spinner.error({ text: " 💀💀 git failed", code });
      process.exit(1);
    } else {
      spinner.success({ text: "Valid Git install found." });
      value = checkValidLink(link);
      if (value) executeCloneMERN(rootFolderName, link, folderStructureChoice);
      else {
        spinner.error({ text: "Link provided is not valid git hub link" });
        process.exit(1);
      }
    }
  });
};

// make parent folder and files and then call the init functions
async function executeCloneMERN(rootFolderName, link, folderStructureChoice) {
  try {
    await makeParentFolder(rootFolderName);
    process.chdir(`./${rootFolderName}`);
    console.log(`Switched working directory to ${process.cwd()}`);

    gitClone(link, folderStructureChoice);
  } catch (error) {
    process.exit(1);
  }
}

module.exports = functionForCloningMERNProject;
