import $$model from "../../script/model.js"
import $$EventBus from "../../script/EventBus.js"
export default {
	data () {
		return {
			formData: {
			    corporation: "中国移动",//运营商
			    system: "LTE",//基站类型
			    maxDistance: 1000//测量点间距
			}
		}
	},
	methods: {
		search () {
			// 清空弹窗和地图
            $$EventBus.$emit("clearOverlays");
            $$EventBus.$emit("hideMsg");
			var bounds = this.$store.state.bounds;
			var bssw = bounds.getSouthWest();   //可视区域左下角
			var bsne = bounds.getNorthEast();   //可视区域右上角

			var zoom = this.$store.state.zoom;
			var step = 12.5*Math.pow(2,18-zoom);//单位栅格边长（m）

			var params = {
				searchBox: [bssw.lng,bssw.lat,bsne.lng,bsne.lat],
				corporation: that.formData.corporation,
				system: that.formData.system,
				maxDistance: that.formData.maxDistance
				step: step
			}
			//发送请求
			$$model.getRectangleInfo(params,function(data){
			    that.$store.commit('storeSearchParams',params);// 存储查询参数
			    that.$store.commit('storeSearchData',data);// 存储查询得到的数据
			    //触发map中的监听事件,覆盖分析
			    $$EventBus.$emit("coverage",data);
			})
		}
	},
	beforeMount () {}
}