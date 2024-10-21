Component({
  properties: {
    imgUrl:{
      type:String,
      value:''
    }
  },
  data: {

  },
  methods: {
    click(){
      this.triggerEvent('click')
    }

  }
})
