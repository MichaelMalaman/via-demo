
<template>
        <input class="form-control"
               type="date"
               id="dateStandardDal"
               name="dateStandardDal"
               v-model="dataDal" />
</template>

<script setup>
    import { computed } from 'vue'
    import { useStore } from 'vuex'

    const store = useStore()

    // Lega il campo al filtro nello store
    const dataDal = computed({
        get: () => store.state.filters.dataDal, // legge dallo store
        set: (val) => {
            store.commit('setFilterField', { key: 'dataDal', value: val }) // scrive nello store
        }
    })

</script>
