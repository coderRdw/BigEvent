// 注意：每次调用ajax方法时，会先调用ajaxPrefilter()
$.ajaxPrefilter(function (options) {
  // 在发起真正的Ajax请求之前，同意拼接请求的根路径
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url
  console.log(options.url)
})
