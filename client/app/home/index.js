// home index

import './home.css';
import tpl from './home.html';
import '../directive/showMore';
import header from '../components/topheader';
import sidebar from '../components/sidebar';
import table from '../components/table';

import store from '../store';

export default {
    template:tpl,
    components: {
        'top-header': header,
        'sidebar': sidebar,
        'data-table': table
    },
    data() {
        return {
            regurl:'',
            data: {
                user: null,
                project:null
            }
        }
    },
    ready() {
        let me = this;
        this.$set('user',store.getLoginUser());
        store.getProject(function(data){
            me.$set('project',data);
        }); 
    }
}