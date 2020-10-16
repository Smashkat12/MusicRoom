// import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import UpdatePassword from '../views/UpdatePassword.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import ResetPassword from '../views/ResetPassword.vue'
import SearchMusic from '../views/SearchMusic.vue'
import Landing from '../views/Landing.vue'

export default [
    {   
        path: '/', 
        component: Home 
    },
    { 
        path: '/register', 
        component: Register
    },
    {
        path: '/reset/:id',
        name: 'ResetPassword',
        component: ResetPassword
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword
    },
    {
        path: '/profile/',
        name: 'Profile',
        component: Profile,
        meta: {requiresAuth: true}
    },
    {
        path: '/update_password',
        name: 'UpdatePassword',
        component: UpdatePassword
    },
    {
        path: '/landing',
        name: 'Landing',
        component: Landing,
        meta: {requiresAuth: true}
    },
    {
        path: '/search',
        name: 'SearchMusic',
        component: SearchMusic,
        meta: {requiresAuth: true}
    },
]

