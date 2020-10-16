<template>
  <div>
    <app-header></app-header>
    <br /><br />
    <section class="layout">
      <h1 class="center">Registration</h1>
      <div class="form-field">
        <form>
          <br />
          <input
            type="text"
            placeholder="Enter username"
            class="form-control"
            name="username"
            v-model="username"
          />
          <br />
          <br />
          <input
            type="text"
            placeholder="Enter First Name"
            class="form-control"
            name="first_name"
            v-model="first_name"
          />
          <br />
          <br />
          <input
            type="text"
            placeholder="Enter Last Name"
            class="form-control"
            name="last_name"
            v-model="last_name"
          />
          <br />
          <br />
          <input
            type="email"
            placeholder="Enter Email"
            class="form-control"
            name="email"
            v-model="email"
          />
          <br />
          <br />
          <input
            type="password"
            placeholder="Enter Password"
            class="form-control"
            name="password"
            v-model="password"
          />
          <br /><br />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            class="form-control"
            v-model="confirm_password"
          />
          <br /><br />
        </form>
        <button class="buttons" v-on:click="validate">Submit</button
        ><br /><br />
        <div id="err" v-for="error in errors" v-bind:key="error">
          <p>{{ error }}</p>
        </div>
        <div id="succ" v-for="succ in success" v-bind:key="succ">
          <p>{{ succ }}</p>
        </div>
        <hr />
        <small
          >Register using
          <a href="http://localhost:5000/api/users/auth/google">google</a>
        </small>
        |
        <small
          >Already have an account?
          <router-link to="/login">Log in!</router-link>
        </small>
      </div>
    </section>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  secure_password,
  axios_post,
  validUsername,
  validName,
} from "../functions/functions";
import sweet from "sweetalert";

export default {
  components: {
    "app-footer": Footer,
    "app-header": Header,
  },
  data() {
    return {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      submit: true,
      errors: [],
      success: [],
    };
  },
  methods: {
    validate: function () {
      this.errors = [];
      var checkUsername = validUsername(this.username);
      var checkFirst = validName("First name", this.first_name);
      var checkLast = validName("Last name", this.last_name);
      if (checkUsername !== "good") {
        this.errors.push(checkUsername);
        return;
      } else if (checkFirst !== "good") {
        this.errors.push(checkFirst);
        return;
      } else if (checkLast !== "good") {
        this.errors.push(checkUsername);
        return;
      }

      let check = secure_password(this.password);
      if (check !== "good") {
        this.errors.push(check);
        return;
      }
      if (this.password != this.confirm_password) {
        this.errors.push("Passwords do not match");
        return;
      }
      if (this.errors.length == 0) {
        this.register();
      }
    },
    register: async function () {
      this.errors = [];
      const data = {
        first_name: escape(this.first_name),
        last_name: escape(this.last_name),
        username: escape(this.username),
        email: escape(this.email),
        password: this.password,
        password_repeat: this.password_repeat,
      };
      var results = await axios_post("/api/users/signup", data);
      if (results !== "Oops!") {
        if (results.data.error) {
          this.errors = results.data.error;
        } else if (results.data.success) {
          this.success.push("Registration successful! You can now log in");
          this.clean_input();
          sweet("", "registration successful", "success");
          this.$router.push("/login");
        }
      } else {
        this.errors.push("An unexpected error happened");
      }
    },
    clean_input() {
      this.first_name = "";
      this.last_name = "";
      this.username = "";
      this.email = "";
      this.password = "";
      this.confirm_password = "";
      this.errors = [];
    },
  },
};
</script>

<style scoped>
.form-field {
  margin: auto;
  width: 40%;
}
</style>