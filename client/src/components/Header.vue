<template>
  <header>
    <div class="container">
      <nav>
        <div class="row">
          <div class="menu">
            <div class="logo" v-if="!is_logged_in">
              <router-link to="/"
                ><span class="icon">MR</span>Music Room</router-link
              >
            </div>
            <div class="logo" v-if="is_logged_in">
              <router-link to="/library"
                ><span class="icon">MR</span>Music Room</router-link
              >
            </div>
            <ul v-if="!is_logged_in">
              <li><router-link to="/register">Register</router-link></li>
              <li><router-link to="/login">Log In</router-link></li>
            </ul>
            <ul v-else>
              <li class="btn sec">
                <router-link to="/profile">Profile</router-link>
              </li>
              <li class="btn sec">
                <router-link to="/landing">Music</router-link>
              </li>
              <li class="btn sec">
                <router-link to="/search">Search Music</router-link>
              </li>
              <li class="btn sec">
                <button class="btn sec" @click="logout">Log out</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import swal from "sweetalert";
export default {
  data() {
    return {
      title: "This is the header",
      uid: null,
      is_logged_in: false,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      swal("success", "logged out", "success");
      this.$router.push("/login");
    },
  },

  created() {
    this.uid = localStorage.getItem("jwt");
    if (this.uid) {
      this.is_logged_in = true;
    }
  },
};
</script>
<style  scoped>
header {
  background-color: #5e8465 !important;
  width: 100%;
  padding-bottom: 14px;
  padding-top: 14px;
}

body {
  background: #f5f5f5;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}

.container {
  width: 100%;
  padding-right: -15px;
  padding-left: -15px;
  margin-right: auto;
  margin-left: auto;
}
a {
  color: #fff;
}
* {
  margin: 0px;
  padding: 0px;
}
.row {
  margin: 0 auto;
  width: 80%;
}

.router-link-active {
  color: white;
  text-decoration: none;
}

.router-link-exact-active {
  font-size: 25px;
  font-weight: bolder;
}

.menu {
  text-align: center;
  width: 100%;
}
nav {
  background: #5e8465;
}
.menu ul {
  list-style-type: none;
  float: right;
}

.logo {
  float: left;
  line-height: 60px;
  color: white;
  font-size: 30px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}

.icon {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin: 10px;
  font-size: 30px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  border: 3px solid #fff;
}

.menu ul li {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  padding: 0.5em;
  display: inline-block;
  color: #fff;
  line-height: 50px;
  font-weight: bold;
  height: 50px;
}

.menu ul li a:hover {
  color: #fff;
}

.menu ul ul a {
  display: none;
  color: #fff;
}

.menu ul ul li a {
  display: none;
  display: inline-block;
  color: #fff;
}

.menu ul li:hover > ul {
  display: block;
  position: absolute;
}

.menu ul ul {
  width: 10px;
  /* margin: -10px; */
  padding-left: 0px;
  margin-left: -10px;
  margin-top: 10px;
}

.btn {
  margin: 0.375rem;
  color: inherit;
  text-transform: uppercase;
  word-wrap: break-word;
  white-space: normal;
  cursor: pointer;
  border: 0;
  border-radius: 0.125rem;
  -webkit-transition: color 0.15s ease-in-out,
    background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  padding: 0.5em;
  font-size: 0.81rem;
}
.sec {
  color: #fff;
  background-color: #5e8465 !important;
}
</style>