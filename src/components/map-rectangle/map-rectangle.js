import $$model from "../../script/model.js"
export default {
    data () {
        return {
            formData: {
                corporation: "",
                system: "",
                service: "",
                startDay: "",
                startTime: "00:00",
                endDay: "",
                endTime: "05:00",
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
        }
    },
    beforeMount () {
        // getdata('/aggregate',{system:'LTE',attr:'业务时间'})
        // .then(function(dbdata){
        //  Maxtime = dbdata.Maxtime;
        //  Mintime = dbdata.Mintime;
        // });
        var that = this;
        var day = new Date();
        that.formData.endDay = that.formatDate(day)
        that.formData.startDay = that.formatDate(day.setDate(day.getDate()-7));
        var params = {
            system:'LTE',
            attr:'业务时间'
        }
        $$model.aggregate(params,function(data){
            that.Maxtime = data.Maxtime;
            that.Mintime = data.Mintime;
        })
    }
}