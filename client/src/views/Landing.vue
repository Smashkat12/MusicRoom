<template>
  <div>
    <app-header></app-header>
    <br />
    <b-container fluid>
      <b-row class="panel">
        <b-col sm="8" class="panel">
          <b-modal
            id="newPlaylist"
            ref="modal"
            title="Create a Playlist"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleOk"
            okTitle="Create Playlist"
          >
            <form ref="form" @submit.stop.prevent="handleSubmit">
              <b-form-group
                :state="nameState"
                label="Playlist Name"
                label-for="name-input"
                invalid-feedback="Name is required"
              >
                <b-form-input
                  id="name-input"
                  v-model="name"
                  :state="nameState"
                  required
                >
                </b-form-input>
                <br />
                Description
                <b-form-textarea
                  id="textarea"
                  v-model="description"
                  placeholder="Description"
                  rows="3"
                  max-rows="6"
                />
                <br />
                Visibility
                <b-form-radio v-model="selected" name="type" value="Public"
                  >Public</b-form-radio
                >
                <b-form-radio v-model="selected" name="type" value="Private"
                  >Private</b-form-radio
                >
                <br />
              </b-form-group>
            </form>
          </b-modal>
          <a
            href="http://localhost:5000/api/auth/link/deezer"
            class="btn btn-info"
          >
            Link Deezer
          </a>
          <a href="/link/local" class="btn btn-danger"> Link Local </a>
        </b-col>
        <b-col sm="4" class="right">
          <b-button class="buttons right" v-b-modal.newPlaylist
            >Create Playlist</b-button
          >
        </b-col>
      </b-row>
    </b-container>

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

    <app-footer></app-footer>
  </div>
</template>
<script>
import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {axios_post} from "../functions/functions";
import sweet from "sweetalert";


export default {
  name: "Landing",
  components: {
    "app-header": Header,
    "app-footer": Footer,
  },
  data() {
    return {
      name: "",
      description: "",
      nameState: null,
      selected: "",
      errors: []
    };
  },
  methods: {
    createPlaylist: async function (){
      this.error = [];
      const data = {
        name: escape(this.name),
        description: escape(this.description),
        selected: escape(this.selected),
      };
      var results = await axios_post("/api/room/create", data);
      if (results == "Oops!") {
        this.errors.push("Error");
      } else {
        sweet("", "Created Playlist", "success");
      }
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    resetModal() {
      (this.name = ""), (this.nameState = null), (this.description = "");
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Push the name to submitted names
      this.createPlaylist();
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("newPlaylist");
      });
    },
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
.panel {
  background-color: #eee;
}
.right {
  text-align: right;
}
</style>