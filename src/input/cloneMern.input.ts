import inquirer from "inquirer";
import { executeCloneMERN } from "../execute/executeCloneMern";
import { checkWhetherGitIsInstalledOrNot } from "../utils/gitUtils";

export async function inputCloneMern(rootFolderName: string): Promise<void> {
  let folderNames: string[] = [];
  const choices: string[] = ["CLIENT AND SERVER", "ONLY SERVER", "ONLY CLIENT"];

  const { githubLink }: { githubLink: string } = await inquirer.prompt({
    name: "githubLink",
    type: "input",
    message: "Please provide a valid git link",
    default: "",
    validate: function (githubLink: string) {
      if (
        githubLink.includes("https://github.com") &&
        githubLink.includes(".git")
      )
        return true;
      else return "Invalid github link";
    },
  });

  const { selectedFolderStructure }: { selectedFolderStructure: string } =
    await inquirer.prompt({
      name: "selectedFolderStructure",
      message: "Basic Folder structure of your project\n",
      type: "list",
      choices,
    });
  if (selectedFolderStructure === choices[0]) {
    const { folderStructure }: { folderStructure: string[] } =
      await inquirer.prompt({
        name: "folderStructure",
        type: "input",
        message:
          "Please provide your name of client and server folder name separated by ,",
        default: "client,server",
        filter: function (input: string) {
          return input.split(",");
        },
      });
    folderNames = folderStructure;
  } else if (selectedFolderStructure === choices[1]) {
    const { folderStructure }: { folderStructure: string } =
      await inquirer.prompt({
        name: "folderStructure",
        type: "input",
        message: "Please provide your name of server folder name",
        default: "server",
      });
    folderNames[0] = folderStructure;
  } else {
    const { folderStructure }: { folderStructure: string } =
      await inquirer.prompt({
        name: "folderStructure",
        type: "input",
        message: "Please provide your name of client folders",
        default: "client",
      });
    folderNames[0] = folderStructure;
  }
  const { confirmation }: { confirmation: boolean } = await inquirer.prompt({
    name: "confirmation",
    type: "confirm",
    message:
      "The git link must be valid && the basic folder structure must also be valid otherwise the process may fail",
    default() {
      return "y/N";
    },
  });

  if (confirmation === true) {
    const t = await checkWhetherGitIsInstalledOrNot();
    if (t) await executeCloneMERN(rootFolderName, githubLink, folderNames);
  }
}
