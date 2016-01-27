import tpl from './table.html';
import Vue from 'vue'; 
import ContextMenu from '../contextmenu';

export default Vue.component('data-table', { 
    template: tpl,
    props:{
        "lists": {
            type: Array,
            twoWay:true,
            default:[]
        },
        "serverconf":{
            type: Object,
            twoWay:true,
            default:{}
        }
    },
    components :[{
        "context-menu": ContextMenu
    }],
    created(){
    },
    attached() {
        this.table = this.$els.datatable;
        this.unwatch = this.$watch('$data.lists', this.check, {deep: true});
        this.$watch('serverconf', () => {
            this.$set('statuslist',this.serverconf['projectstatus']);
        });
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
            //$(this.table).DataTable();
        },
        clearup (){
            this.$set('checkedItem',{});
            this.$set('updating',false);
            this.$set('edittingitem',null);
            this.$set('selectIndex',-1);
            this.$set('contextshow',false);
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
            if(!this.edittingitem){
                $('body').off('keydown',this.saveEdit);
                return;
            }
            if(ev.which == 27){
                ev.preventDefault();
                this.$set('edittingitem',null);
                this.$set('updating',false);
                $('body').off('keydown',this.saveEdit);
                return;
            }
            if(!window.event.ctrlKey || !ev.keyCode==83){
                return;
            }
            if(!this.edittingitem){
                return;
            }
            if(ev.keyCode==83){
                ev.preventDefault();
                if(!this.updating){
                    this.$dispatch('on-upd-project',{
                        target:this,
                        data:this.edittingitem
                    })
                }
                this.$set('updating',true);
                $('body').off('keydown',this.saveEdit);
            }
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
            if(this.selectIndex === -1){
                return;
            }
            e.preventDefault();
            this.$broadcast('show-menu',{pos:{x:e.x,y:e.y},selectItem:this.lists[this.selectIndex]});
        }
    }
});