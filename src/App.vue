

<template>
    <div class=" min-vh-100 d-flex flex-column">
        <topNavbar class="bg-primary" />
        <main class="flex-grow-1 content-page-color">
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
    .content-page-color {
        background-color: rgb(227, 242, 253);
    }


    .btn-back {
        color: #000; /* colore normale del testo */
        background-color: #f2f2f2; /* sfondo normale */
        border: 1px solid #6c757d;
        transition: background 0.2s, color 0.2s;
    }

        .btn-back:hover,
        .btn-back:focus {
            background-color: #004080 !important; /* blu accessibile ad alto contrasto */
            color: #ffffff; /* testo bianco leggibile */
            outline: 2px solid #002a5e; /* focus ring visibile */
        }

</style>