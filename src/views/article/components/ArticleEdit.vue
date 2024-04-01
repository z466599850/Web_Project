<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import axios from 'axios'
import {
  artPublishService,
  artGetDetailService,
  artUpdateInfoService
} from '@/api/article.js'
import { baseURL } from '@/utils/request.js'
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)

const defaultForm = {
  title: '', // 标题
  cate_id: '', // 分类id
  content: '', // 封面图片 file 对象
  cover_img: '', // string 内容
  state: '' // 状态
}
const formRef = ref()
// 准备数据
const formModel = ref({ ...defaultForm })
const imgUrl = ref('')
const editorRef = ref()

// 组件对外暴露一个方法 open，基于open传来的参数，区分添加还是编辑
// open({}) => 表单无需渲染，说明还是添加
// open({id,...,...}) => 表单需要渲染，说明是编辑
// open调用后，可以打开抽屉
const open = async (row) => {
  visibleDrawer.value = true // 显示抽屉
  if (row.id) {
    // 编辑回显，获取详情数据
    const {
      data: { data }
    } = await artGetDetailService(row.id)
    formModel.value = data
    imgUrl.value = baseURL + formModel.value.cover_img
    // 注意：提交给后台，需要的数据格式，是file对象格式
    // 需要将网络图片地址 => 转换成 file对象，存储起来
    formModel.value.cover_img = await imageUrlToFile(
      imgUrl.value,
      formModel.value.cover_img
    )
  } else {
    // 发布回显，数据清空
    imgUrl.value = ''
    formModel.value = { ...defaultForm } // 基于默认的数据，重置form数据
    editorRef.value.setHTML('')
  }
}

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

// 对外暴露
defineExpose({
  open
})

const onSelectFile = (uploadFile) => {
  console.log(uploadFile.raw)
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}

const emit = defineEmits(['success'])
// 提交
const onPublish = async (state) => {
  // 将已发布还是草稿状态，存入 formModel
  formModel.value.state = state

  // 注意：当前接口，需要的是 formData 对象
  // 将普通对象 => 转换成 => formData 对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 发请求
  if (formModel.value.id) {
    console.log('编辑操作')
    const { data } = await artUpdateInfoService(fd)
    ElMessage.success(data.message)
    visibleDrawer.value = false

    emit('success', 'edit')
  } else {
    // 添加操作
    console.log(fd)
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false

    // 通知到父组件
    emit('success', 'add')
  }
}
</script>
<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          style="width: 100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭 element-plus 的自动上传，不需要配置 action 等参数
              只需要做前端的本地预览图片即可，无需在提交前上传图标
              语法：URL.createObjectURL(...) 创建本地预览的地址，来预览
        -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor" style="width: 100%">
          <quill-editor
            ref="editorRef"
            v-model:content="formModel.content"
            content-type="html"
            style="height: 150px"
            theme="snow"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
</style>
