<template>
  <div>
    <app-header></app-header>
    <br/>
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
            class="form-control"
            placeholder="Confirm new password"
          />
          <br />
        </form>
        <button class="buttons" @click="validate">Update Password</button>
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
import sweet from "sweetalert";

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
      key: this.$route.params.key,
    };
  },
  methods: {
    validate: function () {
      this.errors = [];
      this.success = [];
      let check = secure_password(this.new_pass);
      if (check !== "good") {
        sweet("", check, "error");
        return;
      } else if (this.new_pass != this.confirm_pass) {
        sweet("", "Passwords do not match", "error");
        return;
      }
      if (this.errors.length == 0) {
        this.reset();
      }
    },
    reset() {
      const path = "http://localhost:5000/api/auth/forgot/" + this.key;
      axios
        .post(path, {
          password: this.new_pass,
        })
        .then((result) => {
          if (result.data.success == false) {
            sweet("", result.data.error, "error");
          } else if (result.data.success == true) {
              sweet("", "Password changed successfully!", "success");
            setTimeout(() => {
              this.$router.push("/login");
            }, 3000);
          }
          else {
             sweet("", "Server error", "error");
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