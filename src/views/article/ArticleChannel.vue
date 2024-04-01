<script setup>
import {
  articleGetChannelListService,
  articleRemoveChannelListService,
  articleAddChannelListService,
  articleUpdataChannelListService
} from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'

const channelList = ref([])
const loading = ref(false)
const dialogFormVisible = ref(false)
const channelTitle = ref('测试')
const channelFormModel = ref({
  cate_name: '',
  cate_alias: ''
})
const cateId = ref()
const form = ref()

const rules = {
  cate_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^\w{1,15}$/,
      message: '分类名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}

const getChannelList = async () => {
  loading.value = true
  const {
    data: { data }
  } = await articleGetChannelListService()
  console.log(data)
  channelList.value = data
  loading.value = false
}
getChannelList()

const addChannel = async () => {
  dialogFormVisible.value = true
  channelTitle.value = '添加分类'
  channelFormModel.value.cate_name = ''
  channelFormModel.value.cate_alias = ''
}

const onEditChannel = (index, row) => {
  console.log(index, row)
  dialogFormVisible.value = true
  channelTitle.value = '编辑分类'
  cateId.value = row.id
  channelFormModel.value.cate_name = row.cate_name
  channelFormModel.value.cate_alias = row.cate_alias
}

const onDelChannel = (index, row) => {
  console.log(index, row)
  ElMessageBox.confirm('你确认删除该分类信息吗?', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      loading.value = true
      const { data } = await articleRemoveChannelListService(row.id)
      getChannelList()
      loading.value = false
      ElMessage({
        type: 'success',
        message: data.message
      })
    })
    .catch(() => {})
}

const dialogButtonCancel = () => {
  dialogFormVisible.value = false
}

const dialogButtonNotarize = async () => {
  dialogFormVisible.value = false
  if (channelTitle.value === '添加分类') {
    const { data } = await articleAddChannelListService({
      cate_name: channelFormModel.value.cate_name,
      cate_alias: channelFormModel.value.cate_alias
    })
    console.log(data)
    ElMessage({
      type: 'success',
      message: data.message
    })
  }
  if (channelTitle.value === '编辑分类') {
    console.log(cateId.value)
    const { data } = await articleUpdataChannelListService({
      id: cateId.value,
      cate_name: channelFormModel.value.cate_name,
      cate_alias: channelFormModel.value.cate_alias
    })
    console.log(data)
    ElMessage({
      type: 'success',
      message: '编辑分类别名成功'
    })
  }

  getChannelList()
}
</script>
<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button
        v-model="dialogFormVisible"
        @click="addChannel()"
        type="primary"
        >添加分类</el-button
      >
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ $index, row }">
          <el-button
            type="primary"
            :icon="Edit"
            plain
            circle
            @click="onEditChannel($index, row)"
          ></el-button>
          <el-button
            type="danger"
            :icon="Delete"
            plain
            circle
            @click="onDelChannel($index, row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <el-dialog v-model="dialogFormVisible" :title="channelTitle" width="460">
      <el-form
        ref="form"
        :model="channelFormModel"
        :rules="rules"
        style="max-width: 370px; padding: 0 20px"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input
            maxlength="10"
            v-model="channelFormModel.cate_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input
            maxlength="15"
            v-model="channelFormModel.cate_alias"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogButtonCancel()">取消</el-button>
          <el-button type="primary" @click="dialogButtonNotarize()"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
  </page-container>
</template>

<style lang="scss" scoped></style>
