
<template>
   
        <input class="form-control"
               type="date"
               id="dateStandardAl"
               name="dateStandardAl"
               v-model="dataAl" />
  
</template>

<script setup>
    import { computed } from 'vue'
    import { useStore } from 'vuex'

    const store = useStore()

    // Lega il campo al filtro nello store
    const dataAl = computed({
        get: () => store.state.filters.dataAl, // legge dallo store
        set: (val) => {
            store.commit('setFilterField', { key: 'dataAl', value: val }) // scrive nello store
        }
    })
</script>
