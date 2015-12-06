import Vue from 'vue';
import tpl from './formproject.html';
import {createproject} from '../../action/projectAction';
import store from '../../store';
export default Vue.component('form-project', {
    template: tpl,
    data() {
        return {
            pname:'',
            bugid:'',
            palias:''
        }
    },
    ready() {
         
    },
    methods: {
        save() {
            return createproject({
                name:this.pname,
                bugzillaid:this.bugid
            });
        },
        nextfn(nextstep, data) {
            var _name = store.getLoginUser().name;
            nextstep.$set('pid',data._id.toString());
            nextstep.$set('bname',new Date().Format('yyyyMMddhhmmss')+'_'+this.palias+'_'+_name+'_madebytool');
        }
    }
});