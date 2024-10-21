Component({
  properties: {
    backgroundColor:{
      type:String,
      value:''
    },
    color:{
      type:String,
      value:''
    },
    number:{
      type:Number,
      value:-1
    },
    name:{
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
