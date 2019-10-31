<template>
  <div class="player-container" ref="dplayer">
    <div class="prism-player" id="dplayer"></div>
</div>
</template>
<script>
import 'dplayer/dist/DPlayer.min.css';
import DPlayer from 'dplayer';
export default{
  data(){
    return{
      dpList:[]
    }
  },
  mounted() {
    const player = this.dp = new DPlayer({
        element: this.$refs.dplayer,
        autoplay: true,
        video: {
          url:"http://10.101.194.95:8889/hls/19216810282.m3u8",
         type: "hls"
        }
       })
  }
}
</script>
<style>
.container {
  background-color: #efefef;
  min-height: 100%;
}
</style>
