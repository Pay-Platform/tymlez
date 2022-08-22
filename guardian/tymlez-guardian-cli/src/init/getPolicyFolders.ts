import path from 'path';
import fs from 'fs';

const { readdir } = fs.promises;

export async function getPolicyFolders() {
  const policiesDir = path.join(
    __dirname,
    'policies',
    process.env.CLIENT_NAME?.toLocaleLowerCase() || 'tymlez',
  );
  return (await readdir(policiesDir, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.join(policiesDir, dirent.name));
}
