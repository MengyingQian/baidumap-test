<template>
    <!-- 左侧菜单栏设置 -->
    <div id="leftMenu">
        <h2>台站筛选选项</h2>

         <div id="form">
          <p>
            <label>台站类型</label>
            <select id='corporation' >
              <option value="中国移动">中国移动</option>
              <option value="中国联通">中国联通</option>
              <option value="中国电信">中国电信</option>
            </select>
            <select id='system' >
              <option value="LTE">LTE</option>
              <option value="CDMA-2000">CDMA-2000</option>
              <option value="TD-SCDMA">TD-SCDMA</option>
              <option value="WCDMA">WCDMA</option>
              <option value="GSM">GSM</option>
            </select>
          </p>
          <input id="submit" type="submit"  value="确定"  />
        </div>
    </div>
</template>