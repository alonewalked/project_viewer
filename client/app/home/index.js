// home index

import './home.css';
import tpl from './home.html';
import '../directive/showMore';
import header from '../components/topheader';
import sidebar from '../components/sidebar';
import modal from '../components/modal';
import table from '../components/table';

import step from '../components/stepper';
import formproject from '../components/formproject';
import formbranch from '../components/formbranch';

import store from '../store';

export default {
    template:tpl,
    props:['serverconf'],
    components: {
        'top-header': header,
        'sidebar': sidebar,
        'data-table': table,
        'v-modal': modal
    },
    data() {
        return {
            regurl:'',
            data: {
                user: null,
                project:null
            },
            modal: {
                showModal:false,
                conHtml:null,
                conHeader:'',
                steps: {
                    'form-project':formproject,'form-branch':formbranch
                    }
                }
            } 
    },
    ready() {
        let me = this;
        this.$set('user',store.getLoginUser());
        store.getProject(d => me.$set('project',d.data)); 
    },
    methods: {
        pushMessage(cmd) {
            switch(cmd){
            case 'newProj':
                this.$set('modal.show',true);
                this.$set('modal.conHtml',step);
                this.$set('modal.conHeader','新建项目'); 
                break;
            }
        }
    },
    events: {
        'data-refresh' (){
            store.getProject(d => this.$set('project',d.data));
        }
    }
}