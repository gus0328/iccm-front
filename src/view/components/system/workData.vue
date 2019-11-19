<template>
  <div ref="content" style="width:100%;height:100%;">
     <div style="width:100%;height:40px;">
       <div class="title">现场作业数据</div>
       <div @click="close" class="close">关闭</div>
     </div>
    <div style="width:710px;height:100%;margin-right:15px;float:left;">
      <div class="new_lst" v-bind:style="{ display: 'block', width: '100%', height:'360px'}">
        <div style="heigth:40px;line-height: 40px;">
          <div class="titleLeft"><div class="titleFront"></div></div>
          <div class="titelRight">环境传感器数据</div>
        </div>
        <div v-bind:style="{width:'100%',height:'320px',background:'#202E47'}">
          <div v-bind:style="{ width: '100%', height: '40px' }" class="uni-row">
            <div style="width:122px;height:30px;"></div>
            <div style="height:30px;color: #FFFFFF;background:#5F83A0;width:122px;line-height: 30px;text-align: center;border-style:outset;border-color: #202E47;">低标准</div>
            <div style="height:30px;color: #FFFFFF;background:#3D627F;width:204px;line-height: 30px;text-align: center;border-style:outset;border-color: #202E47;">正常</div>
            <div style="height:30px;color: #FFFFFF;background:#244C6A;width:124px;line-height: 30px;text-align: center;border-style:outset;border-color: #202E47;">高标准</div>
            <div style="height:30px;color: #FFFFFF;background:#3D627F;width:110px;line-height: 30px;text-align: center;border-style:outset;border-color: #202E47;">正常范围</div>
          </div>
          <div class="line uni-row">
            <div class="line-title">氧气浓度</div>
            <div class="uni-column">
              <div class="uni-row" style="height:26px;">
                <div v-for="item in dataJson.O2list" :key="item.id" class="num-line">
                  <div class="num-line-word">{{ item.value }}</div>
                </div>
              </div>
              <div class="uni-row">
                <div class="chartsData" v-bind:style="{ height: '6px', width:chartsWidth[0]}"></div>
                <div class="showData">{{ dataJson.remoteData.device1 }}%</div>
              </div>
            </div>
            <div class="normal-title">19.5-22</div>
          </div>
          <div class="line uni-row">
            <div class="line-title">一氧化碳浓度</div>
            <div class="uni-column">
              <div class="uni-row" style="height:26px;">
                <div v-for="item in dataJson.COlist" :key="item.id" class="num-line">
                  <div class="num-line-word" style="margin-left:24px;">{{ item.value }}</div>
                </div>
              </div>
              <div class="uni-row">
                <div class="chartsData" v-bind:style="{ height: '6px', width:chartsWidth[1] }"></div>
                <div class="showData">{{ dataJson.remoteData.device2 }}%</div>
              </div>
            </div>
             <div class="normal-title">
              &lt;&nbsp;&nbsp;0.0023
            </div>
          </div>
          <div class="line uni-row">
            <div class="line-title">硫化氢浓度</div>
            <div class="uni-flex uni-column">
              <div class="uni-flex uni-row" style="height:26px;">
                <div v-for="item in dataJson.H2Slist" :key="item.id" class="num-line">
                  <div class="num-line-word" style="margin-left:20px;">{{ item.value }}</div>
                </div>
              </div>
              <div class="uni-row">
                <div class="chartsData" v-bind:style="{ height: '6px', width:chartsWidth[2] }"></div>
                <div class="showData">{{ dataJson.remoteData.device3 }}%</div>
              </div>
            </div>
            <div class="normal-title">
              &lt;&nbsp;&nbsp;0.00066
            </div>
          </div>
          <div class="line uni-row">
            <div class="line-title">瓦斯浓度</div>
            <div class="uni-column">
              <div class="uni-flex uni-row" style="height:26px;">
                <div v-for="item in dataJson.CH4list" :key="item.id" class="num-line">
                  <div class="num-line-word">{{ item.value }}</div>
                </div>
              </div>
              <div class="uni-row">
                <div class="chartsData" v-bind:style="{ height: '6px', width: chartsWidth[3]}"></div>
                <div class="showData">{{ dataJson.remoteData.device4 }}%</div>
              </div>
            </div>
            <div class="normal-title">
              &lt;&nbsp;&nbsp;1.5
            </div>
          </div>
          <div class="line uni-row">
            <div class="line-title">温度</div>
            <div class="uni-column">
              <div class="uni-row" style="height:26px;">
                <div v-for="item in dataJson.Tlist" :key="item.id" class="num-line">
                  <div class="num-line-word">{{ item.value }}</div>
                </div>
              </div>
              <div class="uni-row">
                <div class="chartsData" v-bind:style="{ height: '6px', width:chartsWidth[4] }"></div>
                <div class="showData">{{ dataJson.remoteData.device5 }}℃</div>
              </div>
            </div>
            <div class="normal-title">22-25</div>
          </div>
        </div>
      </div>
      <div v-bind:style="{width:'100%',heigth:personsHeight}">
        <div style="heigth:40px;line-height: 40px;">
          <div class="titleLeft"><div class="titleFront"></div></div>
          <div class="titelRight">人员身体数据</div>
        </div>
        <div v-bind:style="{width:'100%',height:personsListHeight,background:'#202E47'}">
          <div v-bind:style="{ height: '30px', background: '#141C30', fontSize: '16px', color: '#ffffff' }" class="uni-flex uni-row">
            <div v-bind:style="{ width: '18%', fontWeight: '600', textAlign: 'center', lineHeight: '30px' }">姓名</div>
            <div v-bind:style="{ width: '30%', fontWeight: '600', textAlign: 'center', lineHeight: '30px' }">血压</div>
            <div v-bind:style="{ width: '24%', fontWeight: '600', textAlign: 'center', lineHeight: '30px' }">心率</div>
            <div v-bind:style="{ width: '28%', fontWeight: '600', textAlign: 'center', lineHeight: '30px' }">皮肤温度</div>
          </div>
          <div
            v-for="(item, index) in dataJson.persons"
            :key="index"
            v-bind:style="{ height: '40px', fontSize: '14px', fontWeight: '600', color: '#ffffff', borderBottomStyle: 'dotted' }"
            class="uni-flex uni-row"
          >
            <div v-bind:style="{ width: '18%', textAlign: 'center', lineHeight: '40px' }">{{ item.name }}</div>
            <div v-bind:style="{ width: '30%', textAlign: 'center', lineHeight: '40px' }">{{ item.bloodPress }}</div>
            <div v-bind:style="{ width: '24%', textAlign: 'center', lineHeight: '40px' }">{{ item.heartRate }}</div>
            <div v-bind:style="{ width: '28%', textAlign: 'center', lineHeight: '40px' }">{{ item.skinT }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-bind:style="{width:videosWidth,height:videosHeight,float:'left'}">
      <iframe id="siteWorkVideoIframe" name="workDataVideos" style="width:100%;height:100%;" marginheight="0" marginwidth="0" :src="videosPath"></iframe>
     <!-- <div style="heigth:40px;line-height: 40px;">
        <div class="titleLeft"><div class="titleFront"></div></div>
        <div class="titelRight">视屏监控</div>
      </div>
      <div v-bind:style="{width:'100%',height:videosHeight,background:'#202E47'}">
        <div v-bind:style="{width:'100%',height:'50%',float:'left'}">
            <div ref="video0" v-bind:style="{width:'50%',height:'100%',float:'left'}" @click="show">
             <iframe style="width:100%;height:100%;" marginheight="0" marginwidth="0" :src="videos[0]"></iframe>
           </div> -->
           <!-- <div ref="video1" v-bind:style="{width:'50%',height:'100%',float:'left'}">
             <iframe @click="show" style="width:100%;height:100%;" marginheight="0" marginwidth="0" :src="videos[1]"></iframe>
           </div> -->
        <!-- </div>
        <div v-bind:style="{width:'100%',height:'50%',float:'left'}">
            <div ref="video2" v-bind:style="{width:'50%',height:'100%',float:'left'}">
              <iframe style="width:100%;height:100%;" marginheight="0" marginwidth="0" :src="videos[2]"></iframe>
            </div>
            <div v-bind:style="{width:'50%',height:'100%',float:'left'}">
              <div ref="video3" v-bind:style="{width:'100%',height:'50%',float:'left'}">
               <iframe style="width:100%;height:100%;" marginheight="0" marginwidth="0" :src="videos[3]"></iframe>
              </div>
              <div ref="video4" v-bind:style="{width:'100%',height:'50%',float:'left'}">
               <iframe style="width:100%;height:100%;" marginheight="0" marginwidth="0" :src="videos[4]"></iframe>
              </div>
            </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import data from './data.json';
import videoBasePath from '@/libs/videoBasePath.js'
import videoProPath from '@/libs/videoProPath.js'
const baseVideoUrl = process.env.NODE_ENV === 'development' ? videoBasePath : videoProPath
export default {
  name:'workData',
  props:{
    workId:{
      type:String,
      default:null
    }
  },
  data() {
    return {
      chartsWidth:[],
      videosWidth:'100px',
      workData: {},
      dataJson: data,
      videosHeight:'100px',
      sonHeight:'100px',
      chartWidth:'100px',
      personsHeight:'100px',
      personsListHeight:'100px',
      workRow:{},
      videosPath:"",
      interval:null
    };
  },
  methods: {
    getSuffix(ip) {
      var ips = ip.split('.');
      var text = '';
      for (var int = 0; int < ips.length; int++) {
        text += ips[int];
      }
      return text + '.m3u8';
    },
    getWorkData() {
      let that = this;
      this.$ajax.request({
        url:'/work/siteWork/getWorkData',
        method:'post',
        data:this.workData,
        spin:false
      }).then(res => {
          that.dataJson.remoteData = res.data.data.remoteData;
          that.dataJson.persons = res.data.data.persons;
          let device1Long = that.dataJson.remoteData.device1 - 18 > 0 ? that.dataJson.remoteData.device1 - 18 : 0;
          let device2Long = that.dataJson.remoteData.device2 - 0.0019 > 0 ? that.dataJson.remoteData.device2 - 0.0019 : 0;
          let device3Long = that.dataJson.remoteData.device3 - 0.00058 > 0 ? that.dataJson.remoteData.device3 - 0.00058 : 0;
          let device4Long = that.dataJson.remoteData.device4 - 1.1 > 0 ? that.dataJson.remoteData.device4 - 1.1 : 0;
          let device5Long = that.dataJson.remoteData.device5 - 21 > 0 ? that.dataJson.remoteData.device5 - 21 : 0;

          let device1Width = that.dataJson.remoteData.device1 > 23.5 ? '451px' : (device1Long / 5.5) * 451 + 'px';
          let device2Width = that.dataJson.remoteData.device2 > 0.00245 ? '451px' : (device2Long / 0.00055) * 451 + 'px';
          let device3Width = that.dataJson.remoteData.device3 > 0.00069 ? '451px' : (device3Long / 0.00011) * 451 + 'px';
          let device4Width = that.dataJson.remoteData.device4 > 1.65 ? '451px' : (device4Long / 0.55) * 451 + 'px';
          let device5Width = that.dataJson.remoteData.device5 > 26.5 ? '451px' : (device5Long / 5.5) * 451 + 'px';
          that.chartsWidth = [device1Width, device2Width, device3Width, device4Width, device5Width];
      });
    },
    getRemoteData(){
      let that = this;
      let gass = this.workRow.gases;
      let remoteData = {};
      for(let int = 0;int < gass.length;int++){
      	let typeIndex = parseInt(gass[int].spareWord1);
      	switch(typeIndex){
      		case 0:
      			remoteData["device1"] = gass[int].itemCode;
      			break;
      		case 1:
      			remoteData["device2"] = gass[int].itemCode;
      			break;
      		case 2:
      			remoteData["device3"] = gass[int].itemCode;
      			break;
      		case 3:
      			remoteData["device4"] = gass[int].itemCode;
      			break;
      		case 4:
      			remoteData["device5"] = gass[int].itemCode;
      			break;
      	}
      }
      this.workData["remoteData"] = remoteData;
      let workers = this.workRow.workers;
      let persons = [];
      for(let int=0;int<workers.length;int++){
      	let person = {name:workers[int].personName};
      	let devices = workers[int].devices;
      	for(let i = 0;i < devices.length;i++){
      		let typeIndex = parseInt(devices[i].spareWord1);
      		switch(typeIndex){
      			case 0:
      				person["heightPress"] = parseInt(devices[i].itemCode,10);
      				break;
      			case 1:
      				person["lowPress"] = parseInt(devices[i].itemCode,10);
      				break;
      			case 2:
      				person["heartRate"] = parseInt(devices[i].itemCode,10);
      				break;
      			case 3:
      				person["skinT"] = Number(devices[i].itemCode).toFixed(1);
      				break;
      		}
      	}
      	persons.push(person);
      }
      this.workData["persons"] = persons;
      this.getWorkData();
      // let that = this;
      this.interval = setInterval(function(){that.getWorkData()}, 5000)
    },
    getSiteWorkDetails(){
      this.$ajax.request({
        url:"/work/siteWork/getWorkDetails",
        method:"post",
        data:{id:this.workId}
      }).then((res) => {
        this.workRow = res.data.details;
        this.getRemoteData();
        var ips ="";
        var usernames = "";
        var passwords = "";
        var ports = "";
        for(let int =0;int<this.workRow.monitors.length;int++){
          if(int>4){
            break;
          }
          ips+=this.workRow.monitors[int].ipAdress+",";
          usernames+=this.workRow.monitors[int].itemCode+",";
          passwords+=this.workRow.monitors[int].itemName+",";
          ports+='80,'
        }
        if(this.workRow.monitors.length>0){
          ips = ips.substring(0,ips.length-1);
          usernames = usernames.substring(0,usernames.length-1);
          passwords = passwords.substring(0,passwords.length-1);
          ports = ports.substring(0,ports.length-1);
        }
        let path = baseVideoUrl+"?ips="+ips+"&usernames="+usernames+"&passwords="+passwords+"&ports="+ports;
        this.videosPath = path;
      })
    },
    close(){
      window.frames['workDataVideos'].stop();
      clearInterval(this.interval);
      this.$emit("close");
    }
    //获得元素的size
  },
  mounted() {
    let contentHeight = this.$refs.content.offsetHeight;
    let contentWidth = this.$refs.content.offsetWidth;
    this.sonHeight = parseInt(contentHeight)/2-90+'px';
    this.videosWidth = parseInt(contentWidth)-726+'px'
    this.videosHeight = parseInt(contentHeight) - 40+'px';
    this.personsHeight = parseInt(contentHeight)-400+'px';
    this.personsListHeight = parseInt(contentHeight)-440+'px';
    this.getSiteWorkDetails();
  }
};
</script>

<style>
.line {
  height: 50px;
  width: 100%;
  background: #202e47;
  position: relative;
}
.line-title {
  width: 110px;
  margin-right: 10px;
  height: 50px;
  font-size: 16px;
  color: #ffffff;
  line-height: 50px;
  text-align: center;
  background: #4cbbed;
  border-style: outset;
  border-color: #202e47;
}
.line-title-top {
  width: 100px;
  height: 40px;
  font-size: 16px;
  color: #ffffff;
  line-height: 40px;
  background: #4cbbed;
}
.chartsData {
  background: url(./images/chartsBg.png);
  background-repeat: no-repeat;
  margin-top: 6px;
  color: #ffffff;
}
.titleFront {
  width: 48px;
  height: 12px;
  background: url(./images/arrowRight.png);
  background-size: 12px 12px;
  float: left;
  position: relative;
  top: 12px;
}
.titelRight {
  width: 200px;
  height: 100%;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-left: 58px;
}
.titleLeft {
  height: 40px;
  width: 48px;
  float: left;
  display: block;
}
.showData {
  color: #ffffff;
  font-size: 10px;
  margin-left: 4px;
}
.num-line {
  height: 6px;
  width: 41px;
  border-top: 1px solid #83bbf4;
  border-right: 1px solid #83bbf4;
}
.num-line-word {
  color: #83bbf4;
  font-size: 10px;
  margin-left: 30px;
  margin-top: 4px;
}
.normal-title {
  width: 100px;
  height: 50px;
  text-align: center;
  color: #ffffff;
  font-size: 12px;
  border-bottom-style: dotted;
  line-height: 40px;
  position: absolute;
  right:32px;
}
.chart {
  width: 451px;
}
.uni-row > div {
  float: left;
}
.title{
    float:left;
    font-size:16px;
    font-weight:600;
    color:#ffffff;
  }
  .close{
    font-size:16px;
    margin-right:20px;
    color:#ffffff;
    float:right;
    cursor:pointer;
  }
  .close:hover{
    color:red;
  }
</style>
