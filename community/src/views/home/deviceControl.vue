<template>
  <div style="margin-left: 0%;border: white solid;background-color: white;height: auto; border-radius: 10px;width: 100%;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);"><br/>
    <div style="width: auto;margin-left: 0%">
      <el-form ref="form" label-width="50px" v-show="planeFlag" name="first">
        <el-form-item >
<!--          <a style=" margin-top: 0.6%;width: 80px;margin-left: 2%">刷新频率</a>-->
<!--          <el-select  v-model="value1" placeholder="刷新频率选择" style="margin-left: 0%"  @change="getvalue" clearable>-->
<!--            <el-option-->
<!--              v-for="item in freshFre"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--          <el-button size="small" style="margin-left: 2%" type="primary" @click="TimeClick" >设置刷新频率</el-button>-->
          <div style="text-align: center" > <el-button size="small"  type="primary" @click="queryAllsystem" >查看全部设备</el-button></div>
        </el-form-item>
      </el-form>

      <el-form ref="form" label-width="50px" v-show="!planeFlag" name="third">
        <el-form-item >
          <el-date-picker
            v-model="no_change_startTime"
            type="datetime"
            placeholder="选择开始日期和时间"
            @change="setTime">
          </el-date-picker>
          <el-date-picker
            v-model="no_change_endTime"
            type="datetime"
            placeholder="选择结束日期和时间" @change="setTime1">
          </el-date-picker>
          <el-button style="margin-left: 3%" type="primary" @click="Real_time_query" size="small">实时查询</el-button>

          <el-select  v-model="value1" placeholder="刷新频率选择" style="margin-left: 4%"  @change="getvalue" clearable>
            <el-option
              v-for="item in freshFre"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button size="small" style="margin-left: 5%" type="primary" @click="TimeClick" >设置刷新频率</el-button>
<!--          <el-button v-if="isShow" size="small" style="margin-left: 5%" type="primary" @click="TimeClick" >1235348576</el-button>-->
          <el-input v-model="orderId" placeholder="请输入通道数"></el-input>
        </el-form-item>


        <div style="text-align: center">
          <el-button size="small"  type="primary" @click="queryAllsystem" >查看全部设备</el-button>
        </div>

      </el-form>

      <div>
        <el-tabs v-model="activeName"  >
          <el-tab-pane v-show="planeFlag" label="监控" name="first"  >
            <el-card   class="elCardType" style="overflow: auto;background-color: #EEF8FF">
              <div class="cardHeard">
                <div class="titleName">
                  <el-button  type="text" class="lookDetails">
                    <!--查看详情-->
                  </el-button>
                </div>
              </div>
<!--              /*生成箱子*/-->
              <div v-for ="item in serviceOptions" style="float: left;margin-left: 2%"
              :key="item.sensorIp"
              :label="item.caseName"
              :value="item.sensorIp">
                <div class="fridge" >
                  <button class="chanxun" @click="InterAllquery(item.sensorIp,item.sensorTypeId)">详细信息</button>
                  <div class="name">{{item.caseName}}</div>
                  <div class="data1" >pv1:{{1}}</div>
                  <div class="data2">pv2:{{2}}</div>
                  <div class="data3">pv3:{{3}}</div>
                </div>
              </div>
            </el-card>
          </el-tab-pane>

          <el-tab-pane  name="third"  >
            <el-card v-show="!planeFlag"  class="elCardType" style="overflow: auto;background-color: #EEF8FF" >
              <div   class="cardHeard">
                <div class="titleName">
                  <el-button   type="text" class="lookDetails">
                    <!--查看详情-->
                  </el-button>
                </div>
              </div>
<!--              echarts-->
              <div id="elCard5">
                <div id="echart5" style="width: 100%;height: 300px" ref="myEchart5"></div>
              </div>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import api from '../../api'
  export default {

    name: 'deviceControl',
    data () {
      return {
        hhhh:'',
        isShow: false,
        valuesensorIp:'',
        planeFlag: true,
        chart: null,
        activeName: 'first',
        value1: '',
        no_change_startTime:'',
        no_change_endTime:'',
        no_change_startTime1:'',
        no_change_endTime1:'',
        value: '',
        orderId:'',
        StartShow1: {
          sensorIp: '',
          currentPage: 1,
          rows: 20,
          startTime:'',
          endTime:''
        },
        key:false,
        recive: [],
        recivename: [],
        ChangeShow: {
          sensorIp: '',
          currentPage: 1,
          rows: 20,
          startTime:null,
          endTime:null,
          orderId:''
        },
        time:'',
        getcasename: {
          sensorIp: ''
        },
        serviceOptions: [],
        freshFre: [
          {label: '10秒钟', value: '10000'},
          {label: '5分钟', value: '300000'},
          {label: '10分钟', value: '600000'},
          {label: '15分钟', value: '900000'},
          {label: '20分钟', value: '120000'}
        ],
        t1:null,
        t2:null,
        chartList: [],
        sensorIp:null,
        chartchange:'',
        echartsX:[],
        sensorTypeId:0

    }
    },
    created () {
      this.getSystemConfigInfo()
    },
    mounted () {
    },
    beforeMount(){
      this.getSystemConfigInfo()//得到设备下拉框内容

    },
    methods: {
      TimeClick() //设置刷新频率按钮触发事件
      {
        if (this.value != null && this.value != '')
        {
          window.clearInterval(this.t2);
          this.t1 = window.setInterval(this.ChangeView,this.time);
        }
        else
        {
          window.clearInterval(this.t1);
          this.t2 = window.setInterval(this.BackViews,this.time);
        }
      },
      setTime()
      {
        this.ChangeShow.startTime = null
        this.no_change_startTime1=this.no_change_startTime
        //this.no_change_startTime=this.no_change_startTime

        console.log("0000000")

      },
      setTime1()
      {
        this.ChangeShow.endTime = null
          this.no_change_endTime1=this.no_change_endTime

       // this.no_change_endTime=this.no_change_endTime
        console.log("262652424242")

      },
      times_format(startTime, endTime) {
        const date_str = new Date(startTime);
        const date_end = new Date(endTime);
        this.StartShow1.startTime = date_str.getFullYear() + '-' + this.p(date_str.getMonth() + 1) + '-' + this.p(date_str.getDate()) + ' ' + this.p(date_str.getHours()) + ':' + this.p(date_str.getMinutes()) + ':' + this.p(date_str.getSeconds());
        this.StartShow1.endTime = date_end.getFullYear() + '-' + this.p(date_end.getMonth() + 1) + '-' + this.p(date_end.getDate()) + ' ' + this.p(date_end.getHours()) + ':' + this.p(date_end.getMinutes()) + ':' + this.p(date_end.getSeconds());
      },
      p(s) {
        return s < 10 ? '0' + s : s
      },
      getvalue() //得到选择的刷新频率
      {
        this.time=this.value1
      },
      getSystemConfigInfo () {
        const _this = this
        api.getSystemConfigInfo({params: ''}).then(res => {

          _this.serviceOptions = res
          _this.num=res.length
        })
      },
       ChangeView()//加载指定查新图表
      {
        var flag = true
        console.log('我变了')
        this.planeFlag = false
        this.activeName = 'third'
        const _this = this
        var chartchange = echarts.init(document.getElementById('echart5'))
        console.log("2222222222",chartchange)
        var option = {
          title: {
            text: '折线图堆叠'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['', '', '', '', '','','','']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0.2, 0.2]
          },
          series: [
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            }
          ]
        };
          api.getSystemConfigInfo({params: _this.getcasename}).then(res => {
            _this.recivename= res[0].caseName
            _this.sensorTypeId=res[0].sensorTypeId
            console.log('res',res)
            console.log('得到要显示的名字', _this.recivename)
            console.log('typt',_this.sensorTypeId)
            if(_this.sensorTypeId=='3')
            {
              api.pm500rusult({params: _this.ChangeShow}).then(
                resC => {
                  var CreateDate = []
                  console.log('this.recivedata1', resC.results)
                  var arr1 = []
                  var arr2 = []
                  var arr3 = []
                  var arr4 = []
                  var arr5 = []
                  var arr6 = []
                  var arr7 = []
                  var arr8 = []
                  for(let k in resC.results)
                  {
                    arr1 = arr1.concat(resC.results[k].channel1signalResult)
                  }
                  for(let k in resC.results)
                  {
                    arr2 = arr2.concat(resC.results[k].channel2signalResult)
                  }
                  for(let k in resC.results)
                  {
                    arr3 = arr3.concat(resC.results[k].channel3signalResult)
                  }
                  for(let k in resC.results)
                  {
                    arr4 = arr4.concat(resC.results[k].channel4signalResult)
                  }
                  for(let k in resC.results)
                  {
                    arr5 = arr5.concat(resC.results[k].channel5signalResult)
                  }
                  for(let k in resC.results)
                  {
                    arr6 = arr6.concat(resC.results[k].channel6signalResult)
                  }
                  for(let k in resC.results)
                  {
                    arr7 = arr7.concat(resC.results[k].channel7signalResult)
                  }
                  for(let k in resC.results)
                  {
                    arr8 = arr8.concat(resC.results[k].channel8signalResult)
                  }

                  for (let k in resC.results) {
                    CreateDate = CreateDate.concat(resC.results[k].createDate)
                  }
                  _this.recive = resC

                  option.xAxis.data = CreateDate

                  option.legend.data[0]=_this.echartsX[0].channel1signalTypesName
                  option.legend.data[1]=_this.echartsX[0].channel2signalTypesName
                  option.legend.data[2]=_this.echartsX[0].channel3signalTypesName
                  option.legend.data[3]=_this.echartsX[0].channel4signalTypesName
                  option.legend.data[4]=_this.echartsX[0].channel5signalTypesName
                  option.legend.data[5]=_this.echartsX[0].channel6signalTypesName
                  option.legend.data[6]=_this.echartsX[0].channel7signalTypesName
                  option.legend.data[7]=_this.echartsX[0].channel8signalTypesName

                  option.series[0].name=_this.echartsX[0].channel1signalTypesName
                  option.series[1].name=_this.echartsX[0].channel2signalTypesName
                  option.series[2].name=_this.echartsX[0].channel3signalTypesName
                  option.series[3].name=_this.echartsX[0].channel4signalTypesName
                  option.series[4].name=_this.echartsX[0].channel5signalTypesName
                  option.series[5].name=_this.echartsX[0].channel6signalTypesName
                  option.series[6].name=_this.echartsX[0].channel7signalTypesName
                  option.series[7].name=_this.echartsX[0].channel8signalTypesName
                  option.series[0].data=arr1
                  option.series[1].data=arr2
                  option.series[2].data=arr3
                  option.series[3].data=arr4
                  option.series[4].data=arr5
                  option.series[5].data=arr6
                  option.series[6].data=arr7
                  option.series[7].data=arr8
                  option.title.text = _this.recivename
                  console.log(_this.recive)
                  chartchange.setOption(option)
                })
              window.onresize = function () {
                chartchange.resize()
              }
            }else if(_this.sensorTypeId=='2')
            {
              if(this.orderId!=null)
              {
                this.ChangeShow.orderId=this.orderId
              }
              api.qureymonitorinfoN({params: _this.ChangeShow}).then(
                resC => {
                  console.log('this.recivedata1', resC.results)
                  var Temperature = []
                  var Humidity = []
                  var CreateDate = []
                  console.log('this.recivedata', resC.results)
                  for (let k in resC.results) {
                    Temperature = Temperature.concat(resC.results[k].pv)
                  }
                  for (let k in resC.results) {
                    Humidity = Humidity.concat(resC.results[k].sv)
                  }
                  for (let k in resC.results) {
                    CreateDate = CreateDate.concat(resC.results[k].createDate)
                  }
                  _this.recive = resC
                  option.xAxis.data = CreateDate
                  option.series[0].data = Temperature
                  option.series[1].data = Humidity
                  option.legend.data[0]=resC.results[0].channel1signalTypesName
                  option.legend.data[1]="设置值"
                  option.series[0].name=resC.results[0].channel1signalTypesName
                  option.series[1].name="设置值"

                  var arr0 = [0, 0, 0, 0, 0, 0, 0]
                  option.series[2].data=arr0
                  option.series[3].data=arr0
                  option.series[4].data=arr0
                  option.series[5].data=arr0
                  option.series[6].data=arr0
                  option.series[7].data=arr0

                  option.title.text = _this.recivename
                  console.log(_this.recive)
                  chartchange.setOption(option)
                })
              window.onresize = function () {
                chartchange.resize()
              }
            }
          })
        api.queryechartsX({params:_this.getcasename}).then(res=>{
          _this.echartsX=res
          console.log("得到纵坐标的表示",_this.echartsX)
        })


      },
      BackViews() //返回初始页面
      {
        console.log('我回来了')
        window.clearInterval(this.t1);//关闭定时触发器t1
        this.planeFlag = true
        this.activeName = 'first'
      },
      queryAllsystem()
      {
        this.isShow = false
         window.clearInterval(this.t1);//关闭定时触发器t1
        this.BackViews()//返回初始页面
      },
      InterAllquery (ip,sensorTypeId) {
        if(sensorTypeId=='2'){
          this.isShow = true
        }
        this.orderId='1'
        console.log("ip22222",ip)
        this.ChangeShow.sensorIp=ip
        this.getcasename.sensorIp=ip
        window.clearInterval(this.t2);//关闭定时触发器t2
        this.ChangeView()
      },
      Real_time_query()
      {
        const _this = this
        var chartchange = echarts.init(document.getElementById('echart5'))
        console.log("2222222222",chartchange)
        var option = {
          title: {
            text: '折线图堆叠'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['', '', '', '', '','','','']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0.2, 0.2]
          },
          series: [
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '',
              type: 'line',
              stack: '总量',
              data: [0, 0, 0, 0, 0, 0, 0]
            }
          ]
        };
        _this.getSystemConfigInfo()
        {
          api.getSystemConfigInfo({params: _this.getcasename}).then(res => {
            _this.recivename= res[0].caseName
            _this.sensorTypeId=res[0].sensorTypeId
            console.log('res',res)
            console.log('得到要显示的名字', _this.recivename)
          })
        }
        api.queryechartsX({params:_this.getcasename}).then(res=>{
          _this.echartsX=res
          console.log("得到纵坐标的表示",_this.echartsX)
        })
        if(this.no_change_startTime1&&this.no_change_endTime1!=null)
        {
          this.times_format(this.no_change_startTime1,this.no_change_endTime1)
          this.ChangeShow.startTime=this.StartShow1.startTime
          this.ChangeShow.endTime=this.StartShow1.endTime
          console.log('61261',this.ChangeShow.endTime)
          if(_this.sensorTypeId=='3')
          {
            api.pm500rusult({params: _this.ChangeShow}).then(
              resC => {
                var CreateDate = []
                console.log('this.recivedata1', resC.results)
                var arr1 = []
                var arr2 = []
                var arr3 = []
                var arr4 = []
                var arr5 = []
                var arr6 = []
                var arr7 = []
                var arr8 = []
                for(let k in resC.results)
                {
                  arr1 = arr1.concat(resC.results[k].channel1signalResult)
                }
                for(let k in resC.results)
                {
                  arr2 = arr2.concat(resC.results[k].channel2signalResult)
                }
                for(let k in resC.results)
                {
                  arr3 = arr3.concat(resC.results[k].channel3signalResult)
                }
                for(let k in resC.results)
                {
                  arr4 = arr4.concat(resC.results[k].channel4signalResult)
                }
                for(let k in resC.results)
                {
                  arr5 = arr5.concat(resC.results[k].channel5signalResult)
                }
                for(let k in resC.results)
                {
                  arr6 = arr6.concat(resC.results[k].channel6signalResult)
                }
                for(let k in resC.results)
                {
                  arr7 = arr7.concat(resC.results[k].channel7signalResult)
                }
                for(let k in resC.results)
                {
                  arr8 = arr8.concat(resC.results[k].channel8signalResult)
                }

                for (let k in resC.results) {
                  CreateDate = CreateDate.concat(resC.results[k].createDate)
                }
                _this.recive = resC

                option.xAxis.data = CreateDate

                option.legend.data[0]=_this.echartsX[0].channel1signalTypesName
                option.legend.data[1]=_this.echartsX[0].channel2signalTypesName
                option.legend.data[2]=_this.echartsX[0].channel3signalTypesName
                option.legend.data[3]=_this.echartsX[0].channel4signalTypesName
                option.legend.data[4]=_this.echartsX[0].channel5signalTypesName
                option.legend.data[5]=_this.echartsX[0].channel6signalTypesName
                option.legend.data[6]=_this.echartsX[0].channel7signalTypesName
                option.legend.data[7]=_this.echartsX[0].channel8signalTypesName

                option.series[0].name=_this.echartsX[0].channel1signalTypesName
                option.series[1].name=_this.echartsX[0].channel2signalTypesName
                option.series[2].name=_this.echartsX[0].channel3signalTypesName
                option.series[3].name=_this.echartsX[0].channel4signalTypesName
                option.series[4].name=_this.echartsX[0].channel5signalTypesName
                option.series[5].name=_this.echartsX[0].channel6signalTypesName
                option.series[6].name=_this.echartsX[0].channel7signalTypesName
                option.series[7].name=_this.echartsX[0].channel8signalTypesName
                option.series[0].data=arr1
                option.series[1].data=arr2
                option.series[2].data=arr3
                option.series[3].data=arr4
                option.series[4].data=arr5
                option.series[5].data=arr6
                option.series[6].data=arr7
                option.series[7].data=arr8
                option.title.text = _this.recivename
                console.log(_this.recive)
                chartchange.setOption(option)
              })
            window.onresize = function () {
              chartchange.resize()
            }
          }else if(_this.sensorTypeId=='2')
          {

          }
        }else
        {
          if(_this.sensorTypeId='3')
          {
            api.pm500rusult({params: _this.ChangeShow}).then(
              resC => {
                var CreateDate = []
                console.log('this.recivedata1', resC.results)
                var arr1 = []
                var arr2 = []
                var arr3 = []
                var arr4 = []
                var arr5 = []
                var arr6 = []
                var arr7 = []
                var arr8 = []
                for(let k in resC.results)
                {
                  arr1 = arr1.concat(resC.results[k].channel1signalResult)
                }
                for(let k in resC.results)
                {
                  arr2 = arr2.concat(resC.results[k].channel2signalResult)
                }
                for(let k in resC.results)
                {
                  arr3 = arr3.concat(resC.results[k].channel3signalResult)
                }
                for(let k in resC.results)
                {
                  arr4 = arr4.concat(resC.results[k].channel4signalResult)
                }
                for(let k in resC.results)
                {
                  arr5 = arr5.concat(resC.results[k].channel5signalResult)
                }
                for(let k in resC.results)
                {
                  arr6 = arr6.concat(resC.results[k].channel6signalResult)
                }
                for(let k in resC.results)
                {
                  arr7 = arr7.concat(resC.results[k].channel7signalResult)
                }
                for(let k in resC.results)
                {
                  arr8 = arr8.concat(resC.results[k].channel8signalResult)
                }

                for (let k in resC.results) {
                  CreateDate = CreateDate.concat(resC.results[k].createDate)
                }
                _this.recive = resC

                option.xAxis.data = CreateDate

                option.legend.data[0]=_this.echartsX[0].channel1signalTypesName
                option.legend.data[1]=_this.echartsX[0].channel2signalTypesName
                option.legend.data[2]=_this.echartsX[0].channel3signalTypesName
                option.legend.data[3]=_this.echartsX[0].channel4signalTypesName
                option.legend.data[4]=_this.echartsX[0].channel5signalTypesName
                option.legend.data[5]=_this.echartsX[0].channel6signalTypesName
                option.legend.data[6]=_this.echartsX[0].channel7signalTypesName
                option.legend.data[7]=_this.echartsX[0].channel8signalTypesName

                option.series[0].name=_this.echartsX[0].channel1signalTypesName
                option.series[1].name=_this.echartsX[0].channel2signalTypesName
                option.series[2].name=_this.echartsX[0].channel3signalTypesName
                option.series[3].name=_this.echartsX[0].channel4signalTypesName
                option.series[4].name=_this.echartsX[0].channel5signalTypesName
                option.series[5].name=_this.echartsX[0].channel6signalTypesName
                option.series[6].name=_this.echartsX[0].channel7signalTypesName
                option.series[7].name=_this.echartsX[0].channel8signalTypesName
                option.series[0].data=arr1
                option.series[1].data=arr2
                option.series[2].data=arr3
                option.series[3].data=arr4
                option.series[4].data=arr5
                option.series[5].data=arr6
                option.series[6].data=arr7
                option.series[7].data=arr8
                option.title.text = _this.recivename
                console.log(_this.recive)
                chartchange.setOption(option)
              })
            window.onresize = function () {
              chartchange.resize()
            }
          }else if(_this.sensorTypeId=='2')
          {

          }
        }

      }
    }
    }
</script>

<style scoped>
  .name{
    position: absolute;
    top: 4%;
    left:59.5px;
    color:blue;
  }
  .chanxun{
    position: absolute;
    top: 299px;
    left:86.5px;
    border-top: 1em solid #333;
    border-bottom: 1em solid #333;
  }
  .data1{
    position: absolute;
    top: 26%;
    left:70.5px;
    color: #d3dce6;
  }
  .data2{
    position: absolute;
    top: 30%;
    left:70.5px;
    color: #d3dce6;
  }
  .data3{
    position: absolute;
    top: 34%;
    left:70.5px;
    color: #d3dce6;
  }

  body{
    margin: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(floralwhite, wheat);
  }

  /* body 容器尺寸 */
  .fridge {
    width: 24em;
    height: 38em;
    font-size: 10px;
    border-top: 1em solid #333;
    border-bottom: 1em solid #333;
    background:
      linear-gradient(
        to right,
        transparent 40%,
        /*gray 40%,*/
        /*silver 41%,*/
        /*dimgray 43%,* 这里以及前面三行都是显示的冰箱把手/
        transparent 43%, transparent 48%,
        /*gray 48%,*/
        /*silver 49%,*/
        /*dimgray 51%,*/
        transparent 51%
      ) no-repeat center / 100% 90%,
      linear-gradient(
        to right,
        darkgray,
        lightgray 10%,
        /*silver 40%, silver 45%,* 中间的黑线/
        /*black 45%, black 46%,*/
        /*silver 46%, silver 80%,*/
        /*x箱体灰色*/
        darkgray 90%,
        dimgray
      );
    border-radius: 4em / 0.5em;
    box-shadow: 0 0.5em 1em -0.5em rgba(0, 0, 0, 0.5);
    position: relative;
    height: 400px;
  }

  /* water supply */
  .fridge::before {
    content: '';
    position: absolute ;
    width: 80%;
    height: 50%;
    background:
      radial-gradient(
        circle at 10% 12%,
        limegreen, limegreen 0.2em,
        transparent 0.2em
      ),
      radial-gradient(
        circle at 20% 12%,
        red, red 0.2em,
        transparent 0.2em
      ),
      radial-gradient(
        circle at 15% 12%,
        gold, gold 0.2em,
        transparent 0.2em
      ),
      black;
    top: calc((40% - 7.5em) / 2);
    left: 2.5em;
  }

</style>
