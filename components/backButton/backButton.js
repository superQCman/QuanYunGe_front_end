import commonBehavior from "../../behavior/common"
const app=getApp()
Component({
  behaviors: [commonBehavior],
  properties: {
    style:{
      type:String,
      value:''
    },
    needTopBlock:{
      type:Boolean,
      value:true
    },
  },
  data: {
    backHeight:app.menuButtonHeightStyle
  },
  methods: {
    back(){
      this.triggerEvent('back')
    }
  }
})
