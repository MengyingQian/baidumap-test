<template>
    <div id="app">
        <task-header class="header"></task-header>
        <div class="pageBody">
            <router-view class="task"></router-view>
            <baidu-map class="allmap"></baidu-map>
            <tab-message class="tabMessage"></tab-message>
        </div>
        <task-footer class="footer"></task-footer>
    </div>
</template>

<script>
import taskHeader from './components/header/taskHeader.vue'
import taskFooter from './components/footer/taskFooter.vue'
import baiduMap from './components/baidu-map/baidu-map.vue'
import tabMessage from './components/tab-message/tab-message.vue'

export default {
    name: 'app',
    components: {
        'taskHeader': taskHeader,
        'task-footer': taskFooter,
        'baidu-map': baiduMap,
        'tabMessage':tabMessage
    }
}
</script>

<style scoped>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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

.tabMessage {
    position: absolute;
    right:0;
    top:120px;
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
