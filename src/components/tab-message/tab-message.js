import $$EventBus from "../../script/EventBus.js"

export default {
    data () {
        return {
            showTab: false,
            selectTab: "message",
            echarts_abbrs: [],//将要绘制echarts的属性
            message: [],//台站信息页展示内容
            hasEcharts: false,
            colorTableShow: false,//色块是否显示
            colorTable: [
                {
                    color: "#ED2D2D",
                    text: "0.0-0.1"
                },
                {
                    color: "#FF49A3",
                    text: "0.1-0.2"
                },
                {
                    color: "#F79F27",
                    text: "0.2-0.3"
                },
                {
                    color: "#E1E51A",
                    text: "0.3-0.4"
                },
                {
                    color: "#37FF1D",
                    text: "0.4-0.5"
                },
                {
                    color: "#269022",
                    text: "0.5-0.6"
                },
                {
                    color: "#38E2DB",
                    text: "0.6-0.7"
                },
                {
                    color: "#792F1D",
                    text: "0.7-0.8"
                },
                {
                    color: "#9A1CD9",
                    text: "0.8-0.9"
                },
                {
                    color: "#9A7A7A",
                    text: "0.9-1.0"
                }
            ],
            interNum: 0
        }
    },
    computed: {
        tabsWidth () {
            return (this.selectTab === "statistics" && this.hasEcharts)? "600px":"400px";
        }
    },
    watch: {},
    methods: {
        shutTab () {
            this.showTab = false;
            $$EventBus.$emit("clearSelect");
        },
        setMessage (params) {
            var data = params.data;
            var type = params.type;
            var page = params.page;
            switch (page) {
                case "mapRectangle":
                    if (type === "rectangle") {
                        this.setRectangleMsg(data);
                    } else if(type === "point") {
                        this.setPointMsg(data);
                    }
                    break;
                case "coverage":
                    this.setHotMapMsg(data);
                    break;
                case "interference":
                    this.setInterferenceMsg(data);
                    break;
                case "resourceRate":
                    this.setResourceRateMsg(data);
                    break;
                case "networkLayout":
                    this.setNetworkLayoutMsg(data);
                    break;
                default:
                    break;
            }
        },
        setNetworkLayoutMsg (index) {
            var that = this;
            var baseInfo = that.$store.state.searchData.baseInfo[index];
            that.message = [];
            var keys = Object.getOwnPropertyNames(baseInfo);
            var ignoreAbbrs = ["_id","编号","rePoints","__ob__","小区半径","基站布局","基站站高","rePoints"].concat(this.echarts_abbrs);//不予显示的属性组
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
        setResourceRateMsg (index) {
            var that = this;
            this.echarts_abbrs = [];//echarts绘图列表设为空
            var searchParams = this.$store.state.searchParams;
            var baseInfo = this.$store.state.searchData.baseInfo[index];
            this.message = [];
            this.echarts_abbrs = ['LTE_无线利用率(新)(%)','LTE_上行PRB平均利用率(新)(%)','LTE_下行PRB平均利用率(新)(%)'];
            this.echartsMake(this.echarts_abbrs,baseInfo);//绘制echarts图
            var ignoreAbbrs = ["_id","编号",'LTE_无线利用率相关性()','LTE_上行PRB平均利用率相关性()','LTE_下行PRB平均利用率相关性()',"__ob__"].concat(this.echarts_abbrs);//不予显示的属性组
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
        setInterferenceMsg (index) {
            var that = this;
            var baseInfo = that.$store.state.searchData.baseInfo[index];
            that.message = [];
            var keys = Object.getOwnPropertyNames(baseInfo);
            var ignoreAbbrs = ["_id","编号","rePoints","__ob__","干扰系数"].concat(this.echarts_abbrs);//不予显示的属性组
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
            this.interNum = baseInfo["干扰系数"];
            this.colorTableShow = true;
            that.showTab = true;
        },
        setPointMsg (index) {
            var that = this;
            this.echarts_abbrs = [];//echarts绘图列表设为空
            var searchParams = this.$store.state.searchParams;
            var baseInfo = this.$store.state.searchData.baseInfo[index];
            this.message = [];
            switch (searchParams.service) {
                case "all":
                    this.echarts_abbrs = ["语音数据(分钟)","短信数据(条数)","LTE上行总流量(MByte)","LTE下行总流量(MByte)"];//获取所有应该展示的属性
                    break;
                case "voice":
                    this.echarts_abbrs = ["语音数据(分钟)"];
                    break;
                case "note":
                    this.echarts_abbrs = ["短信数据(条数)"];
                    break;
                case "all":
                    this.echarts_abbrs = ["LTE上行总流量(MByte)","LTE下行总流量(MByte)"];
                    break;
            }
            this.echartsMake(this.echarts_abbrs,baseInfo);//绘制echarts图
            var ignoreAbbrs = ["_id","编号","recIndex","__ob__"].concat(this.echarts_abbrs);//不予显示的属性组
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
            var startLng = searchBox[index][0];
            var startLat = searchBox[index][1];
            var endLng = searchBox[index][2];
            var endLat = searchBox[index][3];
            var sum = { //统计栅格内所有基站信息
                num: 0,
                "业务时间": baseInfo[0]["业务时间"]
            }
            switch (searchParams.service) {
                case "all":
                    this.echarts_abbrs = ["语音数据(分钟)","短信数据(条数)","LTE上行总流量(MByte)","LTE下行总流量(MByte)"];//获取所有应该展示的属性
                    break;
                case "voice":
                    this.echarts_abbrs = ["语音数据(分钟)"];
                    break;
                case "note":
                    this.echarts_abbrs = ["短信数据(条数)"];
                    break;
                case "all":
                    this.echarts_abbrs = ["LTE上行总流量(MByte)","LTE下行总流量(MByte)"];
                    break;
            }
            for (var i=0,len=baseInfo.length;i<len;i++) {
                var lng = baseInfo[i]["geom"].coordinates[0];
                var lat = baseInfo[i]["geom"].coordinates[1];
                if (lng >= startLng && lng < endLng && lat >= startLat && lat < endLat) {
                // if (index === baseInfo[i].recIndex) {
                    sum.num++;
                    this.echarts_abbrs.forEach(function(item){
                        sum[item] = [];
                        sum[item] = that.arrAdd(sum[item],baseInfo[i][item]);
                    })
                }
            }
            this.message = ["此栅格内共"+sum.num+"个台站"];
            if (searchParams.isAverage) {
                this.echarts_abbrs.forEach(function(item,index){
                    sum[item].forEach(function(it,index){
                        sum[item][index] = sum[item][index]/sum.num;
                    })
                    
                })
            }
            this.echartsMake(this.echarts_abbrs,sum);//绘制echarts图

            this.showTab = true;
        },
        setHotMapMsg (params) {
            this.message = ["测量点"];
            this.message.push("经度:" + params.lng);
            this.message.push("纬度:" + params.lat);
            this.message.push("接收功率:" + params.count);
            this.showTab = true;
        },
        arrAdd (arr1,arr2) {
            var len1 = arr1.length;
            var len2 = arr2.length;
            var arrSum = [];
            var i = 0;
            while (i<len1 || i<len2) {
                arrSum[i] = (arr1[i]?arr1[i]:0) + (arr2[i]?arr2[i]:0);
                i++;
            }
            return arrSum;
        },
        echartsMake (abbrs,data) {
            var that = this;
            this.hasEcharts = true;
            setTimeout(function(){
                abbrs.forEach(function(item,index){
                    var el = document.querySelector(".echarts_" + index);
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = that.$echarts.init(el);
                    //指定图表的配置项
                    var abbr = {
                        title: "",
                        trigger: "axis",
                        xName: "时间(h)",
                        yName: "",
                        type: "bar"
                    };
                    var reg = /([^\(\)]+)/g;
                    abbr.title = reg.exec(item)[1];//设置title
                    var arr = reg.exec(item);
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
                                data: data["业务时间"],
                                axisLabel: {
                                    interval: 2,
                                    rotate: -20
                                }
                            },
                            yAxis: {
                                type : 'value',
                                name: abbr.yName,
                                scale: false
                            },
                            series: [{
                                name: abbr.title,
                                type: abbr.type,
                                data: data[item],
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
                })
            })
        }
    },
    beforeMount () {
        let that = this;
        $$EventBus.$on("showMsg",function(data){
            that.setMessage.call(that,data);
        });
        $$EventBus.$on("hideMsg",function(){
            that.showTab = false;
            that.hasEcharts = false;
            that.colorTableShow = false;
            that.message = [];
            that.echarts_abbrs = [];
        });
    }
}