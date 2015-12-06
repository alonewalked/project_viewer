import Vue from 'vue';
import tpl from './formbranch.html';
import {createbranch} from '../../action/projectAction';

export default Vue.component('form-branch', {
    template: tpl,
    data() {
        return {
            bname:'',
            ptype:'',
            pid:'',
            ptypes:[{value:'1',text:'qiyiV2'},{value:'2',text:'pingback'},{ value:'3',text:'lib'},{value:'4',text:'qiyistore'}]
        }
    },
    methods: {
        save() {
            return createbranch({
                name:this.bname,
                projectids:this.pid,
                projectcategory:this.ptype
            });
        } 
    }
});