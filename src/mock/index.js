const Mock = require('mockjs')
const appData = require('./json/data')
const seller = appData.seller
const goods = appData.goods
const ratings = appData.ratings
// Mock.mock('/api/seller', 'get', seller)
Mock.mock(/\/api\/seller/, 'get', () => {
	return {
		errno: 0,
		data: seller
	}
})
Mock.mock('/api/goods', 'get', () => {
	return {
		errno: 0,
		data: goods
	}
})
Mock.mock('/api/ratings', 'get', () => {
	return {
		errno: 0,
		data: ratings
	}
})
// 格式： Mock.mock( url, post/get , 返回的数据)
