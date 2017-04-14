var pageHead = {
	template:'\
			<div v-once>\
				<div id="banner">\
		            <h1 v-text="banner.name"></h1>\
		            <p v-text="setData"></p>\
			    </div>\
			    <ul id="nav">\
				    <li v-for="page in pages" :class="page.urlName">\
				    	<a :href="page.urlName" v-text="page.name"></a>\
				    </li>\
			    </ul>\
			 </div>',
	data:function(){
		return {
			banner:{
				name:"宽带无线通信业务评估分析与展示系统",
			},
			pages:[
			{name:"栅格展示",urlName:"map_rectangle"},
			{name:"资源利用率",urlName:"resource_rate"},
			{name:"覆盖分析",urlName:"hot_map"},
			{name:"网络布局",urlName:"network_layout"},
			{name:"干扰分析",urlName:"interference"},]
		}
	},
	computed:{
		setData:function(){
			return new Date().toLocaleDateString().replace(/\//g,"-");
		}
	}
}
var pageFoot = {
	template:"<p>{{content}}</p>",
	data:function(){
		return {
			content:"版权所有 © 2017 北京邮电大学",
		};
	}
}
var pointMessage_0 = {
	props:['point'],
	template:'\
			<div>\
				<p>站点经度：{{point.geom.coordinates[0]}}</p>\
				<p>站点纬度：{{point.geom.coordinates[1]}}</p>\
				<p v-for="prop in props">\
					{{prop}} : {{point[prop]}}\
				</p>\
			</div>',
	data:function(){
		return {
			props : ['运营商类型',"制式类型","Azimuth(度)","站高(m)","DownTilt(度)","载波频点(MHz)","基站发射功率(dBm)","共站情况"],

		}
	}
}
var pointMessage_1 = {
	template:'\
			<div>\
			\
			</div>'
}
var mapMessage = {
	props:['number'],
	template:'\
			<div>\
			<p>"依据属性共查询到" {{number}} "个台站"</p>\
			</div>',
}


var vuehead = new Vue({
	el:"#header",
	components:{
		"page-head":pageHead,
	}
})

var vuefoot = new Vue({
	el:"#footer",
	components:{
		"page-foot":pageFoot,
	}
})

/*var vueMessage = new Vue({
	el:"#searchMessage",
	data:{
		showType:mapMessage,
		points:[],
		point:{},

	}
	components:{
		"pointMessage_0" : pointMessage_0,
		"mapMessage" : mapMessage,
	},
})*/
