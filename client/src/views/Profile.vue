<template>
  <div>
    <app-header></app-header>
    <div>
      <br /><br />
      <section>
        <div class="container">

          <div class="profile">

            <div class="profile-image">

              <img src="https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces" alt="">

            </div>

            <div class="profile-user-settings">

              <h1 class="profile-user-name">{{ username }}</h1>

              <button class="btn profile-settings-btn" aria-label="profile settings"><i class="fas fa-cog" aria-hidden="true"></i></button>

            </div>

            <div class="profile-stats">

              <ul>
                <li><span class="profile-stat-count">164</span> playlists</li>
                <li><span class="profile-stat-count">128</span> events</li>
                <li><span class="profile-stat-count">188</span> followers</li>
                <li><span class="profile-stat-count">206</span> following</li>
              </ul>

            </div>

            <div class="profile-bio">
               <div class="col">
                 <div id="err" v-for="error in errors" v-bind:key="error">
                  <p>{{ error }}</p>
                </div>
                  <form>
                    <label for="Username">Username</label>
                    <input
                    type="text"
                    class="form-control"
                    v-model="username"
                  />
                    <label for="Firstname">Firstname</label>
                    <input
                    type="text"
                    class="form-control"
                    v-model="firstname"
                  />
                    <label for="Lastname">Lastname</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="lastname"
                  />
                  <label for="Email Address">Email Address</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="email"
                  />
                  </form>
                  <input
                  class="buttons"
                  type="submit"
                  value="Update Profile"
                  @click="validateProfile"
                />
               </div>
            </div>
          </div>
          <!-- End of profile section -->
        </div>
      </section>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
import { axios_put,
         validUsername,
         validName,
         validEmail } from "../functions/functions";
import axios from "axios";
export default {
  components: {
    "app-header": Header,
    "app-footer": Footer,
  },
  data() {
    return {
      id:null,
      submit: true,
      username: "",
      firstname: "",
      email: "",
      lastname: "",
      errors: [],
      success: []
    };
  },
  methods: {
    validateProfile(){
      this.errors = [];
      var checkUsername = validUsername(this.username);
      var checkFirst = validName("First name", this.firstname);
      var checkLast = validName("Last name", this.lastname);
      var checkEmail = validEmail(this.email);
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
      else if(!checkEmail){
        this.errors.push("Invalid email");
        return;
      }
       if (this.errors.length == 0) {
        this.updateProfile();
      }
    },
    updateProfile: async function () {
      this.errors = [];
      const data = {
        id: this._id,
        firstname: escape(this.firstname),
        lastname: escape(this.lastname),
        username: escape(this.username),
        email: escape(this.email),
      };
      var results = await axios_put(`/api/user/${this._id}`, data);
      if (results !== "Oops!") {
        if (results.data.success == false) {
          this.errors = results.data.message;
          console.log(this.errors);
        } else if (results.data.success) {
          this.success.push("Profile Updated");
          this.clean_input();
          this.$router.push("/profile");
        }
      } else {
        this.errors.push("An unexpected error happened");
      }
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
        this.id = user.data.user._id
        this.username = user.data.user.username;
        this.email = user.data.user.email;
        this.lastname = user.data.user.lastname;
        this.firstname = user.data.user.firstname;
      }else{
        console.log("Not Authorised")
      }
    },
  },
  created() {
    this.getUserData();
  },
};
</script>

<style scoped>
/* Profile Section */

.profile {
    padding: 1rem 0;
}

.profile::after {
    content: "";
    display: block;
    clear: both;
}

.profile-image {
    float: left;
    width: calc(33.333% - 1rem);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 3rem;
}

.profile-image img {
    border-radius: 50%;
}

.profile-user-settings,
.profile-stats,
.profile-bio {
    float: left;
    width: calc(66.666% - 2rem);
}

.profile-user-settings {
    margin-top: 1.1rem;
}

.profile-user-name {
    display: inline-block;
    font-size: 1.5rem;
    font-weight: 300;
}

.profile-edit-btn {
    font-size: 1rem;
    line-height: 1.8;
    border: 0.1rem solid #dbdbdb;
    border-radius: 0.3rem;
    padding: 0 2.4rem;
    margin-left: 2rem;
}

.profile-settings-btn {
    font-size: 1rem;
    margin-left: 1rem;
}

.profile-stats {
    margin-top: 0rem;
}

.profile ul{
  padding-left: 0rem;
}

.profile-stats li {
    display: inline-block;
    font-size: 1rem;
    line-height: 1.5;
    margin-right: 1rem;
    cursor: pointer;
}

.profile-stats li:last-of-type {
    margin-right: 0;
}

.profile-bio {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    margin-top: 2.3rem;
}

.profile-real-name,
.profile-stat-count,
.profile-edit-btn {
    font-weight: 600;
}
</style>