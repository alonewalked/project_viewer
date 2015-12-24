import tpl from './table.html';
import Vue from 'vue'; 
import ContextMenu from '../contextmenu';

export default Vue.component('data-table', { 
    template: tpl,
    props:['lists','serverconf'],
    components :[{
        "context-menu": ContextMenu
    }],
    created(){
        this.$set('statuslist',this.serverconf['projectstatus']);
    },
    attached() {
        this.table = this.$els.datatable; 
        this.unwatch = this.$watch('$data.lists', this.check, {deep: true});
    },
    data() {
        return {
            checkedItem:{},
            updating:false,
            statuslist:null,
            edittingitem:null,
            selectIndex:-1,
            contextshow: false
        };
    },
    methods: {
        check(){
            if(this.lists.length === $(this.table).find('[data-item]').length){
                this.setup();
            }
        },
        setup (){
            $(this.table).DataTable();
        },
        onNewBranch (id){
            this.$dispatch('on-new-branch',{
                subcomp: this,
                id:id.toString()
            });
        },
        onItemClick(ev, idx, obj) {
            var target = ev.currentTarget;
            if(target.checked){
                this.checkedItem[idx] = obj;
            }
            else{
                delete this.checkedItem[idx];
            }
        },
        editCell(idx,obj,cellname){
            this.$set('edittingitem',obj);
            $('body').on('keydown',this.saveEdit);
            
        },
        saveEdit(ev){
            if(!window.event.ctrlKey || !ev.keyCode==83){
                return;
            }
            if(!this.edittingitem){
                return;
            }
            ev.preventDefault(); 
            if(!this.updating){
                this.$dispatch('on-upd-project',{
                    target:this,
                    data:this.edittingitem
                })
            }
            this.$set('updating',true);
        },
        stateRender(node) { 
            let _atrr = this.statuslist.filter((item)=>{
                return item.id === node.status
            });
            return _atrr[0]['name'] || '';
        },
        selectRow(idx) {
            this.$set('selectIndex',idx);
        },        
        openMenu(e) { 
            e.preventDefault();
            this.$broadcast('show-menu',{x:e.x,y:e.y});
        }
    }
});