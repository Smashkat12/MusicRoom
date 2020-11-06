<template>
  <div>
    <app-header></app-header>
    <br />
    <b-container fluid>
      <b-row class="panel">
        <b-col sm="8" class="panel"></b-col>
        <b-col sm="4" class="right">
          <b-button class="buttons right" v-b-modal.newPlaylist
            >Create Playlist</b-button
          >
        </b-col>
      </b-row>
      <br/>
      <b-row>
        <b-col sm="12">
            <h1>{{ id }}</h1>

            <div>
              <vue-friendly-iframe :src="url"></vue-friendly-iframe>
            </div>
        </b-col>
      </b-row>
    </b-container>

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
      tracks: {},
      url:"http://developers.deezer.com/en/plugins/player?playlist=true&width=700&height=240&autoplay=false&type=playlist&id=472423955",
      id: this.$route.params.id,
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
        }
      }else{
        console.log("Not Authorised")
      }
    },
  },
   mounted() {
    EventBus.$on("playlist_details", (data) => {
      this.tracks = data;
      console.log(this.tracks);
    });
  },
  updated(){
    //this.getUserData();
    //this.getAllUserPlaylists();
  },
  created(){
    //this.getUserData();
    //this.getAllUserPlaylists();
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