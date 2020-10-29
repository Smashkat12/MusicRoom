<!-- views/profile.ejs -->
<template>
  <div>
    <app-header></app-header>
    <h2>HI</h2>
    <app-footer></app-footer>
  </div>
</template>

<script>
import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default {
  name: "LinksProfile",
  components: {
    "app-header": Header,
    "app-footer": Footer,
  },
  methods: {
    async getUserData() {
      let token = localStorage.getItem("jwt");
      let options = {
        method: "get",
        headers: { Authorization: token },
        // url: "http://localhost:5000/api/auth",
      };
      let user = await axios(options).catch(() => {
        console.log("Unable to process request");
      });
      if (user.googleToken) {
        this.id = user.data.user._id;
        this.username = user.data.user.username;
        <a href="/api/auth/link/local" class="btn btn-default">
          Unlink
        </a>;
      } else {
        console.log("Not Authorised");
        <a href="/api/auth/link/local" class="btn btn-default">
          Unlink
        </a>;
      }
      if (user.facebookToken) {
        this.id = user.data.user._id;
        this.username = user.data.user.username;
        <a href="/unlink/facebook" class="btn btn-primary">
          Unlink
        </a>;
      } else {
        console.log("Not Authorised");
        <a href="/api/auth/link/facebook" class="btn btn-primary">
          Connect Facebook
        </a>;
      }
      if (user.deezerToken) {
        this.id = user.data.user._id;
        this.username = user.data.user.username;
        <a href="/unlink/twitter" class="btn btn-info">
          Unlink
        </a>;
      } else {
        console.log("Not Authorised");
        <a href="/api/auth/link/local/twitter" class="btn btn-info">
          Connect Twitter
        </a>;
      }
      if (user.email) {
        this.id = user.data.user._id;
        this.username = user.data.user.username;
        <a href="/unlink/google" class="btn btn-danger">
          Unlink
        </a>;
      } else {
        console.log("Not Authorised");
        <a href="/link/local" class="btn btn-danger">
          Link Local
        </a>;
      }
    },
  },
};
