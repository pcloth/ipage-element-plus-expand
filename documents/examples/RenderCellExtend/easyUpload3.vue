<template>
    <div class="pages">
        <RenderCell v-model="images" :item="item"></RenderCell>
    </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
const images = ref([
    {
        url: "",
        title: "身份证正面",
        accept: ".jpg",
    },
    {
        url: "",
        title: "身份证背面",
        accept: ".jpg",
    },
    {
        url: "",
        title: "尺寸测试0.1MB",
        size: 0.1,
        accept: "*.*",
    },
    {
        url:"https://media.w3.org/2010/05/sintel/trailer.mp4",
        title: "手持身份证录制视频",
        controls: false
    }
    ])

const uploadFunc = (fileItem:any)=>{
    console.log('uploadFunc',fileItem)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 模拟上传成功，fileItem.raw里的数据转换成浏览器可访问的url

            const reader = new FileReader()
            reader.readAsDataURL(fileItem.raw)
            reader.onload = () => {
                resolve({
                    // 这里返回的结构，需要和responseSrcPath配置一致
                    data: {
                        linkPath: reader.result,
                    },
                })
            }
            reader.onerror = () => {
                reject(new Error('File upload failed'))
            }
        }, 1000)
    })
}
const item = ref({
    id:'images',
    slot:'easy-upload',
    props:{
        mode:'template',
        uploadFunc: uploadFunc,
        responseSrcPath: 'data.linkPath',
    }
})
</script>

<style lang="scss">

</style>