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
            var that = this;
			// 清空弹窗和地图
            $$EventBus.$emit("clearOverlays");
            $$EventBus.$emit("hideMsg");
			var bounds = this.$store.state.bounds;
			var bssw = bounds.getSouthWest();   //可视区域左下角
			var bsne = bounds.getNorthEast();   //可视区域右上角


			var zoom = this.$store.state.zoom;
            var maxDistance = that.formData.maxDistance;
			var step = 12.5*Math.pow(2,18-zoom);//单位栅格边长（m）
            var minLng = step/(1000*111*Math.cos(bssw.lat*Math.PI/180));// 单个栅格经度变化
            var minLat = step/(1000*111);// 单个栅格维度变化
            var numLng = Math.ceil(maxDistance/step);//单个点搜索范围经度范围
            var numLat = Math.ceil(maxDistance/step);//单个点搜索范围纬度范围
            var startLng = bssw.lng - numLng*minLng;// 扩大查询范围，保证视野边缘部分的精度
            var startLat = bssw.lat - numLat*minLat;
            var endLng = bsne.lng + numLng*minLng;
            var endLat = bsne.lat + numLat*minLat;

			var params = {
				searchBox: [startLng,startLat,endLng,endLat],
				corporation: that.formData.corporation,
				system: that.formData.system,
				maxDistance: maxDistance,
				step: step
			}
			//发送请求
			$$model.getCoverageInfo(params,function(data){

			    that.$store.commit('storeSearchParams',params);// 存储查询参数
			    that.$store.commit('storeSearchData',data);// 存储查询得到的数据
			    //触发map中的监听事件,覆盖分析
			    $$EventBus.$emit("coverage",data);
			})
		}
	},
	beforeMount () {}
}