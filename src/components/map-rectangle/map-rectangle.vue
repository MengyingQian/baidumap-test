<template>
    <!-- 左侧菜单栏设置 -->
    <div class="leftMenu">
        <p class="selectTitle">台站筛选选项</p>
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