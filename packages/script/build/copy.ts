import * as fs from 'fs';
import * as path from 'path';

const filesToCopy = [
    {
        file:"package.json",
        path:"../../components"
    },
    {
        file:"index.d.ts",
        path:"../../components"
    },
    {
        file:"README.md",
        path:"../../../"
    }
];
const destDir = path.resolve(__dirname, '../../../dist');

export const copyPackageFiles = () => {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    return new Promise((resolve, reject) => {
        filesToCopy.forEach(file => {
            const sourceFile = path.join(file.path, file.file);
            const destFile = path.join(destDir, file.file);
            console.log(`Copying ${file}...`, sourceFile, destFile);
            fs.copyFile(sourceFile, destFile, (err) => {
                if (err) {
                    console.error(`Error copying ${file}:`, err);
                    reject(err);
                } else {
                    console.log(`${file} copied successfully.`);
                    resolve(true);
                }
            });
        });
    })
}
