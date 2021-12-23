$(function () {
  // 自定义表单验证
  // 从Layui的JS文件中获取form对象
  let form = layui.form
  // 获取Layer
  let layer = layui.layer
  form.verify({
    password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    newpassword: function (value) {
      // 获取原密码
      let old_password = $('[name=oldPwd]').val()
      if (old_password === value) {
        return '新密码与原密码一致！'
      }
    },
    repassword: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行等于的判断
      // 如果判断失败,return 一个提示信息
      // 使用后代元素选择器定位到密码输入框
      let password = $('[name=newPwd]').val()
      if (password !== value) {
        return '两次密码输入不一致！'
      }
    }
  })
  // 监听表单提交
  $('#form-password').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    $.ajax({
      type: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(
            res.message,
            {
              icon: 2
            },
            function () {
              $('#form-password')[0].reset()
            }
          )
        }
        layer.msg(
          '用户密码修改成功',
          {
            icon: 1,
            time: 1000 //1秒关闭（如果不配置，默认是3秒）
          },
          function () {
            // 调用父页面的方法，重新更新用户的信息
            // 当前页面是frame,调用父页面的方法，重新更新用户的信息
            $('#form-password')[0].reset()
          }
        )
      }
    })
  })
})
