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
                if (baseInfo[i].recIndex === index) {
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
                                scale: true
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
        });
    }
}