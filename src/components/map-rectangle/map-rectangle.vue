<template>
    <!-- 左侧菜单栏设置 -->
    <div class="leftMenu">
        <h2>台站筛选选项</h2>
        <div class="form">
            <p>
                <label>台站类型</label>
                <select class='corporation' v-model="formData.corporation">
                    <option value="中国移动">中国移动</option>
                    <option value="中国联通">中国联通</option>
                    <option value="中国电信">中国电信</option>
                </select>
                <select class='system' v-model="formData.system">
                    <option value="LTE">LTE</option>
                    <option value="CDMA-2000">CDMA-2000</option>
                    <option value="TD-SCDMA">TD-SCDMA</option>
                    <option value="WCDMA">WCDMA</option>
                    <option value="GSM">GSM</option>
                </select>
            </p>
            <p>
                <label>业务类型</label>
                <select class='service' v-model="formData.service">
                    <option value="all">全部</option>
                    <option value="voice">语音</option>
                    <option value="note">短信</option>
                    <option value="dataTraffic">分组域数据</option>
                </select>
            </p>
            <p>
                <label>开始时间</label>
                <input type="date" class="dl" v-model="formData.startDay" placeholder="2016/07/19"/>
                <input type="time" class="tl" v-model="formData.startTime" placeholder="00:00"/>
            </p>
            <p>
                <label>结束时间</label>
                <input type="date" class="dh" v-model="formData.endDay" placeholder="2016/07/19"/>
                <input type="time" class="th" v-model="formData.endTime" placeholder="05:00"/><br>
            </p>
            <p>
                <label>网格边长</label>
                <input type="number" class="sideLength" min="1" max="10" v-model="formData.sideLength" value="1"/>Km
            </p>
            <p>
                <label>各方格求平均</label>
                <input type="checkbox" class='average' v-model="formData.isAverage"/>
            </p>
            <input class="submit" type="submit"  value="确定"  />
        </div>
    </div>
</template>
<style scoped src="./map-rectangle.css"></style>
<script src="./map-rectangle.js"></script>