$(function () {
  let layer = layui.layer
  // 1.1 获取裁剪区域的 DOM 元素
  let $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    // 指定裁剪形状为正方形
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)
  $('#file').on('change', function (e) {
    console.log(e)
    // 获取用户选择的文件
    let fileList = e.target.files
    if (fileList.length === 0) {
      return layer.msg('请选择图片')
    }
    // 拿到用户选择的文件
    let file = fileList[0]
    // 根据选择的文件，创建一个对应的 URL 地址：
    let newImgURL = URL.createObjectURL(file)
    // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options)
  })
  $('#btnImageChoose').on('click', function () {
    $('#file').click()
  })
  // 为确定按钮绑定事件
  $('#btnUpload').on('click', function () {
    // 1.将图片转换成字符串
    const dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')
    // // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 2.调用接口，将文件上传到服务器
    $.ajax({
      type: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新图片失败！')
        }
        layer.msg('更新图片成功！', function () {
          window.parent.getUserInfo()
        })
      }
    })
  })
})
