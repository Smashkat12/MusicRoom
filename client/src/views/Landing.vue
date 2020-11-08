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
                label="Playlist Title"
                label-for="name-input"
                invalid-feedback="Name is required"
              >
                <b-form-input
                  id="name-input"
                  v-model="title"
                  :state="nameState"
                  required
                >
                </b-form-input>
                <br />
                <label for="type">Visibility</label>
                <b-form-radio v-model="type" name="visibility" value="Public">Public</b-form-radio>
                <b-form-radio v-model="type" name="visibility" value="Private">Private</b-form-radio>
              </b-form-group>
            </form>
          </b-modal>
        </b-col>
        <b-col sm="4" class="right">
          <b-button class="buttons">Add User To Playlist</b-button> 
          <b-button class="buttons" v-b-modal.newPlaylist
            >Create Playlist</b-button
          >
        </b-col>
      </b-row>
      <br/>
      <b-row>
        <b-col sm="12">
            <div>
              <b-tabs content-class="mt-4" fill>
                <b-tab title="Playlists" active><h3>Playlists</h3>
                <div class="card-deck" >
                  <div class="row"  v-if="found_playlists">
                    <div v-for="(list, index) in found_playlists" v-bind:key="index" @click="send_info(list)">
                      <router-link v-bind:to="'/playlist/' + list.id">
                        <div class="col-4">
                            <div class="card" border-light style="width: 18rem;">
                              <img class="card-img-top" :src="list.picture_medium" alt />
                              <div class="card-body">
                                <h2>{{ list.title }}</h2>
                                <h4>Created By {{ list.creator.name }}</h4>
                                <br />
                                <br />
                              </div>
                          </div>
                        </div>
                      </router-link>
                    </div>
                  </div>
                  
                  <br/><br/>
                </div>
              
                </b-tab>
                <b-tab title="Charts"><h3>Charts</h3>
                
                </b-tab>
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
        <!--<b-button
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
          href="http://localhost:8080/login"
          variant="outline-success"
          block
          @click="hideModal"
          >Link Local</b-button
        >-->
        <b-button
          class="mt-3"
          href="http://localhost:5000/api/auth/link/deezer"
          variant="outline-success"
          block
          @click="hideModal"
          >Link Deezer</b-button
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
import axios from "axios";
import EventBus from "../event_bus/event_bus";


export default {
  name: "Landing",
  components: {
    "app-header": Header,
    "app-footer": Footer,
  },
  data() {
    return {
      title: "",
      found_playlists: [],
      nameState: null,
      selected: "",
      errors: [],
      success: [],
      deezerId:"",
      deezerToken:"",
      type:""
    };
  },
  methods: {
    send_info(title) {
      EventBus.$emit("playlist_details", title);
    },
    createPlaylist: async function (){
      this.error = [];
      const data = {
        title: escape(this.title),
        type: escape(this.type),
        deezerId: escape(this.deezerId),
        deezerToken: escape(this.deezerToken),

      };
      var results = await axios_post("/api/playlist/create", data);
      if (results == "Oops!") {
        sweet("", results.data.err, "error");
      } else {
        console.log(results.data.success);
        sweet("", "Created " + this.title + " Playlist", "success");
      }
    },
    async getAllUserPlaylists() {
      try {
        const res = await axios.get('http://localhost:5000/api/playlist/me/all');
        this.found_playlists = res.data.playLists;
        this.no_of_playlist = res.data.playLists.length;
      } catch (error) {
        console.error(error);
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
        if(user.data.user._deezerId){
            this.deezerId = user.data.user._deezerId
            this.deezerToken = user.data.user.deezerToken;
            this.hideModal();
        }else{
          this.showModal();
        }
      }else{
        console.log("Not Authorised")
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
      (this.title = ""), (this.nameState = null);
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
  updated(){
    this.getUserData();
    //this.getAllUserPlaylists();
  },
  created(){
    this.getUserData();
    this.getAllUserPlaylists();
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
.buttons{
  margin-left:5px;
}

.center {
  text-align: center;
}
.card-deck {
    margin: auto 0;
    text-align: left;
    margin-left: 16px;
}
.card {
  /* border: solid; */
  background-color:#b5afbc ;
  margin-top: 20px;
}

.sort-buttons {
  margin: 5px;
}

.card-img-top {
  height: 250px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

}
.card-body {
  height: 200px;
  background: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
}
.card-border{
  border:yellow;
}
.layout {
   text-align: left;
}
</style>