<template>
  <div>
    <app-header></app-header>
    <h1>{{ title }}</h1>
    <section>
      <div class="form-field">
        <div id="err" v-for="error in errors" v-bind:key="error">
          <small>{{ error }}</small>
        </div>
        <div id="succ" v-for="suc in succ" v-bind:key="suc">
          <small>{{ suc }}</small>
        </div>
        <form>
          <input
            type="password"
            v-model="new_pass"
            class="form-control"
            placeholder="Enter new password"
          />
          <br />
          <input
            type="password"
            v-model="confirm_pass"
            placeholder="Confirm new password"
          />
          <br />
        </form>
        <button @click="validate">Update Password</button>
      </div>
      <br />
    </section>
    <app-footer></app-footer>
  </div>
</template>

<script>
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { secure_password } from "../functions/functions";

export default {
  components: {
    "app-header": Header,
    "app-footer": Footer,
  },
  data() {
    return {
      title: "Reset Password",
      new_pass: "",
      confirm_pass: "",
      errors: [],
      succ: [],
      token: this.$route.params.id,
    };
  },
  methods: {
    validate: function () {
      this.errors = [];
      this.success = [];
      let check = secure_password(this.new_pass);
      if (check !== "good") {
        this.errors.push(check);
        return;
      } else if (this.new_pass != this.confirm_pass) {
        this.errors.push("Passwords do not match");
        return;
      }
      if (this.errors.length == 0) {
        this.reset();
      }
    },
    reset() {
      const path = "http://localhost:5000/api/forgotpassword/" + this.token;
      axios
        .post(path, {
          password: this.new_pass,
        })
        .then((result) => {
          // console.log(result)
          if (result.data.error) {
            this.errors.push("Invalid token");
          } else if (result.data.success) {
            this.succ.push(
              "Password changed successfully! You will be redirected to login"
            );
            setTimeout(() => {
              this.$router.push("/login");
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.form-field {
  /* border-style: double; */
  margin: auto;
  width: 50%;
}
h1 {
  text-align: center;
}
</style>