$(function () {
  const form = layui.form
  const layer = layui.layer
  // 请求文章分类列表
  initCate()
  // 初始化富文本编辑器
  initEditor()
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)
  // 获取文章分类数据
  function initCate() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('请求列表失败')
        }
        let htmlStr = template('tpl-cate', res)
        $('#cate_id').html(htmlStr)
        // 通知layui重新刷新表单数据
        form.render()
      }
    })
  }

  $('#chooseCover').on('click', function () {
    $('#coverFile').click()
  })
  $('#coverFile').on('change', function (e) {
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

  // 定义文章的发布状态
  let pub_state = '已发布'
  // 监听存为草稿按钮，修改发布状态
  $('#saveDraft').on('click', function () {
    pub_state = '草稿'
  })
  $('#form-pub').on('submit', function (e) {
    e.preventDefault()
    // 基于表单填充formData数据
    let fd = new FormData($(this)[0])
    // 向fd添加属性state
    fd.append('state', pub_state)
    // fd.forEach((v, k) => {
    //   console.log(k, v)
    // })
    // 将裁剪后的图片输出为文件
    // console.log(fd)
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 将文件对象存储到fd中
        fd.append('cover_img', blob)
      })
    // console.log(fd)
    publishArticle(fd)
  })
  function publishArticle(fd) {
    // 发起ajax
    $.ajax({
      type: 'POST',
      url: '/my/article/add',
      data: fd,
      //?不修改?Content-Type?属性，使用?FormData?默认的?Content-Type?值
      contentType: false,
      //?不对?FormData?中的数据进行?url?编码，而是将?FormData?数据原样发送到服务器
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败')
        }
        layer.msg('发布文章成功')
        location.href = '/article/article_list.html'
      }
    })
  }
})
