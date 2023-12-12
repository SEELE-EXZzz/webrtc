<template>
    <div id="main">
        <div id="left">
            <div id="videoDiv">
                <canvas id="canvas"></canvas>
                <canvas id="screenShotCanvas" style="display: none;"></canvas>
                <video id="remote"></video>
                <video id="local"></video>  
                <video id="recordVideo" autoplay="true" controls="true" v-show="showRecordVideo"></video>         
            </div>
            <div id="videoButton">
                <el-button type="primary" class="button" @click="getStream(0,'camera')" :disabled="disabledList[0]">获取摄像头媒体流</el-button>
                <el-button type="primary" class="button" @click="getStream(1,'desktop')" :disabled="disabledList[1]">获取桌面媒体流</el-button>
                <el-button type="primary" class="button" @click="screenShot" title="获取远端屏幕截图">获取屏幕截图</el-button>
                <el-button type="primary" class="button" @click="recordVideo" title="录制远端视频">录制视频</el-button>
                <el-button type="primary" class="button" @click="stopRecordVideo" title="停止录制远端视频">停止录制</el-button>
                <el-button type="primary" class="button" @click="downloadRecordVideo" title="下载录制视频">下载录制视频</el-button>
            </div>
        </div>
        <div id="right">
            <chat></chat>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client'
import chat from './chat.vue'
export default{
    components:{
        chat
    },
    data(){
        return{
            record:'',
            recordLive:false, //判断是否在录制
            user:'',
            room:'',
            socket:'',
            stream:'',//本地媒体流
            remoteStream:'',//远端媒体流
            user:'', 
            userType:'',//如果是send则是发送方，如果是get则是接收方
            pc:'', //pc为rtcpeerConnection的实例对象
            candidate:'',
            disabledList:[false,false,false,false],
            live:false, //判断是否在通信,
            recordBlobList:[], //储存录制的视频流
            recordVideoMove:false,
            recordVideoMouseX:'',
            recordVideoMouseY:'',
            recordVideoLeft:'',
            recordVideoTop:'',
            sourceBuffer:'',
            showRecordVideo:false,
        }
    },
    methods:{
        //移动相关方法
        async getFirstPostion(e){
            e.preventDefault()
            if(this.recordVideoMove) return
            this.recordVideoMove = true
            let left =await e.target.getBoundingClientRect().left
            let top = await e.target.getBoundingClientRect().top
            this.recordVideoLeft = left
            this.recordVideoTop = top 
            this.recordVideoMouseX = e.clientX
            this.recordVideoMouseY = e.clientY
        },
        getMovePostion(e){
            e.preventDefault()
            if(!this.recordVideoMove) return
            e.target.style.left = this.recordVideoLeft + e.clientX - this.recordVideoMouseX +'px'    
            e.target.style.top = this.recordVideoTop + e.clientY - this.recordVideoMouseY +'px'    
        },
        getLastPostion(e){
            e.preventDefault()
            if(!this.recordVideoMove) return
            this.recordVideoMove = false
        },
        async getStream(index,type){
            if(type==='camera'){
                this.stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
            }else if(type==='desktop'){
                this.stream = await navigator.mediaDevices.getDisplayMedia({video:true,audio:true})
            }
            let local = document.querySelector('#local')
            local.srcObject = this.stream
            local.oncanplay=()=>{local.play()} 
            if(!this.pc){
              this.pc = new RTCPeerConnection() 
              await this.pc.addStream(this.stream) 
            }else{
                const senders = this.pc.getSenders()
                senders.forEach(sender => {
                if (sender.track.kind === 'video') {
                    sender.replaceTrack(this.stream.getVideoTracks()[0])
                } else if (sender.track.kind === 'audio') {
                    sender.replaceTrack(this.stream.getAudioTracks()[0])
                }
                })
            }
            //如果是第一次连接的话,向服务器发送房间号，用以确认该客户端是发送方还是接收方。
            if(!this.userType){
                this.socket.emit('getOfferRoom',this.room)
                this.socket.on('getUserType',async(userType,offer)=>{
                    /*
                        如果是发送方需要创建offer并发送给服务器并将offer设置到本地描述，同时监听服务器接收answer。
                        如果服务器返回answer需要将answer设置远端描述。
                        如果是接收方则将offer设置到远端描述并创建answer同时将answer设置成本地描述然后向服务器发送answer。
                    */
                    this.userType = userType
                    if(userType==='send'){
                        this.localConnection()
                    }else if(userType==='get'){
                        this.remoteConnection(offer)
                    }                
                })
            }
            this.pc.onicecandidate=(e)=>{
                if(e.candidate){
                    this.socket.emit('candidate',e.candidate,this.room,this.userType) 
                }//如果用户是接收方的话就在发送的candidate的时候添加发送方的candidate。 
            }//在设置完媒体流以及本地描述后就会不断触发这个事件,此时的e.candidate有可能是null所以需加一层判断
            this.pc.ontrack=async(e)=>{
                let remote = document.querySelector('#remote')
                remote.srcObject =await e.streams[0]
                remote.oncanplay=()=>{remote.play()}
                this.live = true
            }//当远程描述设置完成就会触发ontrack
            this.disabledList = this.disabledList.map((a,i)=>i==index?true:false)
        },
        async mediaConsultation(){

        },
        async localConnection(){
            this.userType = 'send'
            let offer = await this.pc.createOffer()
            await this.pc.setLocalDescription(offer)
            this.socket.emit('sendOffer',offer,this.room)
            this.socket.on('getAnswer',async(answer)=>{
                await this.pc.setRemoteDescription(answer)
                this.pc.addIceCandidate(this.candidate)
            })
            return offer
        },
        async remoteConnection(offer){
            this.userType = 'get'
            await this.pc.setRemoteDescription(offer)
            let answer = await this.pc.createAnswer()
            await this.pc.setLocalDescription(answer)
            this.socket.emit('sendAnswer',answer,this.room)
            this.pc.addIceCandidate(this.candidate)
        },
        screenShot(){
            if(!this.live) return //如果没有通信说明没有远端视频也就不用截图。
            let screenShotCanvas = document.querySelector('#screenShotCanvas')
            let screenShotCtx = screenShotCanvas.getContext('2d')
            let remote = document.querySelector('#remote')
            screenShotCanvas.width = remote.videoWidth
            screenShotCanvas.height = remote.videoHeight
            screenShotCtx.drawImage(remote,0,0,screenShotCanvas.width,screenShotCanvas.height)
            screenShotCanvas.toBlob((blob)=>{
                navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(()=>{}).catch((err)=>console.log(err))
            })      
        },//获取屏幕截图并复制到剪切板板上,
        async recordVideo(){
            if(this.recordLive) return //如果在录制中就返回。
            this.showRecordVideo =  true 
            const options = {
                mimeType: 'video/webm;codecs=vp8',
                audioBitsPerSecond: 128000,
                videoBitsPerSecond: 2500000
            }
            let remote = document.querySelector('#remote')
            this.remoteStream =await remote.captureStream()
            let video = document.querySelector('#recordVideo')
            let record = new MediaRecorder(this.remoteStream,options)
            this.record = record
            this.recordLive = true
            record.start(1000)
            let mediaSource = new MediaSource()
            let sourceBuffer
            video.src = URL.createObjectURL(mediaSource)
            mediaSource.addEventListener('sourceopen',()=>{
                const mimeCodec = 'video/webm;codecs="vp8",opus'
                sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
            })
            record.ondataavailable=(e)=>{
                const blob = e.data
                this.recordBlobList.push(e.data)
                    if (blob.size > 0) {
                        const read = new FileReader()
                        read.readAsArrayBuffer(blob)
                        read.onloadend = (e) => {
                            sourceBuffer.appendBuffer(e.target.result)
                        }
                    }
                }
        },
        stopRecordVideo(){
            if(!this.record) return
            this.record.stop()
            this.showRecordVideo = false
        },
        downloadRecordVideo(){
            if(!this.recordBlobList) return
            let a = document.createElement('a')
            let blob = new Blob(this.recordBlobList,{ type: 'video/mp4' })
            let read = new FileReader()
            a.download = true
            read.readAsDataURL(blob)
            read.onload=(e)=>{
                let url = e.target.result
                a.href = url
                a.click()
            }
        }
    },
    created(){
        this.socket = io('https://localhost:443')
        if(sessionStorage.getItem('user')&&sessionStorage.getItem('room')){
            this.user = sessionStorage.getItem('user')
            this.room = sessionStorage.getItem('room')
        }
    },
    mounted(){
        if(sessionStorage.getItem('user')&&sessionStorage.getItem('room')){
            this.user = sessionStorage.getItem('user')
            this.room = sessionStorage.getItem('room')
        }
        this.socket.on('getCandidate',(candidate,userType)=>{
            this.candidate = candidate
        })

        this.socket.emit('userjoinRoom',this.room) //测试用后面要删，没有登录界面所以得加入房间
    }
}
</script>

<style scoped>
.button{
    margin: 20px;
}
#videoButton{
    position: absolute;
    display: flex;
    top: 90%;
    height: 10%;
    width: 100%;
}
#videoDiv{
    position: relative;
    background-color: black;
    width: 100%;
    height: 90%;
}
#canvas{
    position: absolute;
    width: 100%;
    height: 90%;
}
#remote{
    position: absolute;
    width: 100%;
    height: 90%;
}
#local{
    position: absolute;
    top: 70%;
    left: 80%;
    width: 20%;
    height: 20%;
}
#recordVideo{
    position: absolute;
    top: 70%;
    width: 30%;
    height: 30%;
}
#main{
    position: absolute;
    width: 80%;
    height: 80%;
    left: 50%;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
}
#left{
    position: absolute;
    width: 70%;
    height: 100%;
    background-color: antiquewhite;
}
#right{
    position: absolute;
    left: 70%;
    width: 30%;
    height: 100%;
}
</style>