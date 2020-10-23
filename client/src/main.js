import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './router/index'
import jwt from 'njwt'
/* import axios from 'axios' */

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes
})

//set axios as default http client for Vue 
/* Vue.prototype.$http = axios; */

router.beforeEach(async (to, from, next) => {
    let token = localStorage.getItem("jwt")
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            next({ path: '/' })
        } else {
			//if there is a token, append default axios authorization header
			/* Vue.prototype.$http.defaults.headers.common['Authorization'] = token; */
            jwt.verify(token, 'secret', (err) => {
                if (err) {
                    next({ path: '/' })
                    localStorage.removeItem('jwt')
                    localStorage.removeItem('user')
                }
                next()
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