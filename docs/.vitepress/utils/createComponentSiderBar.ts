import fs from 'node:fs'

const docFiles = []
function getAllFiles (path){
    let files = fs.readdirSync(path);
    files.forEach((file,index) => {
        let curPath = path + "/" + file;
        if(fs.statSync(curPath).isDirectory()) {
            getAllFiles(curPath); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
        } else {
            if(file.split('.').pop() !== 'md') return
            docFiles.push(curPath); //如果是文件，就放入docFiles数组
        }
    });
}

/** 解析componentsPat目录下面的全部md文件 */
export function createComponentSiderBar() {
    getAllFiles('./docs/examples')
    console.log(docFiles,'docFiles')
    if (docFiles.length === 0) return
    const siderbar: {
        text: string
        link: string
    }[] = []
    let lastGroupLink = []
    let lastGroupLinkName = ""
    for (const file of docFiles) {
        const data = fs.readFileSync(file).toString()
        const match = data.match(/sider_text="([^"]*)"/)
        const pathGroup = file.split('/')
        const name = pathGroup.pop().split('.')[0]
        const nameGroup = pathGroup.pop()
        const link = `/examples/${nameGroup}/${name}`
        let text = name
        if (match && match.length > 1) {
            text = match[1]
        }
        if(!lastGroupLinkName ){
            lastGroupLinkName = nameGroup
            lastGroupLink = []
        }else if(lastGroupLinkName!==nameGroup){
            siderbar.push({
                text: lastGroupLinkName,
                // link: `/examples/${lastGroupLinkName}`,
                items:  lastGroupLink
            })
            lastGroupLinkName = nameGroup
            lastGroupLink = []
        }
        lastGroupLink.push({
            text,
            link,
        })
        // if (match && match.length > 1) {
        //     const text = match[1]

        //     siderbar.push({
        //         text,
        //         link,
        //     })
        // } else {
        //     siderbar.push({
        //         text: name,
        //         link,
        //     })
        // }
    }
    siderbar.push({
        text: lastGroupLinkName,
        items:  lastGroupLink
    })
    console.log(lastGroupLink,'lastGroupLink')
    return siderbar
}