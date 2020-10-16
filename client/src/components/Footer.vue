<template>
  <div class="footer">
    <footer>
      <h6>{{ title }}</h6>
    </footer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: "© Music is in the beat 2020",
    };
  },
};
</script>

<style scoped>
.footer {
  left: 0;
  bottom: 0;
  width: 100%;
  color: #5e8465;
  text-align: center;
  background-color: #fff;
  margin-top: 12px;
  padding: 10px;
  text-transform: uppercase;
  /* position: fixed; */
}
.h6 {
  font-size: 0.5em;
}
</style>