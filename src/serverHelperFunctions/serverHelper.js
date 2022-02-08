const spawn = require("cross-spawn");
const { createSpinner } = require("nanospinner");
const figlet = require("figlet");
const gradient = require("gradient-string");

// install all packages for server if invalid given then exits the process  and throws a error
async function installPackagesForServer(
  npmPackagesForServer,
  serverFolderName,
  flag = true,
  showFiglet = false
) {
  const spinner = createSpinner("Setting node js packages please wait  ...");
  spinner.start();
  if (flag) {
    const npmPackagesServer = spawn(
      "npm",
      ["i", "express", "mongoose", "dotenv", ...npmPackagesForServer],
      { cwd: serverFolderName }
    );
    npmPackagesServer.on("error", (error) => {
      spinner.error({ text: " 💀💀 npm i for server failed.", error });
      process.exit(1);
    });
    npmPackagesServer.on("close", (code) => {
      if (code !== 0) {
        spinner.error({
          text: " 💀💀 npm i for server failed due to invalid arguments",
          code,
        });
        process.exit(1);
      } else {
        spinner.success({ text: "Installed npm packages for server." });
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
  } else {
    const npmPackagesServer = spawn("npm", ["i"], { cwd: serverFolderName });
    npmPackagesServer.on("error", (error) => {
      spinner.error({ text: " 💀💀 npm i for server failed.", error });
      process.exit(1);
    });
    npmPackagesServer.on("close", (code) => {
      if (code !== 0) {
        spinner.error({
          text: " 💀💀 npm i for server failed due to invalid arguments",
          code,
        });
        process.exit(1);
      } else {
        spinner.success({ text: "Installed npm packages for server." });
      }
    });
  }
}

// run the npm init --y command
async function initServer(npmPackagesForServer, serverFolderName) {
  const spinner = createSpinner("Setting node js environment please wait  ...");
  spinner.start();
  const npmInitServer = spawn("npm", ["init", "--y"], {
    cwd: serverFolderName,
  });
  npmInitServer.on("error", (error) => {
    spinner.error({ text: " 💀💀 Error occurred in npm init", error });
    process.exit(1);
  });
  npmInitServer.on("close", (code) => {
    if (code !== 0) {
      spinner.error({ text: " 💀💀 Error occurred in npm init", code });
      process.exit(1);
    } else {
      installPackagesForServer(npmPackagesForServer, serverFolderName, true);
      spinner.success({ text: "npm init successfully." });
    }
  });
}

module.exports = { installPackagesForServer, initServer };
