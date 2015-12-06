import './lib/date';
import Vue from 'vue';
import Router from 'vue-router';
import Login from './login';
import Home from './home'; 
import Root from './root'; 

Vue
.use(Router)

var router = new Router();

router.map({
    '/':{
        name:'root',
        component:Root,
        subRoutes:{
        '/login':{
            component: Login
        },
        '/home': {
            component: Home
        }
}
    }
});
router.redirect({
  // 重定向 /home
  '/': '/login'
});

let App = Vue.extend({});
router.start(App, '#app')