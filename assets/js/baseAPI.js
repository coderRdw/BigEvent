// 注意：每次调用ajax方法时，会先调用ajaxPrefilter()
$.ajaxPrefilter(function (options) {
  // 在发起真正的Ajax请求之前，同意拼接请求的根路径
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url
  // 统一为有权限的用户设置请求头
  if (options.url.indexOf('/my/') !== -1) {
    // 只为请求url有/my/添加请求头
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  // 全局统一挂载complete回调函数
  options.complete = function (res) {
    if (res.responseJSON.message === '身份认证失败！' && res.responseJSON.status === 1) {
      localStorage.removeItem('token')
      location.href = '/login.html'
    }
  }
})
