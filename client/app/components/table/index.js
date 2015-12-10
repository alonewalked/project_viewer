import tpl from './table.html';
import Vue from 'vue';

export default Vue.component('data-table', { 
    template: tpl,
    props:['lists'],
    attached() {
        this.table = this.$els.datatable; 
        this.unwatch = this.$watch('$data.lists', this.check, {deep: true});
    },
    data() {
        return {
            checkedItem:{}
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
        }
    }
});