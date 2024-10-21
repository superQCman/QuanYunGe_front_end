import behavior from "../../behavior/common"
Component({
  behaviors: [behavior],
  ready(){
  },
  properties: {

  },
  data: {
    loadedCount:0
  },
  methods: {
    addLoadedCount(){
      const count=this.data.loadedCount+1
      this.setData({
        loadedCount:count
      })
    }
  }
})
