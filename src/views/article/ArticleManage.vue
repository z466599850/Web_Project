<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format.js'
import ArticleEdit from './components/ArticleEdit.vue'
import { ElMessageBox } from 'element-plus'

const loading = ref(false)
const articleList = ref([]) // 文章列表
const total = ref(0) // 总条数
const params = ref({
  pagenum: 1, // 当前页
  pagesize: 5, // 当前生效的每条页数
  cate_id: '',
  state: ''
})

// 基于params参数，获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}

// 处理分页逻辑
const onSizeChange = (size) => {
  console.log('当前每页条数', size)
  params.value.pagenum = 1
  params.value.pagesize = size
  // 只要是每页条数变化了，那么原本正在访问的当前页意义不大了
  // 基于最新的当前页 和 每页条数，渲染数据
  getArticleList()
}

const onCurrentChange = (page) => {
  console.log('页码变化了', page)
  params.value.pagenum = page
  getArticleList()
}

getArticleList()

// 删除逻辑
const onDelArticle = async (row) => {
  console.log(row)
  console.log('我是删除按钮')
  ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // loading.value = true
      await artDelService(row.id)
      ElMessage.success('删除成功')
      getArticleList()
    })

    .catch(() => {})
}

// 搜索逻辑
const onSearch = () => {
  if (!params.value.cate_id) return
  params.value.pagenum = 1 // 重置页码
  getArticleList()
}

// 重置逻辑
const onReset = () => {
  params.value.pagenum = 1 // 重置页码
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

const articleEditRef = ref()
// 添加编辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}

// 编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 添加或者编辑 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}
</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">发布文章</el-button>
    </template>
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <!-- label 展示给用户看的，value 代表给后台看的 -->
        <!-- Vue2 => model :value 和 @input 的简写 -->
        <!-- Vue3 => model :modelValue 和 @update:modelValue 的简写 -->
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>

        <!-- Vue3 = > v-model:cid :cid和@update:id 的简写 -->
        <!-- <channel-select v-model:cide="params.cate_id"><> -->
      </el-form-item>
      <el-form-item style="width: 270px" label="发布状态:">
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布 / 草稿 -->
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table v-loading="loading" :data="articleList">
      <el-table-column prop="title" label="文章标题">
        <template #default="{ row }">
          <!-- type="primary" 字体颜色 underline="false" 去掉下划线 -->
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类"></el-table-column>
      <el-table-column prop="pub_date" label="发表时间">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <!-- 利用作用域插槽 row 可以获取当前行的数据 => v-for 遍历 item -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            @click="onEditArticle(row)"
            type="primary"
            circle
            plain
            :icon="Edit"
          ></el-button>
          <el-button
            @click="onDelArticle(row)"
            type="danger"
            circle
            plain
            :icon="Delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
  </page-container>
</template>

<style lang="scss" scoped></style>
