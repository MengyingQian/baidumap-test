import $$EventBus from "../../script/EventBus.js"

export default {
    data () {
        return {
            showTab: false
        }
    },
    watch: {},
    methods: {
        shutTab () {
            this.showTab = false;
        },
        setMessage (params) {
            var index = params.index;
            var type = params.type;
            var page = params.apge;
            var data = this.$store.state.searchData[index[0]];
            if(index.length === 2) {
                data = data.baseInfo[index[1]];
            }
            console.log("message",data)
        }
    },
    beforeMount () {
        let that = this;
        $$EventBus.$on("showMessage",function(data){
            that.setMessage.call(that,data)
        });
    }
}