<template>
    <div id="chat" >
        <div id="roomAndUser">
            <div class="roomAndUser">
                房间号:{{ room }}
            </div>
            <div class="roomAndUser">
                用户:{{user}},{{otherUser}}  
            </div>
        </div>
        <div id="chatContent" @dragover="fileEnter" @drop="fileLeave">
            <div v-for="msgObj in chatMsgList" class="chatMsgDiv">
                <div v-if="msgObj.msgType==='get'" id="leftMsg">   
                    <div id="leftAvatar">
                        <img :src='msgObj.avatarURL' style="margin: 5px;" >    
                    </div>
                    <div id="leftMsgContent">
                        <div style="height: 20px;">
                           <span>{{ msgObj.user }}</span> 
                        </div>
                        <template v-if="msgObj.msg">
                            <div id="leftUserMsg">
                                    <p v-for="msg in msgObj.msg">
                                        {{ msg }}
                                    </p>
                            </div>
                        </template>
                        <template v-if="msgObj.file">
                            <div id="leftUserFile" :id='msg'+msgObj.file.timestamp>
                                <div style="width: 160px;height: 65px;">
                                    <div style="width: 160px;height: 20px;margin: 2px;" >
                                    文件名:{{msgObj.file.name}}
                                    </div>
                                    <div style="width: 160px;height: 20px;margin: 2px;">
                                    文件大小:{{msgObj.file.size}}    
                                    </div>
                                    <div style="width: 160px;height: 20px;margin: 2px;">
                                        <span :id="'_'+msgObj.file.timestamp">上传进度:0</span> 
                                    </div>  
                                </div>
                            </div>
                        </template>
                        <template v-if="msgObj.img">
                            <div id="leftUserImg">
                              <img :id="'_'+msgObj.img.timestamp" src="" alt="" style="width: 100px;height: 100px;">  
                            </div>
                        </template>
                    </div>
                </div>
                <div v-if="msgObj.msgType==='send'" id="rightMsg">
                    <div id="rightAvatar">
                        <img :src='msgObj.avatarURL' style="margin: 5px;" >    
                    </div>
                    <div id="rightMsgContent">
                        <div id="rightChatUserName" style="height: 20px;float: right;">
                            <span>{{ msgObj.user }}</span>
                        </div>
                        <template v-if="msgObj.msg">
                            <div id="rightUserMsg">  
                                <p v-for="msg in msgObj.msg">
                                    {{ msg }}
                                </p>
                            </div>
                        </template>
                        <template v-if="msgObj.file">
                            <div id="rightUserFile">
                                <div style="width: 160px;height: 65px;">
                                    <div style="width: 160px;height: 20px;margin: 2px;" >
                                    文件名:{{msgObj.file.name}}
                                    </div>
                                    <div style="width: 160px;height: 20px;margin: 2px;">
                                    文件大小:{{msgObj.file.size}}    
                                    </div>
                                    <div style="width: 160px;height: 20px;margin: 2px;">
                                        <span :id="'_'+msgObj.file.timestamp">上传进度:0</span> 
                                    </div>  
                                </div>
                            </div>
                        </template>
                        <template v-if="msgObj.img">
                            <div id="rightUserImg">
                              <img :id="'_'+msgObj.img.timestamp" src="" alt="" style="width: 100px;height: 100px;">  
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div id="send">
            <div v-if="showEmoji" id="emojiBox" @click="clickEmoji">
                <div v-for="emoji in emojiList" style="width: 30px;height: 30px;">
                    <div v-html="emoji" style="width: 24px;height: 24px;margin: 3px;"></div>
                </div>
            </div>
            <div id="sendButton">
                <ul>                  
                    <li class="iconBox" title="创建头像" @click="createAvatar">
                        <svg t="1701659913144" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7056" width="200" height="200"><path d="M512 42.666667a469.333333 469.333333 0 1 0 469.333333 469.333333A469.333333 469.333333 0 0 0 512 42.666667z m0 896a424.533333 424.533333 0 0 1-279.466667-104.96 298.666667 298.666667 0 0 1 558.933334 0A424.533333 424.533333 0 0 1 512 938.666667z m-149.333333-490.666667a149.333333 149.333333 0 1 1 149.333333 149.333333 149.333333 149.333333 0 0 1-149.333333-149.333333z m461.866666 353.493333a341.333333 341.333333 0 0 0-213.333333-189.226666 192 192 0 1 0-197.973333 0 341.333333 341.333333 0 0 0-213.333334 189.226666 426.666667 426.666667 0 1 1 624.64 0z" fill="#666666" p-id="7057"></path></svg>
                    </li>
                    <li class="iconBox" title="表情包" @click="emoji">
                        <svg t="1701658883145" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26849" width="200" height="200"><path d="M512 512m-393.846154 0a393.846154 393.846154 0 1 0 787.692308 0 393.846154 393.846154 0 1 0-787.692308 0Z" fill="#BFBFBF" p-id="26850"></path><path d="M469.464615 469.464615m-351.310769 0a351.310769 351.310769 0 1 0 702.621539 0 351.310769 351.310769 0 1 0-702.621539 0Z" fill="#FFFFFF" p-id="26851"></path><path d="M354.461538 615.975385a100.036923 78.769231 90 1 0 157.538462 0 100.036923 78.769231 90 1 0-157.538462 0Z" fill="#808080" p-id="26852"></path><path d="M352.098462 335.556923m-59.076924 0a59.076923 59.076923 0 1 0 118.153847 0 59.076923 59.076923 0 1 0-118.153847 0Z" fill="#808080" p-id="26853"></path><path d="M623.852308 372.578462m-59.076923 0a59.076923 59.076923 0 1 0 118.153846 0 59.076923 59.076923 0 1 0-118.153846 0Z" fill="#808080" p-id="26854"></path><path d="M512 937.353846c-234.732308 0-425.353846-190.621538-425.353846-425.353846s190.621538-425.353846 425.353846-425.353846 425.353846 190.621538 425.353846 425.353846-190.621538 425.353846-425.353846 425.353846z m0-787.692308c-200.073846 0-362.338462 162.264615-362.338462 362.338462s162.264615 362.338462 362.338462 362.338462 362.338462-162.264615 362.338462-362.338462-162.264615-362.338462-362.338462-362.338462z" fill="#7F7F7F" p-id="26855"></path></svg>
                    </li>
                    <li class="iconBox" title="发送图片" @click="sendImage">
                        <svg t="1701658645047" class="icon" viewBox="0 0 1027 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6148" width="200" height="200"><path d="M920.122141 75.836199l-820.906465 0c-50.327222 0-91.27175 40.944528-91.27175 91.27175l0 692.00877c0 50.328245 40.944528 91.27175 91.27175 91.27175l820.906465 0c50.327222 0 91.270726-40.944528 91.270726-91.27175L1011.392868 167.107949C1011.393891 116.780727 970.449363 75.836199 920.122141 75.836199zM99.215676 142.351102l820.906465 0c13.650905 0 24.755824 11.105942 24.755824 24.756847l0 492.720911c-46.914496-72.336492-110.60712-166.954453-145.379065-203.557092-29.553083-31.108508-59.966767-37.638225-80.276325-37.638225-0.00307 0 0.002047 0-0.001023 0-44.896536 0-77.273944 30.226418-83.743286 36.759205-13.08297 12.219299-179.912579 168.045297-200.162786 187.432857-10.619872-11.965519-49.051159-54.918797-86.132706-92.001367-23.834848-23.835871-54.854329-31.725562-87.346347-22.215978-21.236674 6.216585-35.982516 17.84339-38.721907 20.111037l-0.25992 0.214894L74.458829 676.898631l0-509.790682C74.458829 153.457044 85.564771 142.351102 99.215676 142.351102zM920.122141 883.873566l-820.906465 0c-13.650905 0-24.756847-11.106965-24.756847-24.756847l0-92.362594L265.490653 599.998193c2.296299-1.743714 8.968256-6.03546 16.266475-7.891737 8.400321-2.134617 14.120602-0.523933 20.392446 5.749958 39.07904 39.080064 81.20651 86.614683 85.658915 91.651396 4.513804 5.417383 19.348674 20.85805 42.86732 22.494317 12.373819 0.86367 31.051203-1.956561 49.753147-20.276812 9.15859-8.972349 148.204413-138.926096 201.00906-188.242292l0.531096-0.437975 0.800225-0.873903c4.881171-4.882194 20.48352-17.021675 36.46347-17.021675 0.099261 0 0.199545 0 0.298805 0.001023 10.633175 0.101307 21.017686 5.640464 31.746028 16.933671 39.418778 41.494043 146.583496 195.563024 193.60237 267.566942l0 89.465614C944.878988 872.767624 933.773046 883.873566 920.122141 883.873566z" fill="#4C4C4C" p-id="6149"></path><path d="M275.135314 442.432575c52.972469 0 96.067986-43.096541 96.067986-96.067986s-43.095517-96.067986-96.067986-96.067986-96.067986 43.095517-96.067986 96.067986S222.162846 442.432575 275.135314 442.432575zM275.135314 316.810482c16.295128 0 29.553083 13.257955 29.553083 29.553083 0 16.296151-13.257955 29.553083-29.553083 29.553083s-29.553083-13.257955-29.553083-29.553083C245.582231 330.068438 258.840186 316.810482 275.135314 316.810482z" fill="#4C4C4C" p-id="6150"></path></svg>
                    </li>
                    <li class="iconBox" title="发送文件" @click="sendFile">
                        <svg t="1701659527057" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31921" width="200" height="200"><path d="M357.285 86c41.5 0 77.11 25.2 92.347 61.126V143.5h260.02c81.791 0 148.269 65.52 149.59 146.87l0.02 2.47 0.002 6.747C898.87 319.726 926 360.847 926 408.301V803.6c0 73.675-59.759 133.4-133.475 133.4h-619.05C99.76 937 40 877.275 40 803.6V224c0-76.215 61.82-138 138.078-138h179.207z m0.759 59.8H178.078c-42.781 0-77.543 34.315-78.234 76.907l-0.01 1.293v579.6c0 40.242 32.314 72.94 72.424 73.59l1.217 0.01h619.05c40.264 0 72.981-32.296 73.631-72.383l0.01-1.217V408.3c0-33.953-27.265-61.542-61.107-62.09l-1.028-0.01H554.196c-85.562 0-155.085-68.628-156.467-153.813l-0.021-2.586v-3.6c0-22.06-17.69-39.99-39.664-40.401z m155.332 301.584c13.827-13.623 36.03-13.623 49.858 0l141.784 139.693 0.387 0.388c6.526 6.633 9.828 15.263 9.892 23.917v0.845c-0.065 8.824-3.497 17.623-10.28 24.306L563.235 776.225c-13.828 13.624-36.03 13.624-49.858 0a34.49 34.49 0 0 1-0.363-0.362c-13.364-13.565-13.202-35.396 0.363-48.76l89.258-87.941h-320.23c-16.523 0-29.917-13.395-29.917-29.917 0-16.523 13.394-29.917 29.917-29.917h315.033l-84.061-82.821-0.403-0.403c-13.164-13.398-13.19-34.928 0.04-48.357 0.12-0.122 0.241-0.243 0.363-0.363zM709.653 203.3l-251.175 0.001c6.57 46.96 46.921 83.1 95.718 83.1H799.2c-3.275-45.952-41.319-82.333-88.062-83.089l-1.485-0.012z" fill="#333333" p-id="31922"></path></svg>
                    </li>
                    <!-- <li class="iconBox" title="你猜我画" @click="">
                        <svg t="1701661060768" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13285" width="200" height="200"><path d="M550.912 961.536h-3.072c-72.704-1.024-125.952-52.224-145.408-138.24C368.64 671.744 307.2 677.888 222.208 687.104c-49.152 5.12-104.448 11.264-146.432-26.624-33.792-30.72-49.152-81.92-49.152-160.768C26.624 258.048 223.232 61.44 464.896 61.44c193.536 0 366.592 130.048 420.864 316.416 6.144 21.504-6.144 44.032-27.648 51.2-21.504 6.144-44.032-6.144-51.2-27.648-44.032-151.552-184.32-257.024-342.016-257.024-196.608 0-356.352 159.744-356.352 356.352 0 69.632 14.336 93.184 22.528 100.352 14.336 13.312 47.104 9.216 82.944 6.144 87.04-9.216 219.136-23.552 269.312 199.68 16.384 73.728 54.272 73.728 66.56 74.752h1.024C634.88 879.616 768 754.688 808.96 595.968c6.144-21.504 27.648-34.816 50.176-29.696 21.504 6.144 34.816 27.648 29.696 50.176-49.152 185.344-205.824 345.088-337.92 345.088z" fill="#333C4F" p-id="13286"></path><path d="M240.64 458.752m-69.632 0a69.632 69.632 0 1 0 139.264 0 69.632 69.632 0 1 0-139.264 0Z" fill="#333C4F" p-id="13287"></path><path d="M442.368 296.96m-52.224 0a52.224 52.224 0 1 0 104.448 0 52.224 52.224 0 1 0-104.448 0Z" fill="#333C4F" p-id="13288"></path><path d="M658.432 366.592m-43.008 0a43.008 43.008 0 1 0 86.016 0 43.008 43.008 0 1 0-86.016 0Z" fill="#333C4F" p-id="13289"></path><path d="M518.144 654.336c-17.408 0-32.768-10.24-38.912-27.648-7.168-21.504 4.096-45.056 25.6-52.224L946.176 419.84c21.504-7.168 45.056 4.096 52.224 25.6 7.168 21.504-4.096 45.056-25.6 52.224L531.456 652.288c-5.12 1.024-9.216 2.048-13.312 2.048z" fill="#333C4F" p-id="13290"></path></svg>
                    </li> -->
                </ul>
                
            </div>
                <textarea v-model="chatMsg" id="sendTextarea" spellcheck="false" @keyup="sendMsgEnter">
                    
                </textarea>
                <el-button type="success" id="sendMsg" @click="sendMsg">发送</el-button>    
        </div>
        <canvas id="avatar" style="display: none;"></canvas>
    </div>
</template>

<script>
import io from 'socket.io-client'
let sendFileMap = new Map()
let getFileMap = new Map()
let getImageMap = new Map()
class Message{
    constructor({msg,user,avatarURL,file,msgType,img}){
        this.msgType = msgType //消息是发送者还是接收者
        this.msg = msg 
        this.user = user
        this.avatarURL = avatarURL
        this.file = file||''
        this.img = img||''
    } 
}
export default{
    data(){
        return{
            socket:'',
            chatMsg:'',
            chatMsgList:[],
            room:'',
            user:'',
            otherUser:'',
            avatarURL:'',
            emojiList:['&#x1F600','&#x1F604','&#x2764','&#x1F602','&#x1F44F','&#x1F3A7','&#x1F60D','&#x1F4AA','&#x1F4B0','&#x1F618'],
            showEmoji:false,
        }
    },
    methods:{
        /*
            与聊天相关的按钮的点击事件
        */
        fileEnter(e){
            e.preventDefault()
            e.target.style.backgroundColor = 'rgba(100,100,100,0.2)'
        },//文件拖动到到聊天区时触发的事件
        fileLeave(e){
            e.preventDefault()
            e.target.style.backgroundColor = '#f5f5f5'
            let file = e.dataTransfer.files[0]
            this.fileSlice(file)
        },//文件拖动到聊天区后触发的事件
        async createAvatar(){
            let file =await this.getFile()
            let read = new FileReader()
            read.readAsDataURL(file)
            read.onload=((e)=>{
                let url = e.target.result
                let img = new Image()
                img.src = url
                img.onload=()=>{
                    let canvas = document.querySelector('#avatar')
                    let ctx = canvas.getContext('2d')
                    canvas.width= 40
                    canvas.height= 40
                    ctx.drawImage(img,0,0,canvas.width,canvas.height)
                    this.avatarURL = canvas.toDataURL()
                    localStorage.setItem('avatar',this.avatarURL)
                    ctx.clearRect(0,0,canvas.width,canvas.height)
                }
            })
        },
        emoji(){
            this.showEmoji = this.showEmoji?false:true
        },
        clickEmoji(e){
            this.chatMsg += e.target.innerHTML
        },
        async sendImage(){
            let file =await this.getFile({
                type:[{
                    accept:{
                        'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
                    }
                }]
            })
            this.imageSlice(file)
        },
        async sendFile(){
            let file =await this.getFile()
            this.fileSlice(file)
        },
        imageSlice(file){
            let timestamp = Date.now()
            let fileName = file.name
            let type = file.type
            let msg = new Message({
                msgType:'send',
                user:this.user,
                avatarURL:this.avatarURL,
                img:{
                    name:fileName,
                    type,
                    timestamp
                }
            })
            this.chatMsgList.push(msg)
            let readURL = new FileReader()
            let readArrayBuffer = new FileReader()
            readURL.readAsDataURL(file)
            readArrayBuffer.readAsArrayBuffer(file)
            readURL.onload=(e)=>{
                let img = document.querySelector(`#_${timestamp}`)
                img.src = e.target.result
            }
            readArrayBuffer.onload=(e)=>{
                let arrayBuffer = e.target.result
                let type = file.type
                let name = file.name
                let sliceSize = 500*1024 //文件切片大小
                let total = Math.ceil(file.size/sliceSize) //切片众个数
                let size = file.size
                let fileIndex = 0
                let index = 0
                this.socket.emit('uploadImageStart',timestamp,total,file.size,this.room,msg)
                while(fileIndex<size){
                    let arrayBufferUpload = arrayBuffer.slice(fileIndex,fileIndex+sliceSize)
                    this.socket.emit('uploadImage',arrayBufferUpload,index,this.room,total,timestamp,type,name,size)
                    fileIndex+=sliceSize
                    index++
                }   
            }
        },
        fileSlice(file){
            let size
            if(file.size<1024){
                size = file.size+'B'
            }else if(file.size<1024*1024){
                size = (file.size/1024).toFixed(2)+'KB'
            }else if(file.size<1024*1024*1024){
                size = (file.size/(1024*1024)).toFixed(2)+'MB'
            }else{
                size = (file.size/(1024*1024*1024)).toFixed(2)+'GB'
            }
            let timestamp = Date.now()
            let type = file.type
            let fileName = file.name.length>6?file.name.slice(0,6)+'...':file.name
            let read = new FileReader()
            let msg = new Message({
                msgType:'send',
                msg:false,
                user:this.user,
                avatarURL:this.avatarURL,
                file:{
                    name:fileName,
                    type,
                    size,
                    timestamp
                }
            })
            let sliceSize = 500*1024 //文件切片大小
            let total = Math.ceil(file.size/sliceSize) //切片众个数
            this.socket.emit('uploadFileStart',timestamp,total,file.size,this.room,msg)
            this.chatMsgList.push(msg)
            read.readAsArrayBuffer(file)
            read.onload=(e)=>{
                let arrayBuffer = e.target.result
                let fileAllSize = arrayBuffer.byteLength
                let fileSize = 0 //已上传文件的大小
                let index = 0
                while(fileSize<fileAllSize){
                    //每次分割500kb大小的内容然后上传,附上文件名以及每次发送文件片段的位置
                    let arrayBufferUpload = arrayBuffer.slice(fileSize,fileSize+sliceSize) 
                    this.socket.emit('uploadFile',arrayBufferUpload,index,this.room,total,timestamp,file.type,fileName,file.size)
                    fileSize+=sliceSize
                    index++
                }
            }
        }, //大文件切片上传
        /*
            与发送文本相关的函数
        */
        makeText(text){
            let canvas = document.querySelector('#avatar')
            let ctx = canvas.getContext('2d')
            ctx.font = '16px Arial'
            let textList = text.split('\n')
            let list =[]
            let textWidth=''
            let width = 0
            for(let i=0;i<textList.length;i++){
                for(let j=0;j<textList[i].length;j++){
                    textWidth+=textList[i][j]
                    width = ctx.measureText(textWidth).width
                    if(width>200){
                        textWidth.slice(textWidth.length-1)
                        list.push(textWidth)
                        textWidth = textList[i][j]
                    }          
                }
                list.push(textWidth)
                textWidth=''
            }
            return list
        },//将文本分行处理。
        sendMsgEnter(e){
            if(e.keyCode===13) this.sendMsg()
        },
        sendMsg(){
            let text = this.makeText(this.chatMsg)
            this.chatMsg = text
            let msg = new Message({
                msgType:'send',
                msg:this.chatMsg,
                user:this.user,
                avatarURL:this.avatarURL
            })
            this.chatMsgList.push(msg)
            this.socket.emit('sendChatMsg',msg,this.room)
            this.chatMsg=''
        },
        async getFile(option){
            try{
                let filelist = await showOpenFilePicker(option) //会返回一个数组，储存着用户上传的文件
                let file = await filelist[0].getFile() //会返回一个file对象。
                return file
            }catch{

            }
        }
    },
    created(){
        this.socket = io('https://localhost:443')
    },
    mounted(){
        this.user = sessionStorage.getItem('user')
        this.room = sessionStorage.getItem('room')
        this.avatarURL = localStorage.getItem('avatar')
        this.socket.on('getChat',(msg)=>{
            this.chatMsgList.push(msg)
        })
        this.socket.emit('getOtherUser',this.room,this.user)
        this.socket.on('otherUserJoinInRoom',(user)=>{
            this.otherUser = user
        })
        this.socket.on('uploadFileSliceIndex',(index,total,fileName,timestamp)=>{
            let percent = document.querySelector(`#_${timestamp}`)
            let list = sendFileMap.get(timestamp)||[]
            list.push(index)
            sendFileMap.set(timestamp,list)
            let num = (list.length/total).toFixed(2)
            if(list.length<total){
              percent.innerHTML = `上传进度:${num}`
            }else{
              percent.innerHTML = `上传成功`  
              sendFileMap.clear(timestamp)
            }
        }) //这个是发送方发送文件时显示上传到后端的功能
        this.socket.on('sendImage',(arrayBuffer,index,total,timestamp,type,fileName,size)=>{
            let list = getImageMap.get(timestamp)||[]
            list.push({arrayBuffer,index})
            getImageMap.set(timestamp,list)
            if(list.length===total){
                let img = document.querySelector(`#_${timestamp}`)
                list.sort((a,b)=>{a.index-b.index})
                let result = new ArrayBuffer(size)
                let buffer = new Uint8Array(result)
                let offset = 0
                for(let i=0;i<list.length;i++){
                    let bufferView = new Uint8Array(list[i].arrayBuffer)
                    buffer.set(bufferView, offset)
                    offset += list[i].arrayBuffer.byteLength
                }
                let blob = new Blob([result],{type})
                let read = new FileReader()
                read.readAsDataURL(blob)
                read.onload=(e)=>{
                    let url = e.target.result
                    img.src = url
                    getImageMap.delete(timestamp)
                }
            }
        }) //这个是接收方接收图片时显示的功能
        this.socket.on('sendFile',(arrayBuffer,index,total,timestamp,type,fileName,size)=>{
            let percent = document.querySelector(`#_${timestamp}`)
            let list = getFileMap.get(timestamp)||[]
            list.push({arrayBuffer,index})
            getFileMap.set(timestamp,list)
            let num = (list.length/total).toFixed(2)
            if(list.length<total){
              percent.innerHTML = `上传进度:${num}`
            }else{
              let a = document.createElement('a')
              a.download = true
              list.sort((a,b)=>{a.index-b.index})
              let result = new ArrayBuffer(size)
              let buffer = new Uint8Array(result)
              let offset = 0
              for(let i=0;i<list.length;i++){
                let bufferView = new Uint8Array(list[i].arrayBuffer)
                buffer.set(bufferView, offset)
                offset += list[i].arrayBuffer.byteLength
              }
              let blob = new Blob([result],{type})
              let read = new FileReader()
              read.readAsDataURL(blob)
              read.onload=(e)=>{
                let url = e.target.result
                a.href = url
                let user = document.querySelector(`#msg${timestamp}`)
                user.addEventListener('click',()=>{
                    a.click()
                })
              }
              percent.innerHTML = `点击下载`  
              getFileMap.clear(timestamp)
            }
        })//这个是接收方接收文件时显示的功能
        this.socket.on('sendImageStart',(timestamp,total,size,msg)=>{
            this.chatMsgList.push(msg)
        })
        this.socket.on('sendFileStart',(timestamp,total,size,msg)=>{
            this.chatMsgList.push(msg)
        })
        this.socket.emit('userjoinRoom',this.room) //测试用后面要删，没有登录界面所以得加入房间
    }
}
</script>

<style scoped>
#emojiBox{
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    width: 200px;
    height: 200px;
    background-color: white;
    top: -200px;
    left: 80px;
    border-radius: 8px;
    border: 1px solid #E5E9EF;
    box-shadow: 0 11px 12px 0 rgba(106, 115, 133, 0.3);
}
p{
    margin: 0px;
}
#leftMsg{
    display: inline-block;
    width: 100%;
}
#rightMsg{
    display: inline-block;
    width: 100%;
}
#rightUserMsg{
    margin-top: 20px;
    background-color:#95ec69;
    border-radius: 4px;
    padding: 6px;
}
#rightUserFile{
    margin-top: 20px;
    background-color:white;
    border-radius: 8px;
    padding: 16px;
}
#rightUserFile:hover{
    background-color: #ebebeb;
}
#leftUserMsg{
    background-color: white;
    border-radius: 4px;
    padding: 6px;
}
#leftUserFile{
    background-color: white;
    border-radius: 8px;
    padding: 16px;
}
#leftUserFile:hover{
    background-color: #ebebeb;
}
#leftMsgContent{
    font-size: 16px;
    font-family: Arial;
    float: left;
    left: 50px;
}
#rightMsgContent{
    font-size: 16px;
    font-family: Arial;
    float: right;
}
#leftAvatar{
    float: left;
    width: 50px;
    height: 50px;
}
#rightAvatar{
    float: right;
    width: 50px;
    height: 50px;
}
.roomAndUser{
   justify-content: center; 
   align-items: center;
}
.iconBox{
   justify-content: center; 
   align-items: center;
   width: 100%;
   height: 100%;
}
svg{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
}
ul,li{
  margin: 0px;
  list-style: none;
}
ul{
    position: relative;
    display: flex;
    height: 100%;
}
.chatMsgDiv{

}
#sendMsg{
    position: absolute;
    top: 70%;
    left: 85%;
}
#sendButton{
    height: 30%;
}
#sendTextarea{
    font-size: 16px;
    width: 98%;
    height: 65%;
    resize: none;
    outline: none;
    margin: 0px;
    overflow: hidden;
    padding-top: 5px;
    padding-left: 5px;
}
#roomAndUser{
    display: flex;
    background-color: #acd1f5;
    justify-content:center;
    align-items: center;
    height: 5%;
}
#chatContent{
    overflow: scroll;
    background-color:#f5f5f5;
    height: 75%;
}
#send{
    position: relative;
    box-shadow: 0 2px 4px #00000014;
    background-color: white;
    height: 20%;
}
#chat{
    height: 100%;
    width: 100%;
}
</style>