$(function () {
  // 获取文章分类列表
  initArticleList()
  // 添加分类绑定点击事件
  const layer = layui.layer
  const form = layui.form
  // 根据索引关闭对应的弹出层
  // 添加分类弹出层
  let layerAddIndex = null
  // 编辑分类弹出层
  let layerEditIndex = null
  // 删除分类弹出层
  let layerDeleteIndex = null
  $('#btnAdd').on('click', function () {
    layerAddIndex = layer.open({
      title: '添加文章分类',
      type: 1,
      area: ['500px', '250px'],
      // content指定弹出层的内容
      content: $('#dialog-add').html()
    })
  })
  // form表单是动态添加的，不能直接给form添加事件
  // 可以通过代理的方式为form绑定提交事件
  // 添加分类数据
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'POST',
      url: '/my/article/addcates',
      data: $('#form-add').serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }

        layer.msg('新增分类成功！', {
          icon: 1,
          time: 2000
        })
        initArticleList()
        // 添加成功之后关闭弹出层
        layer.close(layerAddIndex)
      }
    })
  })
  // 更新分类数据
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'POST',
      url: '/my/article/updatecate',
      data: $('#form-edit').serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类失败！')
        }

        layer.msg('更新分类成功！', {
          icon: 1,
          time: 2000
        })
        initArticleList()
        // 添加成功之后关闭弹出层
        layer.close(layerEditIndex)
      }
    })
  })
  // 通过代理的形式为编辑按钮绑定事件
  $('tbody').on('click', '#btn-edit', function (e) {
    layerEditIndex = layer.open({
      title: '编辑文章分类',
      type: 1,
      area: ['500px', '250px'],
      // content指定弹出层的内容
      content: $('#dialog-edit').html()
    })
    let id = $(this).attr('data-id')
    $.ajax({
      type: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        console.log(res.data)
        form.val('form-edit', res.data)
      }
    })
  })
  // 通过代理的形式为删除按钮绑定事件
  $('tbody').on('click', '#btn-delete', function (e) {
    let id = $(this).attr('data-id')
    layer.confirm('确定删除该条数据?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        type: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功')
          layer.close(index)
          initArticleList()
        }
      })
    })
  })
})
// 获取文章分类数据
function initArticleList() {
  $.ajax({
    type: 'GET',
    url: '/my/article/cates',
    success: function (res) {
      let htmlStr = template('tpl-table', res)
      $('#table-body').html(htmlStr)
    }
  })
}
