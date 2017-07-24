<template>
    <div id="app">
        <task-header class="header"></task-header>
        <div class="pageBody">
            <router-view class="task"></router-view>
            <baidu-map class="allmap"></baidu-map>
        </div>
        <!-- <task-footer class="footer"></task-footer> -->
    </div>
</template>

<script>
import header from './components/header/header.vue'
import footer from './components/footer/footer.vue'
import baiduMap from './components/baidu-map/baidu-map.vue'

export default {
    name: 'app',
    components: {
        'task-header': header,
        'task-footer': footer,
        'baiduMap': baiduMap
    }
}
</script>

<style scoped>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: relative;
}

/*页首样式*/
.header {
    display: flex;
    flex-direction: column;
    flex: 0 0 139px;
    color: #FFFFFF;
    padding: 0;
}

.pageBody {
    display: flex;
    flex: 1 0 auto;
    position: relative;
}

.task {
    flex: 0 0 340px;
}

.allmap {
    flex: 1 0 auto;
}

/*页脚样式*/
.footer {
    flex:0 0 40px;
    background: #0b5ea5 none repeat;
    color: #FFFFFF;
    text-align:center;
    width:100%;
    font-size: 12px;
    min-height: 10px;
}
</style>
