import $$model from "../../script/model.js"
import $$EventBus from "../../script/EventBus.js"
export default {
    data () {
        return {
            formData: {
                corporation: "中国移动",//运营商
                system: "LTE",//基站类型
                service: "all",//业务类型
                dateRange: [],
                sideLength: "1",
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
            var that = this;
            //参数有效性检查
            //时间检查
            
            //判断视野内矩形数目
            var minLng = 0.0117;//每公里经纬度变化量
            var minLat = 0.009;
            var bounds = this.$store.state.bounds;
            var bssw = bounds.getSouthWest();   //可视区域左下角
            var bsne = bounds.getNorthEast();   //可视区域右上角
            var column = parseInt((bsne.lng-bssw.lng)/(minLng*this.sideLength));//列数目
            var row = parseInt((bsne.lat-bssw.lat)/(minLat*this.sideLength));//行数目
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
                startTime: that.formData.dateRange[0],
                endTime: that.formData.dateRange[1],
                corporation: that.formData.corporation,
                system: that.formData.system,
                service: that.formData.service,
                sideLength: that.formData.sideLength,
                isAverage: that.formData.isAverage
            };

            //重置地图
            this.$store.commit("clearMap",true); 
            //关闭弹窗
            this.$store.commit("setShowTab",false); 
            //发送请求
            $$EventBus.$emit("attrQuery",params);
        }
    },
    beforeMount () {
        //初始化设置
        var that = this;
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