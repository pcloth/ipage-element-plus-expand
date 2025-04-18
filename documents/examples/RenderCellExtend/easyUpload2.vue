<template>
    <div class="pages">
        <RenderCell v-model="images" :item="item"></RenderCell>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const images = ref('')

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
        uploadFunc: uploadFunc,
        responseSrcPath: 'data.linkPath',
    }
})
</script>

<style lang="scss">

</style>