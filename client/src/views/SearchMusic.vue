 <template>
  <div>
    <app-header></app-header>
    <h1 class="title">Search Music</h1>
    <section>
      <form @submit.prevent="submit">
        <br />
        <input type="text" v-model="title" id="title" placeholder="Title" />
        <br />
        <br />
        <div class="dropdown">
          <label for="searchBy" class="text">Sort by : </label>
          <select
            v-model="searchBy"
            class="btn buttons dropdown-toggle"
            id="searchBy"
          >
            /
            <option value="ALBUM_ASC">Album</option>
            <option value="ARTIST_ASC">Artist</option>
            <option value="TRACK_ASC">Music</option>
            <option value="RANKING_ASC">Most popular</option>
            <option value="RATING_ASC">Top rated</option>
          </select>
        </div>
        <br />
        <br />
        <button type="submit" class="buttons">Submit</button>
      </form>
      <div v-if="track" class="musics">
        <CardMusic
          v-for="(list, index) in track.data"
          :key="index"
          :track="list"
        />
      </div>
      <div v-else>No music found</div>
    </section>
    <app-footer></app-footer>
  </div>
</template>
    

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import fetchJsonp from "fetch-jsonp";
// import { mdbIcon } from "mdbvue";
import CardMusic from "@/components/CardMusic.vue";

export default {
  name: "search",
  components: {
    "app-header": Header,
    "app-footer": Footer,
    // mdbIcon,
    CardMusic,
  },
  data() {
    return {
      title: "",
      track: null,
      searchBy: "RANKING_ASC",
    };
  },
  methods: {
    async getAllUserPlaylists() {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/playlist/me/all"
        );
        this.found_playlists = res.data.playLists;
        this.no_of_playlist = res.data.playLists.length;
      } catch (error) {
        console.error(error);
      }
    },
    search(search, order) {
      const api = "https://api.deezer.com";
      return fetchJsonp(`${api}/search?q=${search}&order=${order}&output=jsonp`)
        .then((res) => res.json())
        .then((res) => {
          if (res.error === 1) {
            return Promise.reject(res);
          } else {
            return Promise.resolve(res);
          }
        });
    },
    submit() {
      this.search(this.title, this.searchBy).then((track) => {
        this.track = track;
      });
    },
  },
};
</script>
<style scoped>
.text {
  margin: 10px;
}
.musics {
  display: grid;
  align-content: center;
  grid-template-columns: repeat(auto-fill, minmax(253px, 1fr));
}
.buttons {
  color: white;
}


</style>