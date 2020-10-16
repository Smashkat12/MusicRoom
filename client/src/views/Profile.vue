<template>
  <div>
    <app-header></app-header>
    <div>
      <br /><br />
      <section>
        <div class="container">
          <div class="row">
            <div class="col-container">
              <div class="col">
                <h1>
                  <span class="up">{{ username }}</span
                  >'s Profile
                </h1>
                <div v-for="update in updates" :key="update">
                  <small>{{ update }}</small>
                </div>
                <div id="preview" v-if="image">
                  <img :src="image" alt="" />
                </div>
                <div id="preview2" v-else>
                  <img :src="pro_pic" alt="No Pic available" id="test" />
                </div>
                <br />
                <form>
                  <input
                    type="file"
                    name="photo"
                    id=""
                    @change="onFileSelected"
                  />
                </form>
                <button class="buttons" @click="uploadImage">Upload</button>
                <form>
                  <input
                    type="text"
                    class="form-control"
                    v-model="first_name"
                  />
                  <br />
                </form>
                <input
                  class="buttons"
                  type="submit"
                  value="Update First Name"
                  @click="update_first"
                /><br /><br />
                <form>
                  <input type="text" class="form-control" v-model="last_name" />
                  <br />
                </form>
                <input
                  class="buttons"
                  type="submit"
                  value="Update Last Name"
                  @click="update_last"
                /><br /><br />
                <form>
                  <input type="email" class="form-control" v-model="email" />
                  <br />
                </form>
                <input
                  class="buttons"
                  type="submit"
                  value="Update Email"
                  @click="update_email"
                /><br />
                <br />
                <form>
                  <input
                    type="password"
                    class="form-control"
                    v-model="current_pass"
                    placeholder="Enter current password"
                  />
                  <br />
                  <input
                    type="password"
                    class="form-control"
                    v-model="new_pass"
                    placeholder="Enter new password"
                  />
                  <br />
                  <input
                    type="password"
                    class="form-control"
                    v-model="confirm_pass"
                    placeholder="Confirm new password"
                  />
                  <br />
                </form>
                <input
                  class="buttons"
                  type="submit"
                  value="Update Password"
                  @click="validate"
                /><br /><br />
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
import { secure_password, axios_post } from "../functions/functions";
import axios from "axios";
import jwt from "njwt";
export default {
  components: {
    "app-header": Header,
    "app-footer": Footer,
  },
  data() {
    return {
      username: "",
      new_username: "",
      first_name: "",
      email: "",
      last_name: "",
      message: "",
      selectedFile: null,
      updates: [],
      current_pass: "",
      new_pass: "",
      confirm_pass: "",
      errors: [],
      url: null,
      pro_pic: "",
      image: "",
      remoteUrl: "",
      base64: "",
    };
  },
  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      this.url = URL.createObjectURL(this.selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = e.target.result;
        this.base64 = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    },
    validate() {
      let check = secure_password(this.new_pass);
      if (check !== "good") {
        this.errors.push(check);
        return;
      }
      if (this.new_pass != this.confirm_pass) {
        this.errors.push("Passwords do not match");
        return;
      }
      if (this.errors.length == 0) {
        this.update_password();
      }
    },
    uploadImage() {
      if (!this.selectedFile) {
        this.errors.push("Select image");
        return;
      }
      let type = this.selectedFile.type;
      const data = new FormData();
      data.append("photo", this.selectedFile);
      data.append("username", this.username);
      data.append("base64image", this.base64);
      let config = {
        header: {
          "Content-Type": "application/json",
        },
      };
      const path =
        "http://localhost:5000/api/users/upload?username=" + this.username;
      let nn = type.split("/");
      if (nn[0] === "image") {
        axios
          .post(path, data, config)
          .then((result) => {
            this.message = result;
            if (result.data.changedRows) {
              this.updates.push("Profile picture updated!");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async update_details(data, url, field) {
      this.updates = [];
      let response = await axios_post("/api/users/update-" + url, data);
      if (response.data.changedRows) {
        this.updates.push(field + " updated!");
      } else if (response.data.data.changedRows) {
        this.updates.push(field + " updated!");
        this.username = response.data.username;
      }
    },
    update_username() {
      this.updates = [];
      let data = {
        email: this.email,
        username: escape(this.new_username),
      };
      this.update_details(data, "username/", "Username");
      localStorage.setItem("user", this.new_username);
    },
    update_first() {
      this.updates = [];
      let data = {
        email: this.email,
        first_name: escape(this.first_name),
      };
      this.update_details(data, "first/", "First name");
    },
    update_last() {
      this.updates = [];
      let data = {
        email: this.email,
        last_name: escape(this.last_name),
      };
      this.update_details(data, "last/", "Last name");
    },
    update_email() {
      this.updates = [];
      let data = {
        email: this.email,
        username: escape(this.username),
      };
      this.update_details(data, "email/", "Email");
    },
    update_password() {
      this.updates = [];
      let data = {
        username: this.username,
        old_pass: this.current_pass,
        new_pass: this.new_pass,
        confirm_pass: this.confirm_pass,
      };
      this.update_details(data, "password/", "Passsword");
      this.current_pass = "";
      this.new_pass = "";
      this.confirm_pass = "";
    },
    async getUserData() {
      let token = localStorage.getItem("jwt");
      let decode = await jwt.verify(token, "secret");
      let options = {
        method: "get",
        headers: { Authorization: token },
        url: "http://localhost:5000/api/users/me/" + decode.body.name,
      };
      let user = await axios(options).catch(() => {
        console.log("error");
      });
      this.username = user.data.username;
      this.email = user.data.email;
      this.last_name = user.data.last_name;
      this.first_name = user.data.first_name;
      this.pro_pic = user.data.pro_pic;
      localStorage.setItem("user", this.username);
    },
  },
  created() {
    this.getUserData();
  },
};
</script>

<style scoped>
#preview {
  justify-content: center;
  align-items: center;
}
#preview img {
  width: 200px;
  height: 200px;
}
#preview2 {
  justify-content: center;
  align-items: center;
}
#preview2 img {
  width: 200px;
  height: 200px;
}

.col-container {
  display: table;
  width: 100%;
}

.col {
  display: table-cell;
}

.up {
  text-transform: capitalize;
}
</style>