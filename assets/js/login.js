$(function () {
  // 点击去注册链接
  $('#link_reg').on('click', function () {
    // 隐藏登录区域，显示注册区域
    $('.login').hide()
    $('.reg').show()
  })
  // 点击去登录链接
  $('#link_login').on('click', function () {
    // 隐藏注册区域，显示登录区域
    $('.reg').hide()
    $('.login').show()
  })
  // 自定义表单预验证
  // 从Layui的JS文件中获取form对象
  let form = layui.form
  // 获取Layer
  let layer = layui.layer
  // 通过form.verify中校验规则
  form.verify({
    password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 校验两次密码是否输入一致
    repassword: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行等于的判断
      // 如果判断失败,return 一个提示信息
      // 使用后代元素选择器定位到密码输入框
      let password = $('.reg [name="password"]').val()
      if (password !== value) {
        return '两次密码输入不一致！'
      }
    }
  })
  // 监听表单的注册
  $('#form-reg').on('submit', function (e) {
    // 注册表单的默认提交行为
    e.preventDefault()
    // 这里不需要使用使用表单序列化函数serialize函数,该函数会获取表单中所有输入框的值，而我们发起Ajax请求时只需要username和password,不需要repassword
    let username = $('.reg [name=username]').val().trim()
    let password = $('.reg [name=password]').val().trim()
    // 发起Ajax请求
    $.ajax({
      type: 'POST',
      url: '/api/reguser',
      data: {
        username: username,
        password: password
      },
      success: function (res) {
        // 0:成功，1:失败
        if (res.status !== 0) {
          return layer.msg(res.message, { icon: 2 }, function () {
            $('#form-reg')[0].reset()
          })
        }
        //注册成功
        layer.msg(
          '注册成功，请登录!',
          {
            icon: 1,
            time: 2000 //2秒关闭（如果不配置，默认是3秒）
          },
          function () {
            $('#link_login').click()
          }
        )
      }
    })
  })
  // 监听表单登录
  $('#form-login').on('submit', function (e) {
    e.preventDefault()
    let data = $(this).serialize()
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message, { icon: 2 }, function () {
            $('#form-login')[0].reset()
          })
        }
        //登录成功
        layer.msg(
          '登录成功！',
          {
            icon: 1,
            time: 2000 //2秒关闭（如果不配置，默认是3秒）
          },
          function () {
            //将登录成功返回到的token存储到localStorage中
            localStorage.setItem('token', res.token)
            // 跳转首页
            location.href = '/index.html'
          }
        )
      }
    })
  })
})
