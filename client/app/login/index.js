// index
import './login.css';
import tpl from './login.html';
import Vue from 'vue';
import store from '../store';

export default {
    template: tpl,
    data() {
        return {
        };
    },
    route:{
        activate:function(transition){ 
            if(store.getLoginUser().username){
                transition.abort('has been logined');
                transition.redirect('/home');
            }
            else{
                transition.next()
            }
        }
    },
    methods: {
        login() {
            let router = this.$route.router;
            store.login(this.username,this.password).then(
                data =>{
                    console.log('logined');
                    router.go('home');
                }, 
                data =>{console.log(data)}
            );  
        }
    }
};