<script setup lang="ts">
import { ref } from 'vue'
// const images = ref([
//     {
//         url: "https://fakeimg.pl/250x100?text=Hello1.pdf",
//         name: "Hello1.jpg",
//         accept: ".pdf,.jpg",
//         // type: "file",
//         // size:0.1
//     },
//     {
//         url: "http://192.168.2.236:81/v1/file/20250114/2025011419575000001959.jpg",
//         name: "Hello2.jpg"
//     },
//     {
//         url:"https://media.w3.org/2010/05/sintel/trailer.mp4",
//         name: "Hello3.mp4",
//         // poster: "https://fakeimg.pl/250x100?text=Hello3.jpg"
//         controls: false
//     }
//     ])
const images = ref("")
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

</script>

<template>
  <div class="home">
    
    <div>
        <EasyUpload action="http://127.0.0.1:5000/upload" :beforeRemove="beforeRemove" 
        :mode="mode" 
        :disabled="disabled"  
        v-model="images" 
        :useWatermark="true"
        watermarkText="水印"
        allowChangeWatermarkText
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