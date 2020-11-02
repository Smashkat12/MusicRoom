<template>
  <header>
    <div class="container">
      <div>
        <b-navbar toggleable="lg" type="dark">
          <b-navbar-brand class="logo" v-if="!is_logged_in">
            <router-link to="/"
                      ><span class="icon">MR</span>Music Room
            </router-link>
          </b-navbar-brand>

          <b-navbar-brand class="logo" v-if="is_logged_in">
            <router-link to="/landing"
                      ><span class="icon">MR</span>Music Room
            </router-link>
          </b-navbar-brand>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav> 
            <b-navbar-nav class="ml-auto" v-if="!is_logged_in">
                <b-nav-item><router-link to="/register">Register</router-link></b-nav-item>
                <b-nav-item><router-link to="/login">Login</router-link></b-nav-item>
                <b-nav-item><a target="_blank" href="http://localhost:5000/api/docs">Docs</a></b-nav-item>

            </b-navbar-nav>          
            <b-navbar-nav class="ml-auto" v-else>
                <b-nav-item><router-link to="/landing">Explorer</router-link></b-nav-item>
                <b-nav-item><router-link to="/search">Search Music</router-link></b-nav-item>
              <b-nav-item-dropdown style="background-color: #5e8465 !important" right>
                <template #button-content>
                  <em>{{ username }}</em>
                </template>
                <b-dropdown-item style="background-color: #5e8465 !important"><router-link to="/profile">Profile</router-link></b-dropdown-item>
                <b-dropdown-item style="background-color: #5e8465 !important"><button class="btn sec" @click="logout">Log out</button></b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
    </div>
  </header>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data() {
    return {
      title: "This is the header",
      token: null,
      is_logged_in: false,
      username:"",
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("jwt");
      swal("success", "logged out", "success");
      this.$router.push("/login");
    },
    async getUserData() {
      let token = localStorage.getItem("jwt");
      let options = {
        method: "get",
        headers: { Authorization: token },
        url: "http://localhost:5000/api/auth"
      };
      let user = await axios(options).catch(() => {
        console.log("Unable to process request");
      });
      if(user.data.auth == true)
      {
        this.username = user.data.user.username;
      }else{
        console.log("Not Authorised")
      }
    },
  },

  created() {
    this.getUserData();
    this.token = localStorage.getItem("jwt");
    if (this.token) {
      this.is_logged_in = true;
    }
    
  },
};
</script>
<style scoped>
header {
  background-color: #5e8465 !important;
  width: 100%;
  padding-bottom: 2px;
  padding-top: 2px;
}

body {
  background: #f5f5f5;
  font-family: 'Open Sans Condensed', sans-serif;
  font-size: 16px;
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

.router-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
  position: relative;
  display: block;
  padding: 0.5rem 1rem;

}

.dropdown-menu{
  background-color: #5e8465 !important;
}


em{
  padding-left: 1rem;
}

.nav-link{
  display: block;
  padding: 0.5rem 1rem;
}
.nav-item{
  color: white;
  text-decoration: none;
  font-size: 16px;
  position: relative;
  display: block;
  padding: 0.2rem 0.2rem;
}

.router-link-active {
  color: white;
  text-decoration: none;
  position: relative;
  display: block;
}

.router-link-exact-active {
  font-size: 16px;
  font-weight: bolder;
  display: block;
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
  font-size: 16px;
  font-family: 'Open Sans Condensed', sans-serif;
}

.icon {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin: 10px;
  font-size: 16px;
  font-family: 'Open Sans Condensed', sans-serif;
  border: 3px solid #fff;
}

.menu ul li {
  font-family: 'Open Sans Condensed', sans-serif;
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
