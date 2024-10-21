// components/logo/logo.js
Component({
  properties: {
    style:{
      type:String,
      value:''
    }
  },
  data: {

  },
  methods: {
    onImageLoad(){
      this.triggerEvent('loaded')
    }
  }
})
