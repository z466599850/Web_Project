<script setup>
import { ref } from 'vue'
import { UserUpdatePwdService } from '@/api/user.js'
import { useUserStore } from '@/stores/'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const form = ref()
const defaultForm = {
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
}
const formModel = ref({
  ...defaultForm
})

const rules = {
  old_pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    }
  ],
  re_pwd: [
    { required: true, message: '请再次确认新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.new_pwd) {
          callback(new Error('新密码和确认再次输入的密码不一样！'))
        }
        callback()
      },
      trigger: 'blur'
    }
  ]
}

const onUpdate = async () => {
  await form.value.validate()
  const { data } = await UserUpdatePwdService(formModel.value)
  ElMessage.success(data.message)
  formModel.value = { ...defaultForm }

  // 密码修改成功后
  // 1.清空本地存储
  userStore.removeToken()
  userStore.setUser({})

  router.push('/login')
}

const onReset = () => {
  formModel.value = { ...defaultForm }
}
</script>

<template>
  <page-container title="重置密码">
    <el-form v-loading="loading" ref="form" :model="formModel" :rules="rules">
      <el-form-item prop="old_pwd" style="margin-left: 30px" label="原密码">
        <el-input type="password" v-model="formModel.old_pwd"></el-input>
      </el-form-item>
      <el-form-item prop="new_pwd" style="margin-left: 30px" label="新密码">
        <el-input type="password" v-model="formModel.new_pwd"></el-input>
      </el-form-item>
      <el-form-item prop="re_pwd" label="确认新密码">
        <el-input type="password" v-model="formModel.re_pwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onUpdate" type="primary">修改密码</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style lang="scss" scoped>
.el-button {
  margin-left: 83px;
  padding: 20px 20px;
}
.el-input {
  height: 40px;
  width: 540px;
}
</style>
