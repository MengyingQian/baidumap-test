<template>
    <div id="baiduMap"></div>
</template>

<script>
    export default {
        data () {
            return {
                map: {}
            }
        },
        computed: {},
        watch: {},
        methods: {},
        mounted () {
            this.$store.commit('init')
        },
        beforeMount () {
        }
    }
</script>