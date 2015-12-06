import Vue from 'vue';
import tpl from './stepper.html';
export default Vue.extend({
  template: tpl,
  replace: false,
  data() {
    return {
        steps: null,
        stepkeys: null,
        stepitem: [],
        stepinited: false
    };
  },
  ready() {
    this.$set('stepkeys',Object.keys(this.steps)); 
  },
  attached() { 
    this.wrapper = this.$els['wrapper'];  
    this.content = this.$els.content;
    this.$set('stepitem',this.$children);
    this.unwatch = this.$watch('stepitem', this.check);
  },
  methods: {
    check() {
        if(this.stepitem.length === this.stepkeys.length){
            this.$set('stepinited',true);
            this.$nextTick( ()=> this.initstep() );
            this.unwatch();
        }
    },
    initstep() {
        $(this.wrapper).wizard({
            buttons:{cancel: false, help: false, prior: false},
            onNext: ((idx, wid) => {
                let _c = this.$children[idx-1];
                let _next = this.$children[idx]
                _c.save().then((d)=>{
                    if(_c.nextfn && _next){
                        _c.nextfn(_next,d.data);
                    }
                    wid.data('wizard').next()
                },(data)=>{
                    return false;
                });
            }),
            onFinish: (() => {
                this.$dispatch('step-finished');
            })
        });
    }
  }
});