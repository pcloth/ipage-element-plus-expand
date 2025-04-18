<template>
    <div class="pages">
        <div class="easy-upload-title">
            当前value：{{ images }}
        </div>
        <RenderCell v-model="images" :item="item"></RenderCell>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const images = ref('https://picsum.photos/200/200?random=2.jpg')
const item = ref({
    id:'images',
    slot:'easy-upload',
    props:{
        action: 'http://127.0.0.1:5000/upload',
        responseSrcPath: 'data.linkPath',
        headers: {
            token:'123456'
        },
        // 业务附加数据，放到data参数下
        data:{
            orderId:'1222'
        }
    }
})
</script>

<style lang="scss">

</style>