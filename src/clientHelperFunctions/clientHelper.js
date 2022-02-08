const spawn = require("cross-spawn");
const { createSpinner } = require("nanospinner");
const figlet = require("figlet");
const gradient = require("gradient-string");


// install all packages for client if invalid given then exits the process  and throws a error
async function installPackagesForClient(
  npmPackagesForClient,
  clientFolderName,
  showFiglet = false
) {
  const spinner = createSpinner("Setting react js packages please wait  ...");
  spinner.start();
  const npmPackagesClient = spawn("npm", ["i", ...npmPackagesForClient], {
    cwd: `./${clientFolderName}`,
  });
  npmPackagesClient.on("error", (error) => {
    spinner.error({ text: " 💀💀 npm i for client failed.", error });
    process.exit(1);
  });
  npmPackagesClient.on("close", (code) => {
    if (code !== 0) {
      spinner.error({
        text: " 💀💀 npm i for react app failed due to invalid arguments.",
        code,
      });
      process.exit(1);
    } else {
      spinner.success({ text: "Installed npm packages for react app." });
      if (showFiglet === true) {
        figlet(
          `Congrats Your Project  !\n was created successfully `,
          (err, data) => {
            console.log(gradient.pastel.multiline(data) + "\n");

            process.exit(0);
          }
        );
      }
    }
  });
}

// run the npx command to create react app
async function initClient(npmPackagesForClient, clientFolderName) {
  const spinner = createSpinner(
    "Setting react js environment please wait  ..."
  );
  spinner.start();
  const npmInitClient = spawn("npx", [
    "create-react-app",
    `./${clientFolderName}`,
  ]);

  npmInitClient.on("error", (error) => {
    spinner.error({
      text: " 💀💀 Error occurred in npx create-react-app",
      error,
    });
    process.exit(1);
  });
  npmInitClient.on("close", (code) => {
    if (code !== 0) {
      spinner.error({
        text: " 💀💀 Error occurred in npx create-react-app.",
        code,
      });
      process.exit(1);
    }
    spinner.success({ text: "React app setup done." });
    if (npmPackagesForClient.length === 0) {
      spinner.success({ text: "No npm packages were added for react app." });
    } else {
      installPackagesForClient(npmPackagesForClient, clientFolderName);
    }
  });
}

module.exports = { installPackagesForClient, initClient };
