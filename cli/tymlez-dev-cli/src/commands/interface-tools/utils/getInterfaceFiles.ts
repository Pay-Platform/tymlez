/* eslint-disable no-param-reassign */
import path from 'path';
import fs from 'fs';

const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file));
    }
  });

  return arrayOfFiles;
};

export async function getInterfaceFiles(inputPath = '') {
  const list = getAllFiles(path.join(inputPath, 'src'), []);

  return list.filter((x) => x.includes('.ts'));
}
