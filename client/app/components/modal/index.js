import Vue from 'vue';
import './modal.css';
import tpl from './modal.html'; 

export default {
    template: tpl,
    props:{
        shown: {
          type: Boolean,
          required: true,
          twoWay: true    
        },
        content: {
            type: Function
        },
        header: {
            type: String
        },
        elems: {
            type: Object
        },
        steps: {
            type: Object
        }
    },
    data() {
        return {
            contener: null
        };
    },
    attached() {
        this.contentElem = this.$els['content'];
    },
    watch: {
        'shown': function(val,oval){
            if(val===true && !this.$data.stepper){
                Vue.nextTick( () => { 
                    if(!this.content){
                        return;
                    } 
                    var _con = this.content;
                    this.$set('contenter', 
                    new _con({components:this.steps,data:{steps:this.steps}}));
                    this.contenter.$mount(this.contentElem.children[0]); 
                    this.$compile(this.contentElem);
                    this.contenter.$parent = this; 
                });
                
            }
      }  
    },
    methods: {
        close() {
            this.$set('shown',false); 
            this.$dispatch('data-refresh');
        }
    },
    events: {
        'step-finished'(){ 
            this.close();
            this.$dispatch('data-refresh');
        }
    }
};