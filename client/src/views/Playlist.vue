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
      <br />
      <b-row>
        <b-col sm="12">
          <h1></h1>

          <div>
            <div
              class="deezer-widget-player"
              v-bind:data-src="url"          
              data-scrolling="no"
              data-frameborder="0"
              data-allowTransparency="true"
              data-width="700"
              data-height="350"
            ></div>
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
import { axios_post } from "../functions/functions";
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
      id: this.$route.params.id,
      title: "",
      found_playlists: [],
      nameState: null,
      selected: "",
      errors: [],
      success: [],
      deezerId: "",
      deezerToken: "",
      type: "",
      url:"https://www.deezer.com/plugins/player?format=classic&autoplay=true&playlist=true&width=700&height=350&color=EF5466&layout=&size=medium&type=playlist&id="+this.$route.params.id+"&app_id=1",
    };
  },
  methods: {
    playTracks() {
        var w = document[
        typeof document.getElementsByClassName === "function"
          ? "getElementsByClassName"
          : "querySelectorAll"
      ]("deezer-widget-player");
      for (var i = 0, l = w.length; i < l; i++) {
        w[i].innerHTML = "";
        var el = document.createElement("iframe");
        el.src = w[i].getAttribute("data-src");
        el.scrolling = w[i].getAttribute("data-scrolling");
        el.frameBorder = w[i].getAttribute("data-frameborder");
        el.setAttribute("frameBorder", w[i].getAttribute("data-frameborder"));
        el.allowTransparency = w[i].getAttribute("data-allowTransparency");
        el.width = w[i].getAttribute("data-width");
        el.height = w[i].getAttribute("data-height");
        w[i].appendChild(el);
      }
    },
    createPlaylist: async function () {
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
      if (user.data.auth == true) {
        if (user.data.user._deezerId) {
          this.deezerId = user.data.user._deezerId;
          this.deezerToken = user.data.user.deezerToken;
        }
      } else {
        console.log("Not Authorised");
      }
    },
  },
  mounted() {
    EventBus.$on("playlist_details", (data) => {
      this.tracks = data;
    });
        this.playTracks();

  },
  updated() {
    //this.getUserData();
    //this.getAllUserPlaylists();

  },
  created() {
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
  background-color: #b5afbc;
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
.card-border {
  border: yellow;
}
.layout {
  text-align: left;
}
</style>