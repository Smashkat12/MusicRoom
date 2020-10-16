<template>
    <div>
        <app-header></app-header>
        <br/><br/>
        <h1>{{ msg }}</h1>
        <div class="form-field">
            <form>
                <br>
                <label for="username">Username: </label>
                <input type="text" placeholder="Enter username" class="form-control" name="username"  v-model="username"> <br><br>
                <label for="password">Password: </label>
                <input type="password" placeholder="Enter Password" class="form-control" name="password" v-model="password"> <br><br>
            </form>
            <button class="buttons" @click="validate">Log in</button><br><br>
            <div id="err" v-for="error in err" v-bind:key="error">
                    <small>{{ error }}</small>
            </div>
            <hr>
            <small>login using <a href='http://localhost:5000/api/users/auth/google'>google</a> </small> | 
            <small>Don't have an account? <router-link to="/register">Register Here!</router-link> </small> |
            <small><router-link to="/forgot-password">Forgot password?</router-link></small>
        </div>
        <app-footer></app-footer>
    </div>
</template>

<script>
import { secure_password, validUsername } from "../functions/functions";
import axios from 'axios'
import Header from "../components/Header";
import Footer from "../components/Footer";
import swal from 'sweetalert'

export default {
    components: {
        'app-header': Header,
        'app-footer': Footer
    },
    data() {
        return {
            msg: 'Music Room Log in',
            username: '',
            password: '',
            err: [],
            uid: ''
        }
    },
    methods: {
        validate() {
            this.err = []
            var checkUsername = validUsername(this.username)
            let check = secure_password(this.password)
            if (check !== 'good') {
                this.err.push(check)
                return
            } else if (checkUsername !== 'good') {
                this.err.push(checkUsername)
                return
            }else {
                this.login()
            }
        },
        async login() {
            let path = 'http://localhost:5000/api/users/signin/'
            let res = await axios.post(path, {
                'username': escape(this.username),
                'password': this.password
            }).catch(e => {e})
            if (res.data.error) {
                this.err.push(res.data.error)
            } else if (res.data.success) {
                localStorage.setItem("jwt", res.data.success.token)
                localStorage.setItem('user', this.username)
                swal("", "Welcome to Music Room "+this.username, "success")
                this.$router.push(`/landing`)
            } else {
                this.err.push('an unexpected error occured')
            }
        },
        auth() {
        }
    }
    
}
</script>

<style scoped>
.form-field {
    margin: auto;
    width: 40%;
}
h1{
    text-align: center;
}
</style>