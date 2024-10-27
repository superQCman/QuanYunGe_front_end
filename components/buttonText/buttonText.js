// components/buttonText.js
Component({
  properties: {
    style:{
      type:String,
      value:''
    }
  },
  data: {
    loading:true
  },
  methods: {
    onImageLoad(){
      this.triggerEvent('loaded')
      this.setData({
        loading:false
      })
    }
  }
})
