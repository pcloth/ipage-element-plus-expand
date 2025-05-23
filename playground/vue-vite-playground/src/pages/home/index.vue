<script setup lang="ts">
import { ref } from 'vue'
const images = ref([
  {
    "fileId": "1915232648825987074",
    "httpPath": "http://192.168.5.141:9880//v1/file/20250424/2025042410334100001528.jpg"
  }
])
// const images = ref("")
const disabled = ref(false)
const mode = ref('append')
const doDisabled = () => {
    disabled.value = !disabled.value
}

const changeMode = () => {
    mode.value = mode.value === 'template' ? 'append' : 'template'
}

const beforeRemove = (file: any, idx: number) => {
    console.log('beforeRemove', file, idx)
    return true;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(false)
        }, 1000)
    })
}

const uploadSuccess = (fileItem, res, fileList)=>{
    console.log('uploadSuccess', fileItem, res, fileList)
    fileItem.id = 'temp11'
}
</script>

<template>
  <div class="home">
    {{ images }}
    <div>
        <EasyUpload action="http://127.0.0.1:5000/upload" :beforeRemove="beforeRemove" 
        :mode="mode" 
        :disabled="disabled"  
        v-model="images" 
        :useWatermark="true"
        watermarkText="水印"
        valueFormat="array<object>"
        allowChangeWatermarkText
        :valueProps="{
            url: 'httpPath'
        }"
        @upload-success="uploadSuccess"
        >
        </EasyUpload>
    </div>
    <el-button @click="doDisabled">切换disabled {{ disabled }}</el-button>
    <el-button @click="changeMode">切换模式 {{ mode }}</el-button>
    <!-- <RenderCell v-model="rangeValue" :item="item"/> -->
  </div>
</template>

<style scoped lang="scss">

</style>