import tpl from './contextmenu.html';
import Vue from 'vue'; 
export default Vue.component('context-menu', {
    template: tpl,
    props: {
        "viewMenu": {
            type: Boolean,
            twoWay: true,
            required: true
        }
    },
    data() {
        return { 
            "top": '0px',
            "left": '0px'
        };
    },
    attached() {
        this.contentWrap = this.$els['content'];
        $('body').on('click', e=>{
            e.preventDefault();
            let t = e.target || e.currentTarget;
            let ischild = $(t).closest(this.contentWrap).length>0;
            
            if(t!==this.contentWrap && !ischild){
                this.closeMenu();
            } 
        })
    },
    methods: {
        setMenu(top, left) { 
            let largestHeight = window.innerHeight - this.contentWrap.offsetHeight - 25;
            let largestWidth = window.innerWidth - this.contentWrap.offsetWidth - 25;

            if (top > largestHeight) top = largestHeight;

            if (left > largestWidth) left = largestWidth;

            this.$set('top',top + 'px');
            this.$set('left', left + 'px');
        }, 
        closeMenu() {
            this.$set('viewMenu', false);
        }, 
        openMenu(pos) {
            this.viewMenu = true; 
            Vue.nextTick(function() {  
                this.setMenu(pos.y, pos.x)
            }.bind(this));
        },
        selectItem(idx) { 
        }
    },
    events: {
        "show-menu" (pos){
            this.contentWrap.focus();
            this.openMenu(pos);
        }
    }
}); 