<template>
  <div>
    <app-header></app-header>
    <h6>Landing Page</h6>

    <div>
    <b-modal ref="my-modal" hide-footer title="Using Component Methods">
      <div class="d-block text-center">
        <h3>Hello From My Modal!</h3>
      </div>
      <b-button class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-button>
      <b-button class="mt-2" variant="outline-warning" block @click="toggleModal">Toggle Me</b-button>
    </b-modal>
  </div>

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
  methods: {
      showModal() {
        this.$refs['my-modal'].show()
      },
      hideModal() {
        this.$refs['my-modal'].hide()
      }
    },
    mounted() {
      this.showModal();
    }
};
</script>
<style scoped>
</style>