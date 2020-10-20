<template>
  <div>
    <app-header></app-header>
    <section class="center">
      <br />
      <h1 class="center">{{ title }}</h1>
      <p>{{ text }}</p>
      <form>
        <div id="err" v-for="error in errors" v-bind:key="error">
          <p>{{ error }}</p>
        </div>
        <div v-if="succ">
          <p>{{ succ }}</p>
        </div>
        <input
          type="text"
          placeholder="Enter your email"
          class="form-control"
          v-model="email"
        />
      </form>
      <button class="buttons" @click="validate">Submit Email</button>
      <br />
      <router-link to="/login">Back to login</router-link>
    </section>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";

import { axios_post, validEmail } from "../functions/functions";
import sweet from "sweetalert";

export default {
  components: {
    "app-header": Header,
    "app-footer": Footer,
  },
  data() {
    return {
      title: "Forgot Password",
      text:
        "Enter your email and you will recieve an email with instructions to reset your password",
      email: "",
      errors: [],
      succ: null,
    };
  },
  methods: {
    validate() {
      this.err = [];
      this.succ = null;
      var checkEmail = validEmail(this.email);
      if (!checkEmail) {
        sweet("", "Invalid email address", "error");
        return;
      } else {
        this.forgot_pass();
      }
    },
    async forgot_pass() {
      const data = { email: escape(this.email) };
      var results = await axios_post("/api/auth/forgot", data);
      if (results !== "Oops!") {
        if (results.data.success == false) {
           sweet("", results.data.status, "error");
           this.email = "";
          this.errors.push(results.data.error);
        } else if (results.data.success == true) {
          sweet("", "An email was sent to you!", "success");
          this.email = "";
        }
      } else {
          sweet("", "Server error: Could not process your information", "error");
          this.email = "";
      }
    },
  },
};
</script>