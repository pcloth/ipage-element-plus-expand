import * as fs from 'fs';
import * as path from 'path';

const filesToCopy:any = [
    {
        file:"package.json",
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
        filesToCopy.forEach((file:any) => {
            const sourceFile = path.join(file.path, file.file);
            let destFile = path.join(destDir, file.file);
            if(file.rename){
                destFile = path.join(destDir, file.rename);
            }
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
