import Vue from 'vue'
import Router from 'vue-router'

// Componenets
import Welcome from '../components/welcome.vue'
import Account from '../components/account.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Welcome',
            component: Welcome
        },
        {
            path: '/account',
            name: 'Account',
            component: Account
        }
    ]
})