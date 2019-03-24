// 日期格式化
export function formatDate(data, fmt) {
  var o = {
    'M+': data.getMonth() + 1,
    'D+': data.getDate(),
    'h+': data.getHours(),
    'm+': data.getMinutes(),
    's+': data.getSeconds()
  };
  if (/(Y+)/.test(fmt)) {
    var resYear = String(data.getFullYear()).substring(4 - RegExp.$1.length);
    fmt = fmt.replace(RegExp.$1, resYear);
  }
  for (var str in o) {
    var reg = new RegExp('(' + str + ')');
    if (reg.test(fmt)) {
      var resDate = RegExp.$1.length > 1 ? ('00' + o[str]).substring(String(o[str]).length) : o[str];
      fmt = fmt.replace(RegExp.$1, resDate);
    }
  }
  return fmt;
}
