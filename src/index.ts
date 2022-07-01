#!/usr/bin/env node

import os from "os";

import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";
import { inputCloneMern } from "./input/cloneMern.input";
import { inputCreateMern } from "./input/createMern.input";
import { inputCreateReact } from "./input/createReact.input";
import { inputCreateNode } from "./input/createNode.input";
import { deleteProject } from "./utils/utils";

let rootFolderName = "";
let projectLanguage = "";

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    `Let's setup project for ${os.userInfo().username} \n`
  );
  await sleep();
  rainbowTitle.stop();
}

async function askProjectFolder() {
  const { projectName }: { projectName: string } = await inquirer.prompt({
    name: "projectName",
    message: "Name of your project folder",
    type: "input",
    default: "Project",
  });

  rootFolderName = projectName;
}

async function projectCloneOrSetupSelection() {
  const choices: string[] = [
    "CREATE YOUR BRAND NEW PROJECT FROM SCRATCH",
    "SETUP/CLONE A EXISTING PROJECT USING",
    "DELETE YOUR CURRENT PROJECT",
  ];

  const { projectOption }: { projectOption: string } = await inquirer.prompt({
    name: "projectOption",
    message: "Clone a project or setup a brand new project from scratch\n",
    type: "list",
    choices,
  });
  try {
    if (projectOption === choices[0]) {
      await projectTypeSelection("JAVASCRIPT");
    } else if (projectOption === choices[1]) {
      await inputCloneMern(rootFolderName);
    } else {
      await deleteProject(rootFolderName);
    }
  } catch (error) {
    console.log("💀💀 something went wrong -> \n", error);
    process.exit(1);
  }
}

// further update
// async function projectLanguageSelection() {
//   const choices: string[] = [
//     "CREATE YOUR PROJECT USING JAVASCRIPT",
//     "CREATE YOUR PROJECT USING TYPESCRIPT",
//   ];

//   const answer = await inquirer.prompt({
//     name: "projectLanguage",
//     message: "Select Javascript or Typescript for your project\n",
//     type: "list",
//     choices,
//   });
//   if (answer.projectLanguage === choices[0]) {
//     projectLanguage = "JAVASCRIPT";
//     await projectTypeSelection(projectLanguage);
//   } else {
//     projectLanguage = "TYPESCRIPT";
//     await projectTypeSelection(projectLanguage);
//   }
// }

async function projectTypeSelection(projectLanguage: string) {
  const choices: string[] = [
    "CREATE A NEW MERN PROJECT USING " + projectLanguage,
    "CREATE A NEW REACT PROJECT USING " + projectLanguage,
    "CREATE A NEW NODE JS PROJECT USING " + projectLanguage,
  ];

  const { projectType }: { projectType: string } = await inquirer.prompt({
    name: "projectType",
    type: "list",
    message: "Some Basic Info of your project\n",
    choices,
  });
  try {
    if (projectType === choices[0]) {
      await inputCreateMern(rootFolderName);
    } else if (projectType === choices[1]) {
      await inputCreateReact(rootFolderName);
    } else {
      await inputCreateNode(rootFolderName);
    }
  } catch (error) {
    console.log("💀💀 something went wrong -> \n", error);
    process.exit(1);
  }
}

const run = async () => {
  console.clear();
  await welcome();
  await askProjectFolder();
  await projectCloneOrSetupSelection();
};

run();
