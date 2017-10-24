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
	        <el-form-item label="最低频率">
	            <el-input v-model="formData.minFrequence" placeholder="请输入内容" class="short-input form-input">
	                <template slot="append">MHz</template>
	            </el-input>
	        </el-form-item>
	        <el-form-item label="最高频率">
	            <el-input v-model="formData.maxFrequence" placeholder="请输入内容" class="short-input form-input">
	                <template slot="append">MHz</template>
	            </el-input>
	        </el-form-item>
	        <el-form-item label="台站类型">
	            <el-select v-model="formData.corporation_inter" placeholder="请选择" class="short-input form-input">
	                <el-option label="中国移动" value="中国移动"></el-option>
	                <el-option label="中国联通" value="中国联通"></el-option>
	                <el-option label="中国电信" value="中国电信"></el-option>
	            </el-select>
	            <el-select v-model="formData.system_inter" placeholder="请选择" class="short-input form-input">
	                <el-option label="LTE" value="LTE"></el-option>
	                <el-option label="CDMA-2000" value="CDMA-2000"></el-option>
	                <el-option label="TD-SCDMA" value="TD-SCDMA"></el-option>
	                <el-option label="WCDMA" value="WCDMA"></el-option>
	                <el-option label="GSM" value="GSM"></el-option>
	            </el-select>
	        </el-form-item>
	        <el-button @click="search" class="search-button">查询</el-button>
	    </el-form>
	</div>
</template>

<script src="./interference.js"></script>
<style scoped>
	
</style>