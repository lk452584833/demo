var state = {
	name: 'Tom',
	starLen: 5, // 控制多少颗星星数
	star: 3.6
}
var getters = {
	getSellerStarLen() {
		return state.starLen
	},
	getSellerName(state) {
		return state.name
	},
	getSellerStar(state) {
		return state.star
	}
}
var mutations = {
	updateStar(state, star) {
		state.star = star
	}
}
var actions = {
	setStar(context, star) {
		context.commit('updateStar', star)
	}
}
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}