<script setup lang="ts">
import { ref } from 'vue'
const money = ref('0')
const name = ref('')
const moneyFilter = ref({
    min: -10,
    // max: 100
})
const changeFilter = () => {
    moneyFilter.value = {
        min: 0,
        max: 1000
    }
}
</script>

<template>
  <div class="home">
    home1
    <el-input v-model="money" v-ipage-money="moneyFilter" placeholder="请输入金额"></el-input>
    <el-button @click="changeFilter">测试新参数</el-button>
    <el-input v-model="name" v-ipage-mask="'##ff##'"></el-input>
    <p>{{ money }}{{ typeof money }}</p>
    <p>{{ name }}</p>
  </div>
</template>

<style scoped lang="scss">

</style>