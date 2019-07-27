// components/like/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    like:{
      type:Boolean,
      value:true
    },
    count:{
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    myClick: function(e){
        console.log(e)
        // this.count
        // 激活
        let behavior = this.properties.like
        // 自定义事件： 名称，传递自己定义的属性， 第三个参数一般不使用
        this.triggerEvent('like',{},{})  
      }
    
  }
})
