import $$model from "../../script/model.js"
import $$EventBus from "../../script/EventBus.js"
export default {
    data () {
        return {
            formData: {
                corporation: "中国移动",//运营商
                system: "LTE",//基站类型
                dateRange: ["2016-07-18T16:00:00.000Z","2016-07-18T24:00:00.000Z"],
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
        formatDate (day) {
            var day = new Date(day);
            var year = day.getFullYear();
            var month = day.getMonth() + 1;
            var date = day.getDate();
            return "" + year + "/" + month<10?"0"+month:month + "/" + date<10?"0"+date:date;
        },
        search () {
            // 清空弹窗和地图
            $$EventBus.$emit("clearOverlays");
            $$EventBus.$emit("hideMsg");
            var that = this;
            //参数有效性检查

            if(that.formData.dateRange.length === 0){
                this.$message({
                    showClose: true,
                    message: '请选择查询时间',
                    type: 'error'
                });
                return;
            }

            var params = {
                dateRange: that.formData.dateRange,
                corporation: that.formData.corporation,
                system: that.formData.system,
                service: "rate"
            };

            //发送请求
            $$model.getResoureceRateInfo(params,function(data){
                that.$store.commit('storeSearchParams',params);// 存储查询参数
                that.$store.commit('storeSearchData',data);// 存储查询得到的数据
                //触发map中的监听事件
                $$EventBus.$emit("resourceRate",data);
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