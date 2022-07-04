hexo.extend.helper.register('injectHtml', function (data) {
  let result = ''
  if (!data) return ''
  for (let i = 0; i < data.length; i++) {
    result += data[i]
  }
  return result
})