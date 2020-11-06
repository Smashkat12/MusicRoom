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
              <button class="buttons" @click="AddToPlaylist()">
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
export default {
  name: "CardMusic",
  data() {
    return {
      addMusic: [],
    };
  },
  props: {
    track: Object,
  },
  methods: {
    addToPlaylist() {
      if (localStorage.getItem("AddSong") !== null) {
        this.addMusic = JSON.parse(localStorage.getItem("AddSong"));
      }
      localStorage.removeItem("AddSong");
      this.addMusic.push(this.track);
      localStorage.setItem("AddSong", JSON.stringify(this.addMusic));
    },
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
