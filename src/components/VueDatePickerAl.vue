<template>
    <div class="input-group">
        <span class="input-group-text bg-white">
            <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-calendar`"></use></svg>
        </span>
        <input class="form-control"
               type="date"
               id="dateStandardAl"
               name="dateStandardAl"
               v-model="dataAl" />
    </div>
</template>
<script setup>
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    import { computed } from 'vue'
    import { useStore } from 'vuex'
    const spritesHref = spritesUrl

    const store = useStore()

    const dataAl = computed({
        get: () => store.state.filters.dataAl, 
        set: (val) => {
            store.commit('setFilterField', { key: 'dataAl', value: val })
        }
    })

</script>
