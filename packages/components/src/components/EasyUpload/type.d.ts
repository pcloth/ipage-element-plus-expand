/**
 * 
 * status:  
 * load = 加载文件
 * waitUpload = 等待上传(同时选中多个的时候，只有一个文件在上传)
 * croping = 裁剪中
 * croped = 裁剪完成
 * uploading = 上传中
 * success = 上传成功
 * error = 各种失败
 */
type FileType = {
    uuid: string;
    name: string;
    status: 'load' | 'waitUpload' | 'croping' | 'croped' | 'uploading' | 'success' | 'error';
    error?: string;
    appect?: string;
    [key: string]: any;    
}