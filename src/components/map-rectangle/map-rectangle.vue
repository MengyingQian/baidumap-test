<template>
    <!-- 左侧菜单栏设置 -->
    <div class="leftMenu">
        <p class="selectTitle">台站筛选选项</p>
            <!-- <p>
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
            </p> -->
            <!-- <p>
                <label>开始时间</label>
                <input type="date" class="dl" v-model="formData.startDay"/>
                <input type="time" class="tl" v-model="formData.startTime"/>
            </p>
            <p>
                <label>结束时间</label>
                <input type="date" class="dh" v-model="formData.endDay"/>
                <input type="time" class="th" v-model="formData.endTime"/><br>
            </p> -->
            <!-- <p>
                <label>网格边长</label>
                <input type="number" class="sideLength" min="1" max="10" v-model="formData.sideLength"/>Km
            </p>
            <p>
                <label>各方格求平均</label>
                <input type="checkbox" class='average' v-model="formData.isAverage"/>
            </p>
            <button @click="search">确定</button> -->
        <el-form ref="form" :model="formData" label-width="100px">
            <el-form-item label="台站类型">
                <el-select v-model="formData.corporation" placeholder="请选择" class="short-input form-input">
                    <el-option label="中国移动" value="中国移动"></el-option>
                    <el-option label="中国联通" value="中国联通"></el-option>
                    <el-option label="中国电信" value="中国电信"></el-option>
                </el-select>
                <el-select v-model="formData.system" placeholder="请选择" class="short-input form-input">
                    <el-option label="LTE" value="LTE"></el-option>
                    <el-option label="CDMA-2000" value="CDMA-2000"></el-option>
                    <el-option label="TD-SCDMA" value="TD-SCDMA"></el-option>
                    <el-option label="WCDMA" value="WCDMA"></el-option>
                    <el-option label="GSM" value="GSM"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="业务类型">
                <el-select v-model="formData.service" placeholder="请选择" class="short-input form-input">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="语音" value="voice"></el-option>
                    <el-option label="短信" value="note"></el-option>
                    <el-option label="分组域数据" value="dataTraffic"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
                <el-date-picker
                      v-model="formData.dateRange"
                      type="datetimerange"
                      placeholder="选择时间范围"
                      style="width:200px" class=" form-input">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="网格边长">
                <el-input v-model="formData.sideLength" placeholder="请输入内容" min="1" max="10" class="short-input form-input">
                    <template slot="append">Km</template>
                </el-input>
            </el-form-item>
            <el-form-item label="各方格求平均">
                <el-checkbox v-model="formData.isAverage" checked class="form-input">各方格求平均</el-checkbox>
            </el-form-item>
            <el-button @click="search" class="search-button">查询</el-button>
        </el-form>
    </div>
</template>
<style scoped src="./map-rectangle.css"></style>
<script src="./map-rectangle.js"></script>