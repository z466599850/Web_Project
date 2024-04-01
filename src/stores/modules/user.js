import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    // 存储用户基本信息
    const user = ref({})

    const setUser = (obj) => {
      user.value = obj
    }
    const getUser = async () => {
      const {
        data: { data }
      } = await userGetInfoService()
      user.value = data
    }
    return {
      token,
      user,
      setToken,
      setUser,
      getUser,
      removeToken
    }
  },
  {
    persist: {
      key: 'big-token',
      paths: ['token']
    }
  }
)
