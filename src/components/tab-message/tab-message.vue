<template>
    <div class="tabMessage" v-if="showTab">
        <span class='shut' @click="shutTab"></span>
        <h2>台站信息展示</h2>
        <div class="tab"> 
        <!-- 选项卡 -->
            <h3 class="active">台站信息</h3>
            <h3>统计信息</h3>
            <h3>其他</h3>

            <div name="tag" class="content">台站信息</div>
            <div name="tag" class="content echarts">统计信息</div>
            <div name="tag" class="content">其他</div>  
        </div>
    </div>
</template>

<script src="./tab-message.js"></script>

<style scoped>
.tabMessage {  
    width: 300px;
    max-height: 80%;
    border-left: 1px solid #000000;
    border-bottom: 1px solid #000000;
    padding-left:20px; 
    background-color:#F7F7F9; 
    border-top-left-radius: 5px;/*边角样式*/
    border-bottom-left-radius: 5px;
    display: block;
    overflow: hidden;
}

.shut{
    width:45px;
    height:18px;
    float:right;
    margin:5px;
    background:url(./images/close.png) no-repeat 0px 0px;
    transition: all 0.5s
}
.shut:hover{
    background:url(./images/close.png) no-repeat 0px -25px;
}

</style>