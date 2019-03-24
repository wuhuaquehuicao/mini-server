export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

// 格式化时间
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

// 清空对象
export function emptyObject(obj) {
  Object.keys(obj).forEach(function(key) {
    obj[key] = '';
  });
}
