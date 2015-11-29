import Vue from 'vue';

let _doClick = function(e){
    var _t = $(e.currentTarget);
    var _obj = _t.data('shows');
    if(_obj){ 
        _t.toggleClass(_obj.arrCss);
        $(_obj.target).toggleClass(_obj.showCss);
    }
};
Vue.directive('show-more', {
    deep: true,
    bind () {
        console.log(this.vm);
        $(this.el).on('click', _doClick);
    },
    update (value) {
        $(this.el).data('shows',JSON.stringify(value));
    },
    unbind () {
        $(this.el).off('click', _doClick);
    }
});