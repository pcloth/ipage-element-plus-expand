<template>
    <div :class="props.uploadClass">
        <slot :fileList="fileList" name="default">
            <template v-for="file, idx in fileList" :key="file.uuid">
                <div class="easy-upload-review-item-outside">
                    <div :style="mergeReviewItemStyle" :class="mergeReviewClass(file)">
                        <!-- 如果是template模式下，如果没有图片，显示上传按钮 -->
                        <template v-if="!props.disabled && props.mode === 'template' && !file[props.valueProps.url]">
                            <slot name="upload-button" :upload="hanldeClickUpload" :file="file">
                                <div :class="[props.uploadButtonClass, 'template-upload']" :style="mergeReviewItemStyle"
                                    @click.stop="hanldeClickUpload(file)">
                                    + 点击上传
                                </div>
                            </slot>
                        </template>
                        <template
                            v-else-if="props.disabled && props.mode === 'template' && !file[props.valueProps.url]">
                            <div class="upload-no-data">{{ props.noDataText }}</div>
                        </template>
                        <img v-else-if="_getFileType(file) === 'img'" class="review-image"
                            :src="file[props.valueProps.url]" alt="" />
                        <video v-else-if="_getFileType(file) === 'video'" class="review-image"
                            :poster="file[props.valueProps.poster]" :controls="file[props.valueProps.controls]"
                            :src="file[props.valueProps.url]"></video>
                        <div v-else class="review-image">
                            {{ getFileSuffix(file[props.valueProps.url]) }}
                        </div>
                        <div class="easy-upload-review-item-mask">
                            <img @click.stop="viewImage(file)" title="预览"
                                v-if="['img', 'video'].includes(_getFileType(file))"
                                class="easy-upload-review-item-mask-btn-icon" src="./images/view-fill.png"></img>
                            <img @click.stop="downloadFile(file)" title="下载" v-else
                                class="easy-upload-review-item-mask-btn-icon" src="./images/download.png"></img>
                            <img @click.stop="remoteFile(file, idx)" v-if="!props.disabled" title="删除"
                                class="easy-upload-review-item-mask-btn-icon" src="./images/delete-fill.png"></img>
                        </div>

                        <div class="easy-upload-review-item-progress">
                            <!-- 上传进度 -->
                        </div>

                    </div>
                    <slot name="name" :file="file">
                        <div v-if="props.showItemName && !file.error" class="easy-upload-review-item-title"
                            :style="mergeItemTitleStyle">{{
                                file.name
                            }}</div>
                    </slot>
                    <div v-if="file?.status === 'error'" class="easy-upload-review-item-error">
                        <!-- 上传失败 -->
                        {{ file.error }}
                    </div>
                </div>
            </template>
            <template v-if="(props.disabled || props.mode === 'template') && fileList.length === 0">
                <div class="easy-upload-review-item-outside">
                    <div :style="mergeReviewItemStyle" :class="mergeReviewClass({})">
                        <div class="upload-no-data">{{ props.noDataText }}</div>
                    </div>
                </div>

            </template>
        </slot>
        <slot v-if="showUploadButton" name="upload-button" :upload="hanldeClickUpload" :file="null">
            <div class="easy-upload-review-item-outside">
                <div :class="mergeUploadButtonClass(currentItem)" :style="mergeReviewItemStyle"
                    @click.stop="hanldeClickUpload()">
                    + {{ props.uploadButtonText }}

                </div>
                <div v-if="currentItem?.status === 'error'" class="easy-upload-review-item-error" >
                    {{ currentItem?.error }}
                </div>
            </div>
        </slot>
        <ReviewBox :zIndex="props.zIndex" v-model:show="showReviewBox" :src="currentSrc" :isVideo="currentSrcIsVideo" />
        <Cropper @cancel="cancelUpload" v-model:show="showCropper" :zIndex="props.zIndex" :src="currentSrc"
            :src-item="currentItem" :useWatermark="props.useWatermark" :quality="props.quality" :useZoom="props.useZoom"
            :forceZoom="props.forceZoom"
            :zoomLimit="props.zoomLimit" :watermarkText="props.watermarkText" :watermarkFunc="props.watermarkFunc"
            :allowChangeWatermarkTextText="props.allowChangeWatermarkTextText" @cropped="onCropped" />
    </div>
</template>
<script setup lang="tsx">
import { defineProps, ref, computed, onMounted } from 'vue'
import props_ from './props'
import {
    promisify,
    imageTypes,
    videoTypes,
    createAccept,
    getUuid,
    getName,
    fileType,
    testIsBase64,
    getFileSuffix,
    makeWatermark,
    zoomImage,
    suffixToType,
    getFileFormatToCanvasType,
    getObjectValueByPath
} from './utils'
import ReviewBox from './reviewBox.vue'
import Cropper from './cropper.vue'
const _getFileType = (item: any) => {
    return fileType(item[props.valueProps.url] || "")
}

const emits = defineEmits([
    "openfile",
    "cropped",
    "beforce-upload",
    "upload-success",
    "upload-error",
    "upload-progress",
    "update:modelValue",
    "file-error",
    "delete-file",
    "before-remove",
    "before-upload",
    "update:watermarkText"
]);

const props = defineProps(props_)
const fileList = ref<any>([])


/** 从modelvalue获取文件列表 */
const getModelValue = () => {
    let arr: any = [];
    if (!props.modelValue) return arr;
    if (props.valueFormat === "array") {
        arr = props.modelValue;
    } else if (props.valueFormat === "string") {
        if (!props.modelValue) {
            arr = [];
        } else if (typeof props.modelValue === "string") {
            if (testIsBase64(props.modelValue)) {
                return [
                    {
                        uuid: getUuid(12, 17),
                        name: "base64图片" + getUuid(4, 17) + ".png",
                        src: props.modelValue,
                        status: "success",
                        isBase64: true
                    }
                ];
            }
            arr = props.modelValue.split(props.valueSplit).filter(item => item);
        } else if (Array.isArray(props.modelValue)) {
            arr = props.modelValue;
        } else {
            console.error(
                "ve-cropper组件valueFormat配置错误1",
                props.modelValue
            );
        }
    } else {
        console.error("ve-cropper组件valueFormat配置错误2", props.modelValue);
    }
    arr = arr.map((item: any) => {
        if (typeof item === 'object') {
            if (!item.uuid) item.uuid = getUuid(12, 17);
            if (!item.name) item.name = getName(item[props.valueProps.url]);
            if (!item.status) item.status = "success";
            if (!item.type) item.type = fileType(item[props.valueProps.url]);
            return item
        }
        const obj = fileList.value.find((it: any) => it[props.valueProps.url] === item);
        const uuid = obj?.uuid || getUuid(12, 17);
        const name = obj?.name || getName(item);
        return {
            uuid,
            [props.valueProps.name]: name,
            [props.valueProps.url]: item,
            status: "success",
            type: fileType(item)
        };
    });
    return arr;
};

/** 输出modelValue */
const outPutValue = () => {
    const arr: any = [];
    fileList.value.forEach((item: any) => {
        if (item.status === "success") {
            arr.push(item.src);
        }
    });
    if (props.valueFormat === "array") {
        emits("update:modelValue", arr);
    } else if (props.valueFormat === "string") {
        emits("update:modelValue", arr.join(props.valueSplit));
    } else {
        console.error("ve-cropper组件valueFormat配置错误");
    }
};

const mergeReviewItemStyle = computed(() => {
    const style_: any = {};
    if (typeof props.itemWidth === 'number') {
        style_['width'] = props.itemWidth + 'px'
    } else {
        style_['width'] = props.itemWidth
    };

    if (typeof props.itemHeight === 'number') {
        style_['height'] = props.itemHeight + 'px'
    } else {
        style_['height'] = props.itemHeight
    };
    return style_;
});

const mergeItemTitleStyle = computed(() => {
    const style_: any = {};
    if (typeof props.itemWidth === 'number') {
        style_['width'] = props.itemWidth + 'px'
    } else {
        style_['width'] = props.itemWidth
    };
    return style_;
});

const mergeReviewClass = computed((file: any) => {
    return (file: any) => {
        let status = file.status === 'success' ? 'success' : 'error'
        return [props.reviewClass, {
            'easy-upload-review-item-disabled': props.disabled,
            'easy-upload-review-item-template': props.mode === 'template',
            'is-upload': props.mode === 'template' && !file[props.valueProps.url],
            'is-error': file.status === 'error',
        }]
    }
});

const mergeUploadButtonClass = computed((file: any) => {
    return (file: any) => {
        return [props.uploadButtonClass, 'template-upload', {
            'is-error': file?.status === 'error',
        }]
    }
});




onMounted(() => {
    fileList.value = getModelValue();
});

const showUploadButton = computed(() => {
    let status = props.disabled ? false : true
    // 检查当前文件数量是否满足
    if (status && props.limit > 0 && fileList.value.length >= props.limit) {
        status = false
    }
    if (props.mode === 'template') {
        // 模板模式下，不显示最后的上传按钮
        status = false
    }
    return status
})

// 当前正在操作的文件
const currentItem = ref<any>(null)
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
const createNewItem = (params: any = {}): FileType => {
    return {
        uuid: getUuid(12, 17),
        name: params.name || '',
        [props.valueProps.url]: params.url || '',
        status: params.status || '',
        accept: params.accept || props.accept,
        error: params.error || ''
    }
}
const hanldeClickUpload = (item: any = null) => {
    // 如果是模板模式下，上传后替换当前模板的图片
    if (props.disabled) return;
    if (props.mode === 'template' && !item) {
        throw new Error('模板模式下，必须传入item')
    }
    currentItem.value = item ? item : createNewItem()
    currentItem.value.status = 'load'
    let accept = props.accept;
    if (props.mode === 'template') {
        if (item[props.valueProps.accept]) {
            accept = item[props.valueProps.accept]
        } else if (item[props.valueProps.type]) {
            const type = item[props.valueProps.type]
            if (type === 'img') {
                accept = createAccept(imageTypes)
            } else if (type === 'video') {
                accept = createAccept(videoTypes)
            } else {
                accept = "*.*"
            }
        }
    }
    currentItem.value.accept = accept
    // 打开文件选择框
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = false;
    input.onchange = inputOnChange;
    input.click();
};

const cancelUpload = () => {
    currentItem.value[props.valueProps.url] = ''
    currentItem.value.raw = ''
    // currentItem.value.status = 'error'
    // currentItem.value.error = '用户取消'
}

const inputOnChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    emits("openfile", file);
    // @ts-ignore // 上传前检查
    const _beforeUpload = props.beforeUpload ? props.beforeUpload : () => Promise.resolve(true)
    await promisify(_beforeUpload, file)
    if (!beforeUpload(file, currentItem)) {
        return
    }
    currentItem.value.status = 'waitUpload'
    currentItem.value.raw = file
    const type = fileType(file.name);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e: any) => {
        const base64 = e.target.result;
        // currentItem.value[props.valueProps.url] = base64;
        currentItem.value.raw = base64;
        currentSrc.value = base64
        currentItem.value.name = file.name;
        currentItem.value.type = type;
        currentItem.value.status = 'croping'
        // 如果是图片，并允许手动剪裁打开裁剪框
        if (type === 'img') {
            if (props.useCropper) {
                showCropper.value = true
                return
            }
        }
        // 直接上传
        await prepareToUpload(currentItem.value)
    };
};

const beforeUpload = (file: any, templateItem: any) => {
    const sizeMb = file.size / 1024 / 1024;
    let status = true;
    let limitSizeMb = props.size;
    if (templateItem.value && templateItem.value[props.valueProps.size]) {
        limitSizeMb = templateItem.value[props.valueProps.size];
    }
    if (limitSizeMb && sizeMb > limitSizeMb) {
        templateItem.value.status = "error";
        templateItem.value.error = "文件大小超限";
        emits("file-error", {
            type: "size",
            file,
            limitSizeMb
        });
        status = false;
    }

    let minSizeMb = props.minSize;
    if (templateItem.value && templateItem.value[props.valueProps.minSize]) {
        minSizeMb = templateItem.value[props.valueProps.minSize];
    }
    if (minSizeMb && sizeMb < minSizeMb) {
        templateItem.value.status = "error";
        templateItem.value.error = "文件大小不足";
        emits("file-error", {
            type: "minSize",
            file,
            minSizeMb
        });
        status = false;
    }
    return status;
};

const showReviewBox = ref(false)
const currentSrc = ref('')
const currentSrcIsVideo = ref(false)
const viewImage = (file: any) => {
    // 打开图片预览
    currentSrc.value = file[props.valueProps.url]
    currentSrcIsVideo.value = _getFileType(file) === 'video'
    showReviewBox.value = true

};

const downloadFile = (file: any) => {
    // 下载文件
    const a = document.createElement("a");
    a.href = file[props.valueProps.url];
    a.download = file[props.valueProps.name];
    a.target = "_blank";
    a.click();
};

const remoteFile = async (file: any, idx: number) => {
    // 删除文件
    if (props.disabled) return;
    if (props.beforeRemove) {
        const status = await promisify(props.beforeRemove, file, idx)
        if (!status) return;
    }
    if (props.mode === 'template') {
        file[props.valueProps.url] = ''
    } else if (props.mode === 'append') {
        fileList.value.splice(idx, 1);
    } else {
        throw new Error('mode配置错误')
    }
    outPutValue();
    emits("delete-file", file, idx);
};

const onCropped = async (fileblob: any) => {
    // 裁剪完成
    // console.log('裁剪完成', fileblob)
    currentItem.value.raw = fileblob
    await prepareToUpload(currentItem.value)
}

/** 
 * 上传文件：之前需要检查是否允许手动剪裁处理，是否需要强制缩放，是否需要加水印
 */
const prepareToUpload = async (fileItem: any) => {
    // 上传文件
    let fileBlob = fileItem.raw
    if (typeof fileBlob === 'string') {
        // base64
        fileBlob = await fetch(fileBlob).then(res => res.blob())
    }
    if (!props.useCropper) {
        // 是否需要强制缩放
        if (props.useZoom && props.forceZoom) {
            fileBlob = await zoomImage(fileBlob, props.zoomLimit)
        }
        // 是否需要加水印
        if (props.useWatermark && (props.watermarkText || props.watermarkFunc)) {
            fileBlob = await makeWatermark(fileBlob, props.watermarkText, props.watermarkFunc)
        }
    }
    let convertType = getFileFormatToCanvasType(fileItem.name || "")
    if (props.convertExt) {
        convertType = suffixToType(props.convertExt)
        fileItem.name = fileItem.name.replace(/\.\w+$/, `.${props.convertExt}`)
    }
    // 最后一次转换，处理格式和质量 preview
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = URL.createObjectURL(fileBlob)
    img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0, img.width, img.height)
        canvas.toBlob((blob) => {
            fileItem.raw = blob
            fileItem.status = 'uploading'
            // const img = document.createElement('img')
            // img.src = URL.createObjectURL(fileBlob)
            // console.log('最后处理完的图片', fileBlob, convertType, fileItem)
            // document.body.appendChild(img)
            uploadFile(fileItem)
        }, convertType, props.quality)
    }

}

const uploadFile = async (fileItem: any) => {
    // 上传文件
    const formData = new FormData();
    formData.append(props.fileName, fileItem.raw, fileItem.name);
    emits("beforce-upload", fileItem);
    let res = null
    if (props.uploadFunc) {
        try {
            res = await props.uploadFunc(fileItem);
        } catch (error) {
            fileItem.status = 'error'
            fileItem.error = error
            emits("upload-error", fileItem);
            return
        }

    } else if (props.action) {
        const formData = new FormData();
        formData.append('file', fileItem.raw, fileItem.name);
        if (props.data) {
            for (let key in props.data) {
                formData.append(key, props.data[key])
            }
        }
        const headers = props.headers || {}
        try {
            res = await fetch(props.action, {
                method: 'POST',
                headers: headers,
                body: formData
            }).then(res => res.json())
        } catch (error) {
            fileItem.status = 'error'
            fileItem.error = error
            emits("upload-error", fileItem);
            return
        }
    } else {
        throw new Error('请配置uploadFunc或者action')
    }
    const url = getObjectValueByPath(res, props.responseSrcPath, null)
    if (!url) {
        throw new Error('上传失败，未获取到url，请检查responseSrcPath配置或者接口返回')
    }
    fileItem.status = 'success'
    fileItem[props.valueProps.url] = url
    fileItem[props.valueProps.name] = fileItem.name
    emits("upload-success", fileItem);
    if(props.mode === 'append'){
        fileList.value.push(fileItem)
    }
    outPutValue()
    showCropper.value = false
}


const showCropper = ref(false)

</script>
<style lang="scss">
@import './style.scss'
</style>