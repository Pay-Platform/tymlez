export function getChangedMiddlewares(changedPackagesText: string | undefined) {
  const changedPackages = changedPackagesText
    ?.split(',')
    .map((pkg) => pkg.trim())
    .filter(Boolean);
  console.log(
    'Changed Packages ',
    JSON.stringify(changedPackages, undefined, 2),
  );
  return changedPackages?.filter((pkg) => pkg.endsWith('-middleware'));
}
