import fs from 'node:fs'
import SiderTextConfig from "../config/siderTextConfig"
const SiderTextConfigKeys = Object.keys(SiderTextConfig)

/** 从SiderTextConfig中拿到配置和排序 */
const getNameAndSort = (key: string) => {
    const name = SiderTextConfig[key] || key
    const index = SiderTextConfigKeys.indexOf(key) || 0
    return { name, index }
}

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
    _sort?: number // 排序字段，添加_前缀避免vitepress自己用到污染
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
        let { name: text, index } = getNameAndSort(link)
        if (!lastGroupLinkName) {
            lastGroupLinkName = nameGroup
            lastGroupLink = []
        } else if (lastGroupLinkName !== nameGroup) {
            let { name: text_, index:sort_ } = getNameAndSort(lastGroupLinkName)
            siderbar.push({
                text: text_,
                _sort: sort_,
                items: lastGroupLink
            })
            lastGroupLinkName = nameGroup
            lastGroupLink = []
        }
        lastGroupLink.push({
            text,
            _sort:index,
            link,
        })
    }
    let { name: text_, index:sort_ } = getNameAndSort(lastGroupLinkName)
    siderbar.push({
        _sort: sort_,
        text: text_,
        items: lastGroupLink
    })

    // 重新排序
    siderbar.sort((a, b) => a._sort - b._sort)
    siderbar.forEach(item => {
        if (item.items) {
            item.items.sort((a, b) => a._sort - b._sort)
        }
    })
    return siderbar
}