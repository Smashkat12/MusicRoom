<template>
  <div>
    <app-header></app-header>
    <h6>Landing Page</h6>
    <app-footer></app-footer>
  </div>
</template>
<script>
import Header from "../components/Header";
import Footer from "../components/Footer";

export default {
  name: "landing",
  components: {
    "app-footer": Footer,
    "app-header": Header,
  },
};
</script>
<style scoped>
</style>