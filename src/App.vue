

<template>
    <div id="app" class="bg-primary min-vh-100 d-flex flex-column">
        <topNavbar />
        <main class="flex-grow-1 p-1 mt-5">
            <router-view />
        </main>

    </div>
</template>

<script setup lang="ts">
    import topNavbar from './components/topNavbar.vue'
</script>
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


    .mt-6 {
        margin-top: 4.5rem;
    }
</style>