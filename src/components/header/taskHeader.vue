<template>
    <div>
        <div class="banner">
            <h1 v-text="name"></h1>
            <p v-text="setData"></p>
        </div>
        <div class="ul nav">
            <div v-for="(page,index) in pages" :class="['pageList',page.urlName,{'hasSelect': page.select}]" v-on:click="selectTag(index)">
                <router-link :to="page.urlName">{{page.name}}</router-link>
            </div>
        </div>
    </div>
</template>
<script>
export default{
    data () {
        return {
            name:"宽带无线通信业务评估分析与展示系统",
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
    // watch:{
    //     pages: {
    //         deep: true,
    //         handler () {
    //             console.log("change");
    //         }
    //     }
    // },
    methods: {
        selectTag (index) {
            // this.pages[index].select = true;
            // debugger;
            // return;
            for(var i = 0,len = this.pages.length;i < len; i++) {
                // this.$set(this.pages,i,{name:this.pages[i].name,urlName:this.pages[i].urlName,select:(i === index)});
                this.pages[i].select = (i === index);
            }
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
    text-align:center;
    background-color:#D0E9FF;
}

.nav .pageList {
    display:inline-block;
    float:left;
    font-weight: bold;
    margin:0;
    padding:0;
    width:150px;
    height:100%;
}

.nav .pageList:hover {
    background-color: #8ECDFF;
    transition: 1s;
}

.nav .hasSelect {
    background-color: #8ECDFF;
}

.nav .pageList a {
    display:inline-block;
    text-decoration: none;
    text-align: center;
    padding:10px;
    color: #555353;
}
</style>