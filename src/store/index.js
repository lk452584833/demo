import Vue from 'vue'
import Vuex from 'vuex'
import sellerInfo from './sellerInfo'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		sellerInfo
	}
})
