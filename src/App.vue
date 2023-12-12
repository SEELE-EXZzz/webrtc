<template>
  <div id="app">
    <!-- <login></login> -->
    <!-- <room></room> -->
    <!-- <router-link to="/"></router-link> -->
    <router-view></router-view>
  </div>
</template>

<script>
import login from './components/login.vue'
import room from './components/room.vue'
export default{
  data(){
    return{
      page:'/'
    }
  },
  components:{
    login,
    room
  }
}
</script>

<style>


</style>
