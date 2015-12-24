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
import {render} from '../lib/utils';

export default {
    template:tpl,
    props:{
        'serverconf':{
            type:Object,
            twoWay:true
        }
    },
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
                    'form-project':formproject,
                    'form-branch':formbranch 
                    }
                }
            }

    },
    created() {
        let me = this;
        this.$set('user',store.getLoginUser());
        this.refreshData(); 
    },
    methods: {
        getTableChild() {
            /*var _chd = this.$children.filter(function(item){
                return (item instanceof table) 
            });
            return _chd?_chd[0]:null;*/  
            return this.$refs.datatable;
        },
        refreshData() {
            store.getProject(d => this.$set('project',d.data));
        },
        pushMessage(cmd) {
            switch(cmd){
            case 'newProj':
                this.$set('modal.show',true);
                this.$set('modal.conHtml',step);
                this.$set('modal.conHeader','新建项目'); 
                break;
            case 'weekly':
                this.sendWeekly();
                break;
            case 'refresh':
                this.refreshData();
            }
        },
        createBranch(pid){
            this.$set('modal.steps',{
                'form-branch':formbranch
            });
            this.$set('modal.show',true);
            this.$set('modal.conHtml',step);
            this.$set('modal.conHeader','新建项目');
            this.$once('step-inited',(data)=>{
                if(data.sub2comp && data.sub2comp.length){
                    data.sub2comp[0].$set('pid',pid);
                    data.sub2comp[0].$set('bname',new Date().Format('yyyyMMddhhmmss')+'_()_'+this.user.name+'_madebytool');
                }
            });
        },
        sendWeekly(){
            let _chd = this.getTableChild();
            if(!_chd){
                return;
            }
            let _items = _chd.$get('checkedItem');
            let _html = '';
            for (let key of Object.keys(_items)) {
                let _tmp = _items[key];
                let _st = this.serverconf['projectstatus'].filter(function(item){
                    return item.id==_tmp.status
                });
                _st = _st[0] || {id:2,name:'开发中'};
                let _str = render('',_tmp.name.split(' ')[0]
                    ,_tmp.name,_st.name,(_tmp.bugzillaid||''));
                _html+=_str;
            }
            store.sendWeekly(_html).then(
            function(d){
                console.log(d);
            },function(d){
                console.log(d);
            });
        }
    },
    events: {
        'data-refresh' (){
            store.getProject(d => this.$set('project',d.data));
        },
        'on-new-branch'(data){
            data = data || {}
            if(data.id){
                this.createBranch(data.id );
            } 
        },
        'on-upd-project'(e){
            e = e || {};
            let _id = e.data._id.toString();
            let _doc = {
                    "bugzillaid":e.data.bugzillaid,
                    "status":e.data.status,
                    "name":e.data.name
                };
            store.updateProject({
                "id":_id,
                "doc":JSON.stringify(_doc)
            }).then( d1=> {
                // upd success
                let _chd = this.getTableChild();
                _chd.$set('edittingitem',null);
                _chd.$set('updating',false); 
            },err=>{
                console.log(err)
            });
        }
    }
}