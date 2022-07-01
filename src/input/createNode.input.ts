import inquirer from "inquirer";
import { executeCreateNode } from "../execute/executeNode";
import { checkPackages } from "../utils/checkPackages";

export async function inputCreateNode(rootFolderName: string): Promise<void> {
  const { backendFolderName }: { backendFolderName: string } =
    await inquirer.prompt({
      name: "backendFolderName",
      type: "input",
      message: "Name of your backend folder",
      default() {
        return "server";
      },
    });
  const { backendPackages }: { backendPackages: string[] } =
    await inquirer.prompt({
      name: "backendPackages",
      type: "input",
      message: "Any packages to be installed for backend separated by ,",
      default() {
        return "express,mongoose,dotenv";
      },
      filter: function (input: string) {
        return input.split(",");
      },
      validate: checkPackages,
    });
  const { confirmation }: { confirmation: boolean } = await inquirer.prompt({
    name: "confirmation",
    type: "confirm",
    message: "Please confirm to start the setup!",
    default() {
      return "y/N";
    },
  });
  if (confirmation === true) {
    await executeCreateNode(rootFolderName, backendFolderName, backendPackages);
  }
}
