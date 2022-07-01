import names from "all-the-package-names";

export function checkPackages(packages: string[]): string | true {
  let result = true;
  let wrongPackage = "";
  packages[0] !== ""
    ? packages.forEach(function (module) {
        if (!names.includes(module)) {
          result = false;
          wrongPackage = module;
          return;
        }
      })
    : (result = true);
  if (result) return true;
  else return `${wrongPackage} does not exist please check once`;
}
