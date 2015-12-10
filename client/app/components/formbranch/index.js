import Vue from 'vue';
import tpl from './formbranch.html';
import {createbranch} from '../../action/projectAction';

export default Vue.component('form-branch', {
    template: tpl,
    data() {
        return {
            bname:'',
            ptype:'',
            atype:'',
            pid:'',
            ptypes:[{value:'1',text:'qiyiV2'},{value:'2',text:'pingback'},{ value:'3',text:'lib'},{value:'4',text:'qiyistore'}],
            atypes:[{value:'1',text:'创建svn'},{value:'2',text:'不下载代码'},{ value:'3',text:'只下载代码'}]
        }
    },
    methods: {
        save() {
            return createbranch({
                name:this.bname,
                projectids:this.pid,
                projectcategory:this.ptype,
                type:this.atype
            });
        } 
    }
});