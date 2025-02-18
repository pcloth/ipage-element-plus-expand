<script setup lang="ts">
import { ref } from 'vue'
const images = ref([
    {
        url: "https://fakeimg.pl/250x100?text=Hello1.pdf",
        name: "Hello1.jpg"
    },
    {
        url: "http://192.168.2.236:81/v1/file/20250114/2025011419575000001959.jpg",
        name: "Hello2.jpg"
    },
    {
        url:"https://media.w3.org/2010/05/sintel/trailer.mp4",
        name: "Hello3.mp4",
        // poster: "https://fakeimg.pl/250x100?text=Hello3.jpg"
        controls: false
    }
    ])
const disabled = ref(false)
const mode = ref('template')
const doDisabled = () => {
    disabled.value = !disabled.value
}

const changeMode = () => {
    mode.value = mode.value === 'template' ? 'append' : 'template'
}

const beforeRemove = (file: any, idx: number) => {
    console.log('beforeRemove', file, idx)
    return false;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(false)
        }, 1000)
    })
}

const rangeOptions = ref([
    {
        value:"0",
        label:"0点"
    },
    {
        value:"1",
        label:"1点"
    },
    {
        value:"2",
        label:"2点"
    },
    {
        value:"3",
        label:"3点"
    },
    {
        value:"4",
        label:"4点"
    },
    {
        value:"5",
        label:"5点"
    },
    {
        value:"6",
        label:"6点"
    },
    {
        value:"7",
        label:"7点"
    },
    {
        value:"8",
        label:"8点"
    },
    {
        value:"9",
        label:"9点"
    },
    {
        value:"10",
        label:"10点"
    },
    {
        value:"11",
        label:"11点"
    },
    {
        value:"12",
        label:"12点"
    },
    {
        value:"13",
        label:"13点"
    },
    {
        value:"14",
        label:"14点"
    },
    {
        value:"15",
        label:"15点"
    },
    {
        value:"16",
        label:"16点"
    },
    {
        value:"17",
        label:"17点"
    },
    {
        value:"18",
        label:"18点"
    },
    {
        value:"19",
        label:"19点"
    },
    {
        value:"20",
        label:"20点"
    },
    {
        value:"21",
        label:"21点"
    },
    {
        value:"22",
        label:"22点"
    },
    {
        value:"23",
        label:"23点"
    }
])
const rangeValue = ref([])
</script>

<template>
  <div class="home">
    
    <div>
        <EasyUpload :beforeRemove="beforeRemove" :mode="mode" :disabled="disabled"  v-model="images" :limit="0">
            <!-- <template v-slot:upload-button="{upload}">
                <el-button @click="upload">上传</el-button>
            </template> -->
            <!-- <template v-slot:name="{file}">
                <div style="height:100px;">alsdf{{ file.name }}</div>
            </template> -->
        </EasyUpload>
    </div>
    <el-button @click="doDisabled">切换disabled {{ disabled }}</el-button>
    <el-button @click="changeMode">切换模式 {{ mode }}</el-button>
    
    <RangeSelect :disabledValues="['0']" v-model="rangeValue" :options="rangeOptions"/>
  </div>
</template>

<style scoped lang="scss">

</style>