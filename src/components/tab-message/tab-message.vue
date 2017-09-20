<template>
    <div class="tabMessage" v-show="showTab">
        <span class='shut' @click="shutTab"></span>
        <h2>台站信息展示</h2>
        <div class="tabs" :style="{width:tabsWidth}"> 
        <!-- 选项卡 -->
            <span class="tab-hearder" :class="{'tab-hearder-active': selectTab === 'message'}" @click="selectTab='message'">台站信息</span>
            <span class="tab-hearder" :class="{'tab-hearder-active': selectTab === 'statistics'}" @click="selectTab='statistics'">统计信息</span>
            <span class="tab-hearder" :class="{'tab-hearder-active': selectTab === 'others'}" @click="selectTab='others'">其他</span>

            <div class="tab-content message" v-show="selectTab === 'message'">{{message}}</div>
            <div class="tab-content statistics" v-show="selectTab === 'statistics'" ref="statistics">
                <div v-for="item in echarts_abbrs" :class="[item,'echarts']"></div>
            </div>
            <div class="tab-content others" v-show="selectTab === 'others'"></div>  
        </div>
    </div>
</template>

<script src="./tab-message.js"></script>

<style scoped>
.tabMessage {  
    max-height: 80%;
    padding-left:20px; 
    background-color:#F7F7F9; 
    border-top-left-radius: 5px;/*边角样式*/
    border-bottom-left-radius: 5px;
    display: block;
    overflow: hidden;
}

.shut {
    width:45px;
    height:18px;
    float:right;
    margin:5px;
    background:url(./images/close.png) no-repeat 0px 0px;
    transition: all 0.1s
}

.shut:hover {
    background:url(./images/close.png) no-repeat 0px -25px;
}

.tab-hearder {
    font-size: 16px;
    margin-right: 40px;
    color: #333;
    line-height: 40px;
    padding:5px;
    vertical-align: middle;
    cursor: pointer;
}

.tab-hearder-active {
    border-bottom: 2px solid #ee4433;
    color: #ee4433;
}

.tab-content {
    width:600px;
    height:500px;
    overflow-x:auto;/*横向拉条*/
    overflow-y: auto;/*纵向拉条*/
    word-break:keep-all;/*不换行*/
    white-space:nowrap;/*不换行*/
    display: block;
    background: #ECF0F1;
}

.tabs {
    transition: all 0.5s;
}

.message {
    padding: 10px;
    font-family: arial,​tahoma,​宋体;
    font-size: 16px;
}

.echarts {
    width: 550px;
    height: 500px;
    margin: 30px 0;
}

.tab-content::-webkit-scrollbar {
    display: none;
}
</style>