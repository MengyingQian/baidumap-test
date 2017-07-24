<template>
    <div v-once>
        <div class="banner">
            <h1 v-text="banner.name"></h1>
            <p v-text="setData"></p>
        </div>
        <ul class="nav">
            <li v-for="(page,index) in pages" :class="[page.urlName,{'hasSelect': page.select}]" v-on:click="selectTag(index)">
                <router-link :to="page.urlName">{{page.name}}</router-link>
            </li>
        </ul>
    </div>
</template>
<script>
export default{
    data () {
        return {
            banner: {
                name:"宽带无线通信业务评估分析与展示系统",
            },
            pages: [
                {name:"栅格展示",urlName:"map-rectangle",select: true},
                {name:"资源利用率",urlName:"resource-rate",select: false},
                {name:"覆盖分析",urlName:"hot-map",select: false},
                {name:"网络布局",urlName:"network-layout",select: false},
                {name:"干扰分析",urlName:"interference",select: false}
            ]
        }
    },
    computed: {
        setData () {
            return new Date().toLocaleDateString().replace(/\//g,"-");
        }
    },
    methods: {
        selectTag (index) {
            this.pages.forEach(function(item){
                item.select = false;
            })
            this.pages[index].select = true;
            // console.log(index,this.pages[index].select)
        }
    }
}
</script>
<style scoped>
.banner{
    flex:1 0 auto;
    background: #293C55 none repeat;
    margin:0;
    padding:10px;
    height:auto;
    text-align:center;
}

.banner h1{
    text-align:center;
    display:inline-block;
    margin:10px;
    padding:0;
}

.banner p {
    text-align: right;
    display:inline-block;
    float: right;
    margin-top:40px;
    padding:0;
    font-family: arial,​tahoma,​宋体;
}

/*导航栏*/
.nav{
    flex:0;
    margin:0;
    padding: 0;
    height:45px;/*有高度不用另外设置BFC*/
    width: 100%;
    list-style-type: none;
    text-align:center;
    background-color:#D0E9FF;
}

.nav li {
    display:inline-block;
    float:left;
    font-weight: bold;
    margin:0;
    padding:0;
    width:150px;
    height:100%;
}

.nav li:hover {
    background-color: #8ECDFF;
    transition: 1s;
}

.nav li.hasSelect {
    background-color: #8ECDFF;
}

.nav li a {
    display:inline-block;
    text-decoration: none;
    text-align: center;
    padding:10px;
    color: #555353;
}
</style>