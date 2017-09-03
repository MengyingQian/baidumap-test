export default {
    data () {
        return {
        }
    },
    computed: {
        showTab () {
            return this.$store.state.showTab;
        }
    },
    watch: {},
    methods: {
        shutTab () {
            this.$store.commit("setShowTab",false);
        }
    },
    beforeMount () {}
}