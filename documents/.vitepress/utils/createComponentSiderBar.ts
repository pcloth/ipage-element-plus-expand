import fs from 'node:fs'
import SiderTextConfig from "./siderTextConfig"
const docFiles: Array<string> = []
function getAllFiles(path: string) {
    let files = fs.readdirSync(path);
    files.forEach(file => {
        let curPath = path + "/" + file;
        if (fs.statSync(curPath).isDirectory()) {
            getAllFiles(curPath); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
        } else {
            if (file.split('.').pop() !== 'md') return
            docFiles.push(curPath); //如果是文件，就放入docFiles数组
        }
    });
}

type SideberType = {
    text: string
    link?: string
    items?: SideberType[]
}

/** 解析componentsPat目录下面的全部md文件 */
export function createComponentSiderBar() {
    getAllFiles('./documents/examples')
    if (docFiles.length === 0) return
    const siderbar: SideberType[] = []
    let lastGroupLink: SideberType[] = []
    let lastGroupLinkName: string = ""
    for (const file of docFiles) {
        const pathGroup: Array<string> = file.split('/')
        if (pathGroup.length < 2) {
            console.error('文件路径不正确', file)
            continue
        }
        const name = (pathGroup.pop() || '未知').split('.')[0]
        const nameGroup = pathGroup.pop() || '未知'
        const link = `/examples/${nameGroup}/${name}`
        let text: string = SiderTextConfig[link] || name
        if (!lastGroupLinkName) {
            lastGroupLinkName = nameGroup
            lastGroupLink = []
        } else if (lastGroupLinkName !== nameGroup) {
            const text_ = SiderTextConfig[lastGroupLinkName] || lastGroupLinkName
            siderbar.push({
                text: text_,
                items: lastGroupLink
            })
            lastGroupLinkName = nameGroup
            lastGroupLink = []
        }
        lastGroupLink.push({
            text,
            link,
        })
    }
    siderbar.push({
        text: SiderTextConfig[lastGroupLinkName] || lastGroupLinkName,
        items: lastGroupLink
    })
    return siderbar
}