<template>
  <div>
    <app-header></app-header>
  <h6 >Search Music</h6>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";

export default {
  components: {
    "app-header": Header,
    "app-footer": Footer,
    
  },
};
</script>
<style scoped>

</style>