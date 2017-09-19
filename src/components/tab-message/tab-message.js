import $$EventBus from "../../script/EventBus.js"

export default {
    data () {
        return {
            showTab: false
        }
    },
    watch: {},
    methods: {
        shutTab () {
            this.showTab = false;
        },
        setMessage (params) {
            var index = params.index;
            var type = params.type;
            var page = params.apge;
            switch (page) {
                case "mapRectangle":
                    if (type === "rectangle") {
                        setRectangleMsg(index,params.isAverage);
                    } else if(type === "point") {

                    }
                    break;
            }
        },
        setRectangleMsg (index) {
            var searchBox = this.$store.state.searchData.searchBox;
            var baseInfo = this.$store.state.searchData.baseInfo;
            var sum = { //统计栅格内所有基站信息
                num: 0,
                "业务时间": baseInfo[0]["业务时间"]
            }
            var abbrs = [];//获取所有应该展示的属性

            for(var key in baseInfo[0]){
                if(!Array.isArray(baseInfo[0][key])||key==="业务时间") continue;
                abbrs.push(key);
                sum[key] = [];
                //number[key] = data[0][key];
                //以上赋值为地址传递
                do{
                    sum[key].push(0);
                }while(sum[key].length<baseInfo[0][key].length);
            }
            for (var i=0,len=baseInfo.length;i<len;i++) {
                if (baseInfo[i].recIndex === index) {
                    sum.num++;
                    abbrs.forEach(function(item){
                        sum[item] = this.arrAdd(sum[item],baseInfo[i][item]);
                    })
                }
            }
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
        }
    },
    beforeMount () {
        let that = this;
        $$EventBus.$on("showMsg",function(data){
            that.setMessage.call(that,data)
        });
    }
}