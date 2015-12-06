// root index
import tpl from './root.html';
import store from '../store'; 

export default {
    template: tpl,
    data() {
	  return {
		  serverconf:{}
	  };
    },
    methods:{
        
    },
    ready() {
        let me = this;
        store.getServerConf(function(d){
            if(d.data){
                me.$set('serverconf',d.data);
            }
        });
    }
};