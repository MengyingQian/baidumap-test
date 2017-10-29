import $$model from "../../script/model.js"
import $$EventBus from "../../script/EventBus.js"

export default {
    data () {
        return {
            formData: {
                corporation: "中国移动",//运营商
                system: "LTE",//基站类型
                corporation_inter: "中国移动",//干扰对象
                system_inter: "LTE",
                maxFrequence: 38500,//最高频率
                minFrequence: 38300//最低频率
            }
        }
    },
    methods: {
        search () {
            // 清空弹窗和地图
            $$EventBus.$emit("clearOverlays");
            $$EventBus.$emit("hideMsg");
            var that = this;
            
            var bounds = this.$store.state.bounds;
            var bssw = bounds.getSouthWest();   //可视区域左下角
            var bsne = bounds.getNorthEast();   //可视区域右上角

            var params = {
                // searchBox: [bssw.lng,bssw.lat,bsne.lng,bsne.lat],
                corporation: that.formData.corporation,
                system: that.formData.system,
                corporation_inter: that.formData.corporation_inter,
                system_inter: that.formData.system_inter,
                freqRange: [that.formData.minFrequence,that.formData.maxFrequence]
            }
            //发送请求
            $$model.getInterferenceInfo(params,function(data){
                that.$store.commit('storeSearchParams',params);// 存储查询参数
                that.$store.commit('storeSearchData',data);// 存储查询得到的数据
                //触发map中的监听事件
                $$EventBus.$emit("interference",data);
            })
        }
    }
}