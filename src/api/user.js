import request from '@/utils/request.js'

// 注册接口
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

// 登录接口
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

// 获取用户信息接口
export const userGetInfoService = () => request.get('/my/userinfo')

// 更新 用户基本资料
export const userPutUserInfoService = (data) =>
  request.put('/my/userinfo', data)

// 更新用户密码
export const UserUpdatePwdService = (data) =>
  request.patch('/my/updatepwd', data)
export const userUploadAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })
