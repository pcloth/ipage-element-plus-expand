import { rmdirSync, existsSync, readdirSync, unlinkSync, statSync } from 'fs';
import { join } from 'path';

export async function delPath (path: string) {
    if (existsSync(path)) {
        if (statSync(path).isDirectory()) {
            const files = readdirSync(path);
            for (const file of files) {
                const curPath = join(path, file);
                if (statSync(curPath).isDirectory()) {
                    delPath(curPath); // 递归删除子目录
                } else {
                    unlinkSync(curPath); // 删除文件
                }
            }
            rmdirSync(path); // 删除空目录
        } else {
            unlinkSync(path); // 删除文件
        }
    }
}
