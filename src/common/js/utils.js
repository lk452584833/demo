/**
* 解析url参数
* @example ?id=123&a=1
* @return Object {id:123,a:1}
*/
export function urlParam() {
	let url = window.location.search
	let obj = {}
	let reg = /[?&][^?&]+=[^?&]+/g
	let arr = url.match(reg)
	if (arr) {
		arr.forEach((item) => {
			let tempArr = item.substring(1).split('=')
			let key = decodeURIComponent(tempArr[0])
			let val = decodeURIComponent(tempArr[1])
			obj[key] = val
		})
	}
	return obj
}

/* 返回错误信息弹出，需配合reset.css */
function showBackMsg(data) {
	var $body = document.body
	var $div = document.createElement('div')
	$div.innerText = data
	$div.className = 'errorMsg'
	$body.appendChild($div)
	var $errorMsg = document.getElementsByClassName('errorMsg')
	if ($errorMsg) {
		setTimeout(function() {
			$errorMsg[0].parentNode.removeChild($errorMsg[0])
		}, 1500)
	}
}
export default{
	install(Vue, options) {
		Vue.prototype.$_showBackMsg = showBackMsg
	}
}
