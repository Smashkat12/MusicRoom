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
        </b-col>
        <b-col sm="4" class="right">
          <b-button class="buttons right" v-b-modal.newPlaylist
            >Create Playlist</b-button
          >
        </b-col>
      </b-row>
      <br/>
      <b-row>
        <b-col sm="12">
            <div>
              <b-tabs content-class="mt-3" justified>
                <b-tab title="Charts" active><h3>Charts</h3></b-tab>
                <b-tab title="Playlists"><h3>Playlists</h3></b-tab>
                <b-tab title="Listening History"><h3>Listening History</h3></b-tab>
                <b-tab title="Delegations"><h3>Delegations</h3></b-tab>
              </b-tabs>
            </div>
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
      </b-modal>
    </div>

    <app-footer></app-footer>
  </div>
</template>
<script>
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