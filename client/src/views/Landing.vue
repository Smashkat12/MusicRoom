<template>
  <div>
    <app-header></app-header>
    <h6>Landing Page</h6>
    <app-footer></app-footer>
  </div>
</template>
<script>

import Footer from "../components/Footer";
import Header from "../components/Header";


export default {
  name: "Landing",
  components: {
    "app-header": Header,
    "app-footer": Footer,
   
  },
};
</script>
<style scoped>
</style>