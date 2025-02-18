/** 生成uuid */
export const getUuid = (len: number, radix: number) => {
    const chars =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
            ""
        );
    const uuid = [];
    let i: number;
    radix = radix || chars.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
    } else {
        // rfc4122, version 4 form
        let r: number;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
        uuid[14] = "4";

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16);
                uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join("");
};

export const testIsBase64 = (fileStr: string) => {
    return /^data:image/.test(fileStr);
};

export const getFileSuffix = (src:string)=>{
    const isBase64 = testIsBase64(src)
    if(isBase64){
        return 'BASE64'
    }
    // 根据文件后缀判断文件类型
    const suffix = src.split('.').pop()||""
    return suffix.toUpperCase()
}

/** 默认支持的accept */
export const imageTypes = ['PNG', 'JPG', 'JPEG']
export const videoTypes = ['MP4', 'AVI']

export const createAccept = (types:string[])=>{
    console.log(types.map(item=>`.${item.toLowerCase()}`).join(','))
    return types.map(item=>`.${item.toLowerCase()}`).join(',')
}

export const fileType = (src:string)=>{
    const isBase64 = testIsBase64(src)
    if(isBase64){
        return 'img'
    }
    // 根据文件后缀判断文件类型
    const suffix = getFileSuffix(src)
    
    if(imageTypes.includes(suffix)){
        return 'img'
    }
    if(videoTypes.includes(suffix)){
        return 'video'
    }
    return 'file'
}

export const getName = (item:any) => {
    if (typeof item === "string") {
        // 是一个url或者base64图片
        if (item.indexOf("base64") !== -1) {
            // 正则获取图片格式
            const reg = /data:image\/(\w+);base64,/;
            const result = item.match(reg);
            if (result) {
                return "base64图片" + getUuid(4, 17) + "." + result[1];
            } else {
                return "base64图片" + getUuid(4, 17) + ".png";
            }
        } else {
            // 是一个url
            const arr = item.split("/");
            return arr[arr.length - 1];
        }
    }
};

/** 生成hash */
export const getHash = (str: string) => {
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

/** 
 * 把一个未知方法封装成promise，它可能是一个异步方法，也可能是一个同步方法
 */
export const promisify = (fn: Function, ...args: any[]) => {
    return new Promise((resolve, reject) => {
        try {
            const result = fn(...args);
            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
};