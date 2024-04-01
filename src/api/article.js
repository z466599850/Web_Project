import request from '@/utils/request'

// 增加 文章分类
export const articleAddChannelListService = ({ cate_name, cate_alias }) => {
  return request.post('/my/cate/add', {
    cate_name, // 文章分类名字
    cate_alias // 文章分类别名
  })
}

// 删除 文章分类
export const articleRemoveChannelListService = (id) => {
  return request.delete('/my/cate/del', {
    params: {
      id
    }
  })
}

// 更新 文章分类
export const articleUpdataChannelListService = ({
  id,
  cate_name,
  cate_alias
}) => {
  return request.put('/my/cate/info', {
    id,
    cate_name,
    cate_alias
  })
}

// 获取 文章分类
export const articleGetChannelListService = () => request.get('/my/cate/list')

// 获取文章分类详情
export const articleGetChannelListInfoService = () =>
  request.get('/my/cate/info')

// 文章管理接口
// 获取-文章列表
export const articleGetManageService = ({
  pagenum,
  pagesize,
  cate_id,
  state
}) => {
  return request.get('/my/article/list', {
    params: {
      pagenum, // 当前页码数
      pagesize, // 当前页需要的数据条数
      cate_id, // 文章分类id
      state // 文章状态（可选值或草稿）
    }
  })
}

// 获取-文章详情
export const articleGetManageInfoService = (id) => {
  return request.get('/my/article/info', {
    params: {
      id
    }
  })
}

// 发布-文章
export const articleAddManageService = ({
  title,
  cate_id,
  content,
  cover_img,
  state
}) => {
  return request.post('/my/article/add', {
    title,
    cate_id,
    content,
    cover_img,
    state
  })
}

// 删除-文章
export const articleDelManageService = (id) => {
  return request.delete('/my/article/info', {
    params: {
      id
    }
  })
}

// 更新-文章详情
export const articleUpdateManageService = ({
  id,
  title,
  cate_id,
  content,
  cover_img,
  state
}) => {
  return request.put('/my/article/info', {
    id,
    title,
    cate_id,
    content,
    cover_img,
    state
  })
}

// 黑马写的
export const artGetListService = (params) =>
  request.get('/my/article/list', {
    params
  })

// 添加文章
// 注意：data需要是一个formData格式的对象
export const artPublishService = (data) => request.post('/my/article/add', data)

// 获取文章详情
export const artGetDetailService = (id) =>
  request.get('/my/article/info', {
    params: {
      id
    }
  })

// 更新文章详情
export const artUpdateInfoService = (data) =>
  request.put('/my/article/info', data)

// 删除文章
export const artDelService = (id) =>
  request.delete('/my/article/info', {
    params: {
      id
    }
  })
