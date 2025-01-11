import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../documents/.vitepress/dist');
const destDir = path.resolve(__dirname, '../docs');

fs.rmdirSync(destDir, { recursive: true });
fs.mkdirSync(destDir, { recursive: true });
// 复制目录下全部文件，包括子目录
function copy(src, dest) {
    const paths = fs.readdirSync(src);
    // 监测创建目录
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    paths.forEach((p) => {
        const _src = `${src}/${p}`;
        const _dest = `${dest}/${p}`;
        const stat = fs.statSync(_src);
        if (stat.isFile()) {
            fs.copyFileSync(_src, _dest);
        } else if (stat.isDirectory()) {
            copy(_src, _dest);
        }
    });
}
copy(srcDir, destDir);