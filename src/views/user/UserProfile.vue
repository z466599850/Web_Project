<script setup>
import { ref } from 'vue'
import { userGetInfoService, userPutUserInfoService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/'
const userStore = useUserStore()
const form = ref()
const loading = ref(false)
const formModel = ref({
  id: '',
  username: '',
  nickname: '',
  email: '',
  user_pic: ''
})

const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 1, max: 10, message: '用户昵称1-10个字符', trigger: 'blur' }
  ],
  email: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }]
}

const getInfo = async () => {
  const {
    data: { data }
  } = await userGetInfoService()
  console.log(data)
  formModel.value = data
}

const submit = async () => {
  await form.value.validate()
  loading.value = true
  const { data } = await userPutUserInfoService(formModel.value)
  console.log(data)
  ElMessage.success('修改成功')
  userStore.setUser(userStore.getUser())
  loading.value = false
}

getInfo()
</script>
<template>
  <page-container title="基本资料">
    <el-form v-loading="loading" :rules="rules" ref="form" :model="formModel">
      <el-form-item style="margin-left: 6px" label="登录名称">
        <el-input v-model="formModel.username" disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="formModel.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="formModel.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="submit"
          style="margin-left: 70px; padding: 20px 20px"
          type="primary"
          >提交修改</el-button
        >
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style lang="scss" scoped>
.el-form {
  margin-left: 26px;
}

.el-input {
  height: 40px;
  width: 488px;
}
</style>
