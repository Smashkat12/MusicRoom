<template>
  <div>
    <app-header></app-header>
    <br /><br />
    <h1>{{ msg }}</h1>
    <div class="form-field">
      <form>
        <br />
        <label for="username">Username: </label>
        <input
          type="text"
          placeholder="Enter username"
          class="form-control"
          name="username"
          v-model="username"
        />
        <br /><br />
        <label for="password">Password: </label>
        <input
          type="password"
          placeholder="Enter Password"
          class="form-control"
          name="password"
          v-model="password"
        />
        <br /><br />
      </form>
      <button class="buttons" @click="validate">Log in</button><br /><br />
      <div id="err" v-for="error in err" v-bind:key="error">
        <small>{{ error }}</small>
      </div>
      <hr />
      <small
        >login using
        <a href="http://localhost:5000/api/auth/login/google">Google+</a> |
        <a href="http://localhost:5000/api/auth/login/facebook">Facebook</a> |
        <a href="http://localhost:5000/api/auth/login/deezer">Deezer</a>
      </small>
      |
      <small
        >Don't have an account?
        <router-link to="/register">Register Here!</router-link>
      </small>
      |
      <small
        ><router-link to="/forgot-password"
          >Forgot password?</router-link
        ></small
      >
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import {
  secure_password,
  validUsername,
  axios_post,
} from "../functions/functions";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
/* import swal from 'sweetalert'; */
/* import jwt_decode from "jwt-decode"; */

export default {
  components: {
    "app-header": Header,
    "app-footer": Footer,
  },
  data() {
    return {
      msg: "Music Room Log in",
      username: "",
      password: "",
      err: [],
      uid: "",
      token: this.$route.params.token ? this.$route.params.token : "",
    };
  },
  methods: {
    validate() {
      this.err = [];
      var checkUsername = validUsername(this.username);
      let check = secure_password(this.password);
      if (check !== "good") {
        this.err.push(check);
        return;
      } else if (checkUsername !== "good") {
        this.err.push(checkUsername);
        return;
      } else {
        this.login();
      }
    },
    checkToken() {
      console.log("Inside check token");
      if (window.location.search) {
        const qString = window.location.search;
        const token = qString.split("=");
        const decodedToken = decodeURIComponent(token[1]);
        localStorage.setItem("jwt", decodedToken);
        console.log("we got the token buddy");
        this.$router.push({ name: "Landing" });
      }
    },
    async login() {
      const data = {
        username: escape(this.username),
        password: this.password,
      };
      let res = await axios_post("/api/auth/login", data);
      console.log(res.data);
      if (res.data.success === false) {
        console.log("we got an error bafana");
        this.err.push(res.data);
      } else if (res.data.success && res.data.token) {
        console.log("We have a tokken, just about to save it");
        localStorage.setItem("jwt", res.data.token);
        this.$router.push({ name: "Landing" });
      } else {
        this.err.push("an unexpected error occured");
      }
    },
    async authLogin() {
      let res = await axios.get("api/auth/login/google");
      localStorage.setItem("jwt", res.data.token);
    },
  },
  created() {
    this.checkToken();
  },
};
</script>

<style scoped>
.form-field {
  margin: auto;
  width: 40%;
}
h1 {
  text-align: center;
}
</style>
