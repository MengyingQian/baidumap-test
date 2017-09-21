import $$EventBus from "../../script/EventBus.js"

export default {
    data () {
        return {
            showTab: false,
            selectTab: "message",
            echarts_abbrs: [],//将要绘制echarts的属性
            message: ""//台站信息页展示内容
        }
    },
    computed: {
        tabsWidth () {
            return this.selectTab === "statistics"? "600px":"400px";
        }
    },
    watch: {},
    methods: {
        shutTab () {
            this.showTab = false;
            $$EventBus.$emit("clearSelect");
        },
        setMessage (params) {
            var index = params.index;
            var type = params.type;
            var page = params.page;
            switch (page) {
                case "mapRectangle":
                    if (type === "rectangle") {
                        this.setRectangleMsg(index);
                    } else if(type === "point") {
                        this.setPointMsg(index);
                    }
                    break;
            }
        },
        setPointMsg (index) {
            var that = this;
            this.echarts_abbrs = [];//echarts绘图列表设为空
            var searchParams = this.$store.state.searchParams;
            var baseInfo = this.$store.state.searchData.baseInfo[index];
            this.message = [];
            switch (searchParams.service) {
                case "all":
                    var abbrs = ["语音数据(分钟)","短信数据(条数)","LTE上行总流量(MByte)","LTE下行总流量(MByte)"];//获取所有应该展示的属性
                    break;
                case "voice":
                    var abbrs = ["语音数据(分钟)"];
                    break;
                case "note":
                    var abbrs = ["短信数据(条数)"];
                    break;
                case "all":
                    var abbrs = ["LTE上行总流量(MByte)","LTE下行总流量(MByte)"];
                    break;
            }
            abbrs.forEach(function(item,index){
                that.echarts_abbrs.push("echarts_" + index);
                setTimeout(() => {
                    that.echartsMake(index,baseInfo["业务时间"],baseInfo[item],that.echartsAbbr(item));
                })
            })
            var ignoreAbbrs = ["_id","编号","recIndex","__ob__"].concat(abbrs);//不予显示的属性组
            var keys = Object.getOwnPropertyNames(baseInfo);
            keys.forEach(function(item){
                if (!Array.isArray(baseInfo[item])&&ignoreAbbrs.indexOf(item) ===-1) {
                    if (item === "geom") {
                        that.message.push("经度:" + baseInfo["geom"].coordinates[0]);
                        that.message.push("纬度:" + baseInfo["geom"].coordinates[1]);
                    } else {
                        that.message.push(item + ":" + baseInfo[item]);
                    }
                }
            })
            that.showTab = true;
        },
        setRectangleMsg (index) {
            var that = this;
            this.echarts_abbrs = [];//echarts绘图列表设为空
            var searchParams = this.$store.state.searchParams;
            var searchBox = this.$store.state.searchData.searchBox;
            var baseInfo = this.$store.state.searchData.baseInfo;
            var sum = { //统计栅格内所有基站信息
                num: 0,
                "业务时间": baseInfo[0]["业务时间"]
            }
            switch (searchParams.service) {
                case "all":
                    var abbrs = ["语音数据(分钟)","短信数据(条数)","LTE上行总流量(MByte)","LTE下行总流量(MByte)"];//获取所有应该展示的属性
                    break;
                case "voice":
                    var abbrs = ["语音数据(分钟)"];
                    break;
                case "note":
                    var abbrs = ["短信数据(条数)"];
                    break;
                case "all":
                    var abbrs = ["LTE上行总流量(MByte)","LTE下行总流量(MByte)"];
                    break;
            }
            var arr_tmp = [];
            for (var i=0,len=sum["业务时间"].length;i<len;i++) {
                arr_tmp.push(0);
            }
            abbrs.forEach(function(item,index){
                sum[item] = [].concat(arr_tmp);
                that.echarts_abbrs.push("echarts_" + index)
            })
            arr_tmp = null;
            for (var i=0,len=baseInfo.length;i<len;i++) {
                if (baseInfo[i].recIndex === index) {
                    sum.num++;
                    abbrs.forEach(function(item){
                        sum[item] = that.arrAdd(sum[item],baseInfo[i][item]);
                    })
                }
            }
            that.message = ["此栅格内共"+sum.num+"个台站"];
            abbrs.forEach(function(item,index){
                if (searchParams.isAverage) {
                    sum[item].forEach(function(it,index){
                        sum[item][index] = sum[item][index]/sum.num;
                    })
                }
                setTimeout(() => {
                    that.echartsMake(index,sum["业务时间"],sum[item],that.echartsAbbr(item));
                })
            })
            
            that.showTab = true;
        },
        arrAdd (arr1,arr2) {
            if(arr1.length != arr2.length) {
                alert('数组长度不相等');
                return;
            }
            var arrSum = arr1;
            for(var i=0,len=arr1.length;i<len;i++){
                arrSum[i] = arr1[i] + arr2[i];                                        
            }
            return arrSum;
        },
        echartsMake (index,xData,yData,abbr) {
            var el = document.querySelector(".echarts_" + index);
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(el);
            //指定图表的配置项
            //console.log(time);
            var option = {
                    title: {
                        text: abbr.title
                    },
                    tooltip: {
                        trigger: abbr.trigger
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    xAxis: {
                        name : abbr.xName,
                        type : 'category',
                        data: xData,
                        axisLabel: {
                            interval: 2,
                            rotate: -20
                        }
                    },
                    yAxis: {
                        type : 'value',
                        name: abbr.yName,
                        scale: true
                    },
                    series: [{
                        name: abbr.title,
                        type: abbr.type,
                        data: yData,
                        areaStyle: {normal: {}},
                        barMaxWidth: 40,
                    }],
                    grid: {
                        left: 50,
                        bottom: 100
                    }
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            
        },
        echartsAbbr (name) {
            var abbr = {
                title: "",
                trigger: "axis",
                xName: "时间(h)",
                yName: "",
                type: "bar"
            };
            var reg = /([^\(\)]+)/g;
            abbr.title = reg.exec(name)[1];//设置title
            var arr = reg.exec(name);
            var yName = arr?arr[1]:"";//设置yName
            switch (yName) {
                case "MByte":
                    abbr.yName = "流量(MByte)";
                    break;
                case "%":
                    abbr.yName = "百分比(%)";
                    break;
                default:
                    abbr.yName = yName;
                    break;
            }
            return abbr;
        }
    },
    beforeMount () {
        let that = this;
        $$EventBus.$on("showMsg",function(data){
            that.setMessage.call(that,data);
        });
        $$EventBus.$on("hideMsg",function(){
            that.showTab = false;
        });
    }
}