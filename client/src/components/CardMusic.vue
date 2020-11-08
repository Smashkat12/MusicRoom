<template>
  <div class="card-deck">
    <div class="row">
      <div class="col-4">
        <div class="card" border-light style="width: 18rem">
          <div>
            <img
              class="card-img-top"
              :src="track.artist.picture_medium"
              alt="Music picture"
            />
            <div class="card-body">
              <p>Title: {{ track.title }}</p>
              <p>Artist: {{ track.artist.name }}</p>
            </div>
          </div>
          <div>
            <audio :src="track.preview" controls class="preview"></audio>
            <br />
            <div>
              <button class="buttons" v-on:click="addToPlaylist(track.id)">
                Add to playlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {axios_post} from "../functions/functions";
import sweet from "sweetalert";
import axios from "axios";
export default {
  name: "CardMusic",
  data() {
    return {
      deezerId:'',
      deezerToken:'',
      addMusic: [],
    };
  },
  props: {
    track: Object,
  },
  methods: {
    async addToPlaylist(trackid) {
        //console.log(index);
        //console.log(this.$parent.selectedPlaylist);
        var results = await axios_post("/api/playlist/"+this.$parent.selectedPlaylist+"/tracks/"+trackid);
        console.log(results);
      if (results == "Oops!") {
        sweet("", "Error", "error");
      } else {
        sweet("", "Track Added", "success");
      }
    },
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
};
</script>

<style scoped>

.preview {
  max-width: 250px;
  margin-left: 10px;
}

.card-deck {
    margin: auto 0;
    text-align: left;
    margin-left: 10px;
}
.card {
  /* border: solid; */
  background-color:#b5afbc ;
  margin-top: 20px;
}
.card-border{
  border:yellow;
}
.card-img-top {
  height: 200px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.buttons{
   margin:10px;
}
</style>
