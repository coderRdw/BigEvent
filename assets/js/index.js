$(function () {
  // 获取Layer
  let layer = layui.layer
  // 1.获取用户基本信息
  getUserInfo()
  // 2.点击退出按钮
  $('#btnLogout').on('click', function () {
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      // 清空localStorage的token
      localStorage.removeItem('token')
      // 跳转到登录页
      location.href = '/login.html'
      // 关闭弹出层
      layer.close(index)
    })
  })
})

// 定义用户信息请求函数
function getUserInfo() {
  $.ajax({
    type: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message, { icon: 2 })
      }
      // 用户认证成功,渲染用户头像
      renderAvatar(res.data)
    }
  })
}
function renderAvatar(user) {
  // 1.获取用户名称
  // 优先级：nickname>username;
  // 如果有nickname，则使用nickname
  // 没有，使用username
  let name = user.nickname || user.username
  // 2.修改欢迎的文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 3.按需渲染用户头像
  if (!user.user_pic) {
    // 没有用户上传头像，使用文本头像
    $('.layui-nav-img').hide()
    // 如果是英文,则获取首字母大写
    let first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  } else {
    // 使用用户头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  }
}
