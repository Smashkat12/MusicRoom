<template>
  <div>
    <app-header></app-header>
    <router-link to="/profile">Back to profile</router-link>
    <section class="layout">
      <div id="err" v-for="error in err" v-bind:key="error">
        <small>{{ error }}</small>
      </div>
      <form>
        <input
          type="password"
          v-model="current_pass"
          placeholder="Enter current password"
        />
        <br />
        <input
          type="password"
          v-model="new_pass"
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
      <button class="buttons" @click="validate_pass">Update Password</button>
    </section>
    <br />
    <app-footer></app-footer>
  </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
export default {
  components: {
    "app-header": Header,
    "app-footer": Footer,
  },
  data() {
    return {
      current_pass: "",
      new_pass: "",
      confirm_pass: "",
      err: [],
    };
  },
  methods: {
    update_password() {
      alert("Password changed to: " + this.new_pass);
    },
    validate_pass() {
      this.err = [];
      if (this.current_pass.length > 8) {
        if (this.new_pass.length < 8) {
          this.err.push("New password short");
        } else if (this.new_pass !== this.confirm_pass) {
          this.err.push("Passwords do not match");
        } else {
          this.update_password();
        }
      } else {
        this.err.push("Current password is short");
      }
    },
  },
};
</script>