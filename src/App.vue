<script setup>
// 在 Vue3 CompositionAPI 中
// 1. 获取路由对象 router useRouter
//    const router = useRouter()
// 2. 获取路由参数 route useRoute
//    const route = useRoute()
// 也需要导入
import { useRouter, useRoute } from 'vue-router'
import { useUserStore, useCounterStore } from '@/stores'
const router = useRouter()
const route = useRoute()
console.log(router)
console.log(route)

const userStore = useUserStore()
const counterStore = useCounterStore()
</script>

<template>
  <router-view></router-view>
  <hr />
  <hr />
  <div>我是APP</div>
  <p>{{ userStore.token }}</p>
  <el-button>你好</el-button>
  <el-button @click="userStore.setToken('2132132131dsdsaa32')">登录</el-button>
  <el-button @click="userStore.removeToken()">退出</el-button>
  <hr />
  <p>{{ counterStore.count }}</p>
  <el-button @click="counterStore.addCount(2)">加2</el-button>
</template>
