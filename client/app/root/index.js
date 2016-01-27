// root index
import tpl from './root.html';
import store from '../store'; 

export default {
    template: tpl,
    data() {
	  return {
		  serverconf:{
            bugzilla:{}
          }
	  };
    },
    methods:{
    },
    ready() {
    },
    events: {
        'on-login'(){
            store.getServerConf( d =>{
                if(d.data){
                    this.$set('serverconf',d.data);
                }
            });
        }
    }
};