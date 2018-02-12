export default {
  editorOption: {
    placeholder: "请输入内容",
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }],
        [{ 'align': [] }],
        ['link', 'image']
      ]
    }
  },
  validateNumber (rule, value, callback) {
    if (value === 0) {
      let string = value.toString();
      if (string.length === 0) {
        return callback(new Error('不能为空'))
      } else {
        callback();
      }
    } else {
      if (!value) {
        return callback(new Error('不能为空'))
      } else {
        let number = parseInt(value)
        if (isNaN(number)) {
          callback(new Error('请输入数字类型'))
        } else {
          callback()
        }
      }
    }
  },
  validateDate(rule,val,callback){
    if(rule._this.formItem.BeginTime > rule._this.formItem.EndTime){
      return callback(new Error())
    }else{
      return callback();
    }
  },
  validateUrl(rule, value, callback) {
    if (value === '') {
      return callback();
    } else {
      let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
      if (!reg.test(value)) {
        callback(new Error('请输入一个以http://开头的网站'))
      } else {
        return callback();
      }
    }
  },
  getCookie(name) {
    var arr,reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
    if(arr = document.cookie.match(reg)) {
      return unescape(arr[2])
    } else {
      return null
    }
  },
  clearCookie(name) {
    var exp  = new Date()
    exp.setTime(exp.getTime() - 60 * 1000)
    document.cookie = name + "="+ escape ('') + ";path=/;expires=" + exp.toGMTString() + ";domain=.ourzhijiao.com"
  }
}
