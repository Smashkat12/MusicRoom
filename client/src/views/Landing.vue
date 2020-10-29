<template>
  <div>
    <app-header></app-header>
    <h6>Landing Page</h6>

    <div>
      <b-modal ref="my-modal" hide-footer title="Account Linking">
        <div class="d-block text-center">
          <h3>Link your account</h3>
        </div>
        <b-button
          class="mt-3"
          href="http://localhost:5000/api/auth/link/google"
          variant="outline-success"
          block
          @click="hideModal"
          >Link Google</b-button
        >
        <b-button
          class="mt-3"
          href="http://localhost:5000/api/auth/link/facebook"
          variant="outline-success"
          block
          @click="hideModal"
          >Link Facebook</b-button
        >
        <b-button
          class="mt-3"
          href="http://localhost:5000/api/auth/link/deezer"
          variant="outline-success"
          block
          @click="hideModal"
          >Link Deezer</b-button
        >
        <b-button
          class="mt-3"
          href="http://localhost:8080/login"
          variant="outline-success"
          block
          @click="hideModal"
          >Link Local</b-button
        >
        <!-- <b-button class="mt-3" variant="outline-danger" block @click="hideModal"
          >Close Me</b-button
        > -->
        <!-- <b-button
          class="mt-2"
          variant="outline-warning"
          block
          @click="toggleModal"
          >Toggle Me</b-button
        > -->
      </b-modal>
    </div>
    <!-- <a href="http://localhost:5000/api/auth/link/google" class="btn btn-danger">
      Link Google
    </a> -->
    <!-- <a
      href="http://localhost:5000/api/auth/link/facebook"
      class="btn btn-primary"
    >
      Link Facebook</a
    > -->
    <a href="http://localhost:5000/api/auth/link/deezer" class="btn btn-info">
      Link Deezer
    </a>
    <a href="/link/local" class="btn btn-danger"> Link Local </a>
    <app-footer></app-footer>
  </div>
</template>
<script>
import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default {
  name: "Landing",
  components: {
    "app-header": Header,
    "app-footer": Footer,
  },
  methods: {
    showModal() {
      this.$refs["my-modal"].show();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    async getUserData() {
      let token = localStorage.getItem("jwt");
      let options = {
        method: "get",
        headers: { Authorization: token },
        url: "http://localhost:5000/api/auth",
      };
      let user = await axios(options).catch(() => {
        console.log("Unable to process request");
      });
      if (user.googleToken) {
        this.id = user.data.user._googleId;
        this.username = user.data.user.username;
        <a
          href="http://localhost:5000/api/auth/link/google"
          class="btn btn-danger"
        >
          link Google
        </a>;
      }
      if (user.facebookToken) {
        this.id = user.data.user._facebookId;
        this.username = user.data.user.username;
        <a
          href="http://localhost:5000/api/auth/link/facebook"
          class="btn btn-primary"
        >
          link Facebook
        </a>;
      }
      if (user.deezerToken) {
        this.id = user.data.user.deezerId;
        this.username = user.data.user.username;
        <a
          href="http://localhost:5000/api/auth/link/deezer"
          class="btn btn-info"
        >
          Link Deezer
        </a>;
      }

      if (user.email) {
        this.id = user.data.user._id;
        this.username = user.data.user.username;
        <a href="/link/local" class="btn btn-danger">
          Link Local
        </a>;
      } else {
        console.log("Not Authorised");
      }
    },
  },
  mounted() {
    this.showModal();
  },
};
</script>
<style scoped>
</style>