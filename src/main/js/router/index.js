import Vue from 'vue'
import Router from 'vue-router'

// Componenets
import Welcome from '../components/welcome.vue'
import Forgot from '../components/forgot.vue'
import Account from '../components/account.vue'
import Profile from '../components/profile.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Welcome',
            component: Welcome
        },
        {
            path: '/forgot',
            name: 'forgot',
            component: Forgot
        },
        {
            path: '/account',
            name: 'Account',
            component: Account
        }
        ,
        {
            path: '/profile',
            name: 'Profile',
            component: Profile
        }
    ]
})