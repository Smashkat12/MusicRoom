import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './router/index'
import axios from 'axios'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes
})

//set axios as default http client for Vue 
Vue.prototype.$http = axios;

router.beforeEach(async (to, from, next) => {
	let token = null
    token = localStorage.getItem("jwt")
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            next({ path: '/' })
        } else {
			//if there is a token, append default axios authorization header
			Vue.prototype.$http.defaults.headers.common['Authorization'] = token;

			//we need to call isAuthenticated route in server
			axios.get("http://localhost:5000/api/auth").then((res) => {
				if (res.data.auth) {
					next();
				} else {
					next({ path: "/" });
				}
			})		
        }
    } else {
        next()
    }
})

Vue.config.productionTip = false

new Vue({
    Vue,
    router: router,
    render: h => h(App),
}).$mount('#app')