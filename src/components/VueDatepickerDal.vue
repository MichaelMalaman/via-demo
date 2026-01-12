<template>
    <div class="input-group">
        <span class="input-group-text bg-white">
            <svg class="icon" style="color:white"><use :href="`${spritesHref}#it-calendar`"></use></svg>
        </span>
        <input class="form-control"
               type="date"
               id="dateStandardDal"
               name="dateStandardDal"
               v-model="dataDal" />
    </div>
</template>
<script setup>    
    import spritesUrl from 'bootstrap-italia/dist/svg/sprites.svg?url'
    import { computed } from 'vue'
    import { useStore } from 'vuex'
    const spritesHref = spritesUrl

    const store = useStore()

    // Lega il campo al filtro nello store
    const dataDal = computed({
        get: () => store.state.filters.dataDal, // legge dallo store
        set: (val) => {
            store.commit('setFilterField', { key: 'dataDal', value: val }) // scrive nello store
        }
    })

</script>
