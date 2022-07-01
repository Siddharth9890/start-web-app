import inquirer from "inquirer";
import { executeCreateReact } from "../execute/executeReact";
import { checkPackages } from "../utils/checkPackages";

export async function inputCreateReact(rootFolderName: string): Promise<void> {
  const { frontendFolderName }: { frontendFolderName: string } =
    await inquirer.prompt({
      name: "frontendFolderName",
      type: "input",
      message: "Name of your frontend folder",
      default() {
        return "client";
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
    await executeCreateReact(
      rootFolderName,
      frontendFolderName,
      frontendPackages,
      tailwindSupport
    );
  } else {
  }
}
