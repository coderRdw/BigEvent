$(function () {
  // 自定义表单验证
  // 从Layui的JS文件中获取form对象
  let form = layui.form
  // 获取Layer
  let layer = layui.layer
  // 通过form.verify中校验规则
  form.verify({
    // password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格']
    nickname: function (value) {
      if (value > 6) {
        return '昵称长度必须在1到6个字符'
      }
    }
  })
  initUserInfo()
  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      type: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message, { icon: 2 })
        }

        // 为表单赋值
        form.val(
          //userInfo 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
          'userInfo',
          res.data
        )
      }
    })
  }
  // 重置表单的数据
  $('#resetBtn').on('click', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 点击重置，只需要重新请求数据
    initUserInfo()
  })
  // 监听表单的提交
  $('#form-user').on('submit', function (e) {
    // 注册表单的默认提交行为
    e.preventDefault()
   

    // 发起Ajax请求
    $.ajax({
      type: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        // 0:成功，1:失败
        if (res.status !== 0) {
          return layer.msg(res.message, { icon: 2 }, function () {
            $('#form-user')[0].reset()
          })
        }
        //注册成功
        layer.msg(
          '用户信息修改成功',
          {
            icon: 1,
            time: 2000 //2秒关闭（如果不配置，默认是3秒）
          },
          function () {
            // 调用父页面的方法，重新更新用户的信息
            // 当前页面是frame,调用父页面的方法，重新更新用户的信息
            window.parent.getUserInfo()
          }
        )
      }
    })
  })
})
