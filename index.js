#!/usr/bin/env node

const inquirer = require("inquirer");
const chalkAnimation = require("chalk-animation");

const functionForCreatingMERNProject = require("./src/create-mern");
const functionForCreatingReactProject = require("./src/create-react");
const functionForCreatingNODEProject = require("./src/create-node");
const functionForCloningMERNProject = require("./src/clone-mern");

let rootFolderName = "";

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow("Let's setup your PROJECT \n");
  await sleep();
  rainbowTitle.stop();
}

// to get the root folder name
async function askProjectFolder() {
  const answers = await inquirer.prompt({
    name: "projectName",
    type: "input",
    message: "Name of your project folder",
    default() {
      return "Project";
    },
  });

  rootFolderName = answers.projectName;
}

// to get the project type
async function projectTypeSelection() {
  const answers = await inquirer.prompt({
    name: "projectType",
    type: "list",
    message: "Some Basic Info of your project\n",
    choices: [
      "CREATE A NEW MERN PROJECT USING JAVASCRIPT",
      "SETUP/CLONE A EXISTING MERN PROJECT USING JAVASCRIPT",
      "CREATE A NEW REACT PROJECT USING JAVASCRIPT",
      "CREATE A NEW NODE JS PROJECT USING JAVASCRIPT",
    ],
  });
  if (answers.projectType === "CREATE A NEW MERN PROJECT USING JAVASCRIPT") {
    return functionForCreatingMERNProject(rootFolderName);
  } else if (
    answers.projectType ===
    "SETUP/CLONE A EXISTING MERN PROJECT USING JAVASCRIPT"
  ) {
    return functionForCloningMERNProject(rootFolderName);
  } else if (
    answers.projectType === "CREATE A NEW REACT PROJECT USING JAVASCRIPT"
  ) {
    return functionForCreatingReactProject(rootFolderName);
  } else {
    return functionForCreatingNODEProject(rootFolderName);
  }
}

const run = async () => {
  console.clear();
  await welcome();
  await askProjectFolder();
  await projectTypeSelection();
};

run();
