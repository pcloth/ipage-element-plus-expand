import * as fs from 'fs';
import * as path from 'path';

const filesToCopy: any = [
    {
        file: "package.json",
        path: "../../components"
    },
    {
        file: "README.md",
        path: "../../../"
    },
    {
        file: "type.d.ts",
        path: "../../components/src",
        destDir: "/es"
    }
];
const destDir = path.resolve(__dirname, '../../../dist');
export const copyPackageFiles = () => {
    
    return new Promise((resolve, reject) => {
        filesToCopy.forEach((file: any) => {
            const sourceFile = path.join(file.path, file.file);
            const destPath = destDir + (file.destDir || "")
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            let destFile = path.join(destPath, file.file);
            if (file.rename) {
                destFile = path.join(destPath, file.rename);
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
