import inquirer from "inquirer";
import { executeCreateMERN } from "../execute/executeCreateMern";
import { checkPackages } from "../utils/checkPackages";

export async function inputCreateMern(rootFolderName: string): Promise<void> {
  let foldersToMake = [];
  const { frontendFolderName }: { frontendFolderName: string } =
    await inquirer.prompt({
      name: "frontendFolderName",
      type: "input",
      message: "Name of your frontend folder",
      default() {
        return "client";
      },
    });
  const { backendFolderName }: { backendFolderName: string } =
    await inquirer.prompt({
      name: "backendFolderName",
      type: "input",
      message: "Name of your backend folder",
      default() {
        return "server";
      },
    });
  const { frontendPackages }: { frontendPackages: string[] } =
    await inquirer.prompt({
      name: "frontendPackages",
      type: "input",
      message: "Any packages to be installed for frontend separated by ,",
      default() {
        return "";
      },
      filter: function (input: string) {
        return input.split(",");
      },
      validate: checkPackages,
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

  const { tailwindSupport }: { tailwindSupport: boolean } =
    await inquirer.prompt({
      name: "tailwindSupport",
      type: "confirm",
      message:
        "Do you want tailwind support as well?. This will install tailwind css for app",
      default() {
        return "y/N";
      },
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
    foldersToMake.push(frontendFolderName, backendFolderName);

    await executeCreateMERN(
      foldersToMake,
      frontendPackages,
      backendPackages,
      rootFolderName,
      tailwindSupport
    );
  }
}
