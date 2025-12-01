<script setup lang="ts">
import topNavbar from './components/topNavbar.vue'
</script>

<template>
    <v-app class="bg-primary">
        <topNavbar/>
        <router-view style="margin-top:80px"/>
    </v-app>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
