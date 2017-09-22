import $$model from "../../script/model.js"
import $$EventBus from "../../script/EventBus.js"
export default {
    data () {
        return {
            formData: {
                corporation: "中国移动",//运营商
                system: "LTE",//基站类型
                service: "all",//业务类型
                dateRange: ["2016-07-18T16:00:00.000Z","2016-07-18T24:00:00.000Z"],
                sideLength: "2",
                isAverage: true
            },
            Maxtime: "",
            Mintime: ""
        }
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
            
            //判断视野内矩形数目
            var bounds = this.$store.state.bounds;
            var bssw = bounds.getSouthWest();   //可视区域左下角
            var bsne = bounds.getNorthEast();   //可视区域右上角
            var minLng = that.formData.sideLength/(111*Math.cos(bssw.lat*Math.PI/180));// 单个栅格经度变化
            var minLat = that.formData.sideLength/111;// 单个栅格维度变化
            var column = parseInt((bsne.lng-bssw.lng)/minLng);//列数目
            var row = parseInt((bsne.lat-bssw.lat)/minLat);//行数目
            
            if(column<1||row<1){
                this.$message({
                    showClose: true,
                    message: '当前地图可视范围过小请重新选择网格大小',
                    type: 'error'
                });
                return;
            }
            if(column>10||row>5){
                this.$message({
                    showClose: true,
                    message: '当前地图方格过多请重新选择网格大小',
                    type: 'error'
                });
                return;
            }
            if(that.formData.dateRange.length === 0){
                this.$message({
                    showClose: true,
                    message: '请选择查询时间',
                    type: 'error'
                });
                return;
            }

            var params = {
                searchBox: [bssw.lng,bssw.lat,bsne.lng,bsne.lat],
                dateRange: that.formData.dateRange,
                corporation: that.formData.corporation,
                system: that.formData.system,
                service: that.formData.service,
                sideLength: that.formData.sideLength
            };

            //发送请求
            $$model.getRectangleInfo(params,function(data){
                params.isAverage = that.formData.isAverage;
                that.$store.commit('storeSearchParams',params);// 存储查询参数
                that.$store.commit('storeSearchData',data);// 存储查询得到的数据
                //触发map中的监听事件
                $$EventBus.$emit("mapRectangle",data);
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