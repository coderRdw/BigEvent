$(function () {
  const layer = layui.layer
  const form = layui.form
  // 定义查询参数对象，将来请求时使用
  let q = {
    // 页码值
    pagenum: 1,
    // 每页显示多少条数据
    pagesize: 2,
    // 文章分类的 Id
    cate_id: '',
    // 文章的状态，可选值有：已发布、草稿
    state: ''
  }
  initTable()
  initCate()
  // 为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    let id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()
    // 为查询对象q重新赋值
    q.cate_id = id
    q.state = state
    // 重新刷新表格
    initTable()
  })
  // 获取文章列表数据
  function initTable() {
    $.ajax({
      type: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败')
        }
        // // 使用模板引擎渲染数据
        let htmlStr = template('tpl-table', res)
        $('#table-body').html(htmlStr)
      }
    })
  }
  // 获取文章分类数据
  function initCate() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        let htmlStr = template('tpl-cate', res)
        // console.log(htmlStr)
        $('#cate_id').html(htmlStr)
        // 通知layui重新刷新表单数据
        form.render()
      }
    })
  }
  // 定义时间过滤器
  template.defaults.imports.dateFormat = function (time) {
    const date = new Date(time)
    let year = date.getFullYear()
    let month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    let day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    let hh = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
    let mm = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
    let ss = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
    return year + '-' + month + '-' + day + ' ' + hh + ':' + mm + ':' + ss
  }
})
