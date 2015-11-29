import Vue from 'vue';
import tpl from './header.html';

export default {
    template: tpl,
    props:{
        user:{
            type: Object
        }
    },
    data() {
        return {
        };
    }
};