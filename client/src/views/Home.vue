<template>
  <div>
    <app-header></app-header>
    <img src="../assets/wall.jpg" alt="" srcset="" class="test">
    <app-footer></app-footer>
  </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from 'axios'
import sweet from 'sweetalert'

export default {
  name: 'home',
  components: {
    'app-header': Header,
    'app-footer': Footer
  },
  data() {
    return {
      msg: 'Welcome to Music Room!!',
      token: ''
    }
  },
  methods: {
      async sendUrl() {
          let data = {'url':document.URL}
          let path = 'http://localhost:5000/api/users/url'
          await axios.post(path, data)
            .catch(e => {console.log(e)})
      },
      async oauthRedirect() {
          let options = {
              method: 'get',
              url: 'http://localhost:5000/api/users/redirect/'+this.$route.query.t
          }
          let res = await axios(options).catch(e => {console.log(e)})
          console.log(res.data)
          if (res.data.success) {
              localStorage.setItem("jwt", res.data.success.token)
              sweet(res.data.success.username, "Welcome to Music Room", "success")
              this.$router.push(`/landing`)
          } else if (res.data.error == 'username unavailable') {
              sweet("", `${res.data.error}`, "error")
              this.$router.push('/register')
          }
      }
  },
  created() {
      this.sendUrl()
      this.oauthRedirect()
  }
}
</script>

<style scoped>
.test {
  width: 100%;
  height: auto;
}
</style>