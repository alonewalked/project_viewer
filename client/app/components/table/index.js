import tpl from './table.html';

export default {
    template: tpl,
    props:['lists'],
    attached() {
        this.table = this.$els.datatable; 
        this.unwatch = this.$watch('$data.lists', this.check, {deep: true});
    },
    data() {
        return {};
    },
    methods: {
        check: function(){
            if(this.lists.length === $(this.table).find('[data-item]').length){
                this.setup();
            }
        },
        setup: function(){
            $(this.table).DataTable();
        }
    }
};