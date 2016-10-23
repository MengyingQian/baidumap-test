
var query = require('./querySet');

var data = [{
    "运营商类型" : "中国移动",
    "制式类型" : "LTE",
    "业务时间" : "2016/07/19 00:00-2016/07/19 01:00",
    "geom" : {
        "type" : "Point",
        "coordinates" : [ 
            107.032098, 
            26.860678
        ]
    },
    "Azimuth(度)" : 310,
    "站高(m)" : 25,
    "DownTilt(下倾角/度)" : 6,
    "载波频点(MHz)" : 1222,
    "基站发射功率(dBm)" : 46
},
{
    "运营商类型" : "中国移动",
    "制式类型" : "LTE",
    "业务时间" : "2016/07/19 22:00-2016/07/19 23:00",
    "geom" : {
        "type" : "Point",
        "coordinates" : [ 
            106.66095, 
            26.987616
        ]
    },
    "Azimuth(度)" : 0,
    "站高(m)" : 20,
    "DownTilt(下倾角/度)" : 6,
    "载波频点(MHz)" : 1293,
    "基站发射功率(dBm)" : 46
},
{
    "运营商类型" : "中国移动",
    "制式类型" : "LTE",
    "业务时间" : "2016/07/19 22:00-2016/07/19 23:00",
    "geom" : {
        "type" : "Point",
        "coordinates" : [ 
            106.66095, 
            26.987616
        ]
    },
    "Azimuth(度)" : 0,
    "站高(m)" : 20,
    "DownTilt(下倾角/度)" : 6,
    "载波频点(MHz)" : 1293,
    "基站发射功率(dBm)" : 46
}];
var condition = {
	"运营商类型" : "中国移动",
    "制式类型" : "LTE"
};

query.NIBS(data,[],condition,0,null)
.then(function(data){console.log(data);});