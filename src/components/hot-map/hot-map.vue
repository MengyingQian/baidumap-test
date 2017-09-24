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
            <!-- 测量间距可以默认，此处注释 -->
            <el-form-item label="基站覆盖半径">
                <el-input v-model="formData.maxDistance" placeholder="请输入内容" class="short-input form-input">
                    <template slot="append">米</template>
                </el-input>
            </el-form-item>
            <el-button @click="search" class="search-button">查询</el-button>
        </el-form>
    </div>

</template>

<script src="./hot-map.js"></script>
<style scoped>
/*左侧菜单*/
.leftMenu{
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #F7F7F9;
    flex:0 0 340px;
    overflow: hidden;
    white-space:nowrap;/*不换行*/
    height: 30px;
    transition: height 0.3s;
    padding: 10px;
}

.leftMenu:hover {
    height: 400px;
}

.selectTitle {
    font-size: 20px;
    font-weight: 800;
    margin: 0px 30px 20px;
}

.leftMenu .form{
    margin:20px 0 0 5px;
    text-align: left;
}

.leftMenu .form label{
    display:inline-block;
    width:100px;
    text-align:right;
    margin-right:5px;
    font-family: Microsoft YaHei,Tahoma,Verdana,Arial,Helvetica,sans-serif;
    font-size:14px;
}

.short-input {
    width: 120px;
}

.form-input {
    float: left;
}

.search-button {
    float: right;
    margin-right: 50px;
}
</style>
