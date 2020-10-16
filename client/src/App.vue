<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #fff;
  font-size: 100%;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

}
.center{
  text-align: center;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #7c5295;
  padding: 0;
  font-size: 1em;
}
header{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background-color: #5dbcd2;
}
section {
  display: block;
  min-height: 400px;
  max-width: 1000px;
  margin: 0 auto;
}

.message {
  margin: 2em 20px;
  font-size: 0.9em;
  text-transform: uppercase;
}

.title {
  margin: 1em 0 1em 20px;
  font-family: sans-serif;
  font-size: 1.5em;
  text-transform: uppercase;
}
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}
.btn {
    margin: .375rem;
    color: inherit;
    text-transform: uppercase;
    word-wrap: break-word;
    white-space: normal;
    cursor: pointer;
    border: 0;
    border-radius: .125rem;
    -webkit-transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
    padding: 0.5em;
    font-size: .81rem;
}

.buttons{
    background: #442f8f;
    color: white;
    padding: 10px;
    border: 1px solid #213b5d;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    border-radius: 7px;
}

input[type=text], input[type=password], input[type=email] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.container {
    width: 100%;
    padding-right: -15px;
    padding-left: -15px;
    margin-right: auto;
    margin-left: auto;
}

.row {
    margin: 0 auto;
    width: 80%;
}

</style>
