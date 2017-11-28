import $$model from "../../script/model.js"
import $$EventBus from "../../script/EventBus.js"
export default {
    data () {
        return {
            formData: {
                corporation: "中国移动",//运营商
                system: "LTE"//基站类型
            },
            Maxtime: "",
            Mintime: "",
            systemOptions: {}
        }
    },
    watch: {
       corporation: function (newVal) {}
    },
    methods: {
        search () {
            // 清空弹窗和地图
            $$EventBus.$emit("clearOverlays");
            $$EventBus.$emit("hideMsg");
            var that = this;
            //参数有效性检查

            var params = {
                corporation: that.formData.corporation,
                system: that.formData.system
            };

            //发送请求
            $$model.getNetworkLayoutInfo(params,function(data){
                that.$store.commit('storeSearchParams',params);// 存储查询参数
                that.$store.commit('storeSearchData',data);// 存储查询得到的数据
                //触发map中的监听事件
                $$EventBus.$emit("networkLayout",data);
            })
        }
    },
    beforeMount () {
        //初始化设置
        // var that = this;
        // var params = {
        //     system:'LTE',
        //     attr:'业务时间'
        // }
        // $$model.aggregate(params,function(data){
        //     that.Maxtime = data.Maxtime;
        //     that.Mintime = data.Mintime;
        // })
    }
}