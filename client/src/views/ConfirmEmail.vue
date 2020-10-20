<template>
  <div>
    <app-header></app-header>
    <h6></h6>
    <app-footer></app-footer>
  </div>
</template>
<script>
import axios from 'axios'
import Header from "../components/Header";
import Footer from "../components/Footer";
import sweet from "sweetalert";


export default {
  components: {
    "app-header": Header,
    "app-footer": Footer,
  },
  data() {
    return {
      key: this.$route.params.key
    };
  },
  created: function(){
        this.confirm()
 },
  methods: {
    confirm() {
      const path = "http://localhost:5000/api/auth/confirm";
      axios.post(path, {"key": this.key})
        .then((result) => {
            console.log(result)
          if (result.data.error) {
            sweet("", "Server Error, Try again later", "error");
          } else if (result.data.success == true) {
            sweet("", "Account Activated", "success");
            setTimeout(() => {
              this.$router.push("/login");
            }, 4000);
          }
           else if (result.data.success == false) {
            sweet("", "Account has already been activated", "error");
            setTimeout(() => {
              this.$router.push("/login");
            }, 4000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style scoped>
</style>