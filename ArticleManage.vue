<script setup>
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import {
  articleGetManageService,
  articleGetChannelListService,
  articleAddManageService,
  articleDelManageService,
  articleGetManageInfoService
} from '@/api/article'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ElMessage } from 'element-plus'
const manageList = ref([])
const channelList = ref([])
const publishStatus = ref('')
const channel = ref('')
const loading = ref(false)
const disabled = ref(true)
const drawer = ref(false)
const drawerTitle = ref('')
const form = ref()
const imgUrl = ref('')

const formModel = ref({
  title: '',
  cate_name: '',
  cover_img: '',
  content: ''
})
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
  ],
  cate_name: [{ required: true, message: '请选择文章分类' }],
  cover_img: [{ required: true, message: '请上传封面图' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}

const getChannelList = async () => {
  loading.value = true
  const {
    data: { data }
  } = await articleGetChannelListService()
  loading.value = false
  channelList.value = data
}
getChannelList()
const getManage = async () => {
  console.log(new Date().toLocaleString())
  loading.value = true
  const { data } = await articleGetManageService({ pagenum: 1, pagesize: '10' })
  loading.value = false
  console.log(data)
  manageList.value = data.data
}
getManage()

const onEditManage = async (row, $index) => {
  console.log('我是编辑文章')
  console.log(row, $index)
  drawer.value = true
  drawerTitle.value = '编辑文章'
  const {
    data: { data }
  } = await articleGetManageInfoService(row.id)
  formModel.value = data
}

const addManage = () => {
  console.log('我是发布文章')
  drawer.value = true
  drawerTitle.value = '发布文章'
}

const publishArticle = async () => {
  console.log('我是发布按钮')
  console.log(imgUrl.value)
  if (imgUrl.value !== '') {
    formModel.value.cover_img = '1'
  }
  await form.value.validate()
  const cateId = channelList.value.find(
    (item) => item.cate_name === formModel.value.cate_name
  )

  const res = await articleAddManageService({
    title: formModel.value.title.value,
    cate_id: cateId.id,
    content: formModel.value.content.value,
    cover_img: imgUrl.value,
    state: '已发布'
  })
  console.log(res)
}

const draftArticle = async () => {
  console.log('我是草稿按钮')
  await form.value.validate()
}

const onDelManage = (row, $index) => {
  console.log('我是删除按钮')
  console.log(row, $index)
  ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      loading.value = true
      const { data } = await articleDelManageService(row.id)
      loading.value = false
      console.log(data)
      getManage()
      ElMessage({
        type: 'success',
        message: data.message
      })
    })
    .catch(() => {})
}

const searchManage = async () => {
  console.log('我是搜索')
  console.log(manageList.value)
  loading.value = true
  const {
    data: { data }
  } = await articleGetManageService({ pagenum: 1, pagesize: '10' })
  loading.value = false
  manageList.value = data.filter((item) => {
    return (
      item.cate_name === channel.value && item.state === publishStatus.value
    )
  })
}
const resetManage = () => {
  console.log('我是重置')
  getManage()
}

const onUploadFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}

watch([channel, publishStatus], () => {
  if (channel.value !== '' && publishStatus.value !== '') {
    disabled.value = false
  }
})

watch(formModel.value.cate_name, () => {
  console.log(1111111)
  console.log(
    channelList.value.find(
      (item) => item.cate_name === formModel.value.cate_name
    )
  )
})
</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="addManage()">发布文章</el-button>
    </template>
    <el-form>
      <el-form-item label="文章分类：">
        <el-select
          placeholder="请选择"
          v-model="channel"
          style="width: 220px; margin-right: 30px"
        >
          <el-option
            v-for="item in channelList"
            :key="item.id"
            :value="item.cate_name"
          ></el-option>
        </el-select>
        <el-form-item label="发布状态：">
          <el-select
            v-model="publishStatus"
            placeholder="请选择"
            style="width: 220px"
          >
            <el-option value="已发布"></el-option>
            <el-option value="草稿"></el-option>
          </el-select>
        </el-form-item>
        <el-button
          @click="searchManage()"
          type="primary"
          style="margin-left: 30px"
          :disabled="disabled"
          >搜索</el-button
        >
        <el-button @click="resetManage()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="manageList" style="width: 100%">
      <el-table-column prop="title" label="文章标题"></el-table-column>
      <el-table-column prop="cate_name" label="分类"></el-table-column>
      <el-table-column prop="pub_date" label="发表时间"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row, $index }">
          <el-button
            @click="onEditManage(row, $index)"
            type="primary"
            plain
            circle
            :icon="Edit"
          ></el-button>
          <el-button
            @click="onDelManage(row, $index)"
            plain
            circle
            type="danger"
            :icon="Delete"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="description" />
      </template>
    </el-table>

    <el-pagination
      style="float: right"
      :hide-on-single-page="manageList"
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[2, 3, 5, 10]"
      :small="small"
      :background="background"
      layout="jumper,total, sizes, prev, pager, next "
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-drawer v-model="drawer" :title="drawerTitle" size="50%">
      <template #header></template>
      <template #default>
        <el-form
          style="margin-left: 22px"
          :rules="rules"
          ref="form"
          :model="formModel"
        >
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="formModel.title"></el-input>
          </el-form-item>
          <el-form-item label="文章分类" prop="cate_name">
            <el-select v-model="formModel.cate_name" placeholder="请选择">
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :value="item.cate_name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章封面" prop="cover_img">
            <el-upload
              v-model="formModel.cover_img"
              class="avatar-uploader"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="onUploadFile"
            >
              <img v-if="imgUrl" :src="imgUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="文章内容" prop="content">
            <div class="editor">
              <QuillEditor
                contentType="html"
                theme="snow"
                v-model="formModel.content"
              />
            </div>
          </el-form-item>
          <el-form-item style="margin-left: 70px">
            <el-button @click="publishArticle()" type="primary">发布</el-button>
            <el-button @click="draftArticle()" type="info">草稿</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-drawer>
  </page-container>
</template>

<style lang="scss" scoped>
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
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
