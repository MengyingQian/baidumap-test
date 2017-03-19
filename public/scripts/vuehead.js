Vue.component('pagehead',{
	template:'<div>\
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
})
var vue1=new Vue({
	el:"#header",
})