<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 在 Vue3 CompositionAPI 中
// 1. 获取路由对象 router useRouter
//    const router = useRouter()
// 2. 获取路由参数 route useRoute
//    const route = useRoute()
// 也需要导入
// import { useRouter, useRoute } from 'vue-router'
// import { useUserStore, useCounterStore } from '@/stores'
// const router = useRouter()
// const route = useRoute()
// console.log(router)
// console.log(route)

// const userStore = useUserStore()
// const counterStore = useCounterStore()
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>
