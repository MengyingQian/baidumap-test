import Vue from 'vue'
import VueRouter from 'vue-router'
import $$EventBus from "../script/EventBus.js"
import hotMap from '../components/hot-map/hot-map.vue'
import interference from '../components/interference/interference.vue'
import mapRectangle from '../components/map-rectangle/map-rectangle.vue'
import networkLayout from '../components/network-layout/network-layout.vue'
import resourceRate from '../components/resource-rate/resource-rate.vue'

Vue.use(VueRouter)

let routes = [
    {
        path: '/',
        redirect: '/map-rectangle'
    },
    {
        path: '/hot-map',
        component: hotMap,
        meta: {
            title: '覆盖分析'
        }
    },
    {
        path: '/interference',
        component: interference,
        meta: {
            title: '干扰分析'
        }
    },
    {
        path: '/map-rectangle',
        component: mapRectangle,
        meta: {
            title: '业务量分析'
        }
    },
    {
        path: '/network-layout',
        component: networkLayout,
        meta: {
            title: '网络布局'
        }
    },
    {
        path: '/resource-rate',
        component: resourceRate,
        meta: {
            title: '资源利用率'
        }
    },
]

const router = new VueRouter({
    mode:'history',
    routes
})

router.beforeEach((to,from,next)=>{
    document.title = to.meta.title;
    $$EventBus.$emit("clearOverlays");
    $$EventBus.$emit("hideMsg");
    next();
})

export default router;

