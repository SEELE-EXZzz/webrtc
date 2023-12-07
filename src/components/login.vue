<template>
    <div id="login">
        <div id="top">
            <ul class="roomName">
                房间号:
                <li v-for="room in roomList" :key="room">{{ room }}</li>
            </ul>
        </div>
        <div id="main">
            <div id="form">
                <div>
                    <span class="form">用户:</span><input v-model="userName" class="form" type="text" id="user">   
                </div>
                <div>
                    <span class="form">房间:</span><input v-model="roomNumber" @input="limitRoom" class="form" type="text" id="room">       
                </div>
            </div>
        </div>
        <div id="buttom">
            <button @click="addRoom">加入房间</button>
        </div>
    </div>
</template>
  
<script>
import io from 'socket.io-client'
  export default {
    name: 'login',
    data(){
        return {
            userName:'',
            roomNumber:'',
            socket:'',
            roomList:[],
        }
    },
    methods:{
        limitRoom(){
            let arr = this.roomNumber.match(/[0-9]/g)
            arr = arr?arr.splice(0,3):arr
            let match = arr?arr.join(''):arr
            this.roomNumber = match
        }, //限制房间号在000到999
        addRoom(){
            if(!this.userName||!this.roomNumber) return //如果用户名或者房间号为空就不往下运行
            let user ={
                userName:this.userName,
                roomName:this.roomNumber
            } //获取用户的名字以及房间号
            this.socket.emit('joinRoom',user) //告知服务器是哪个用户加入了那个房间
        }
    },
    created(){
        this.socket = io('localhost:3000')
    },
    mounted(){
        this.socket.on('addNewRoom',(roomName)=>{
            this.roomList.push(roomName)
        }) //如果有用户创建了新的房间就会在列表加入新的房间
        this.socket.on('getRoomList',(roomList)=>{
            this.roomList = roomList
        }) //服务器传来当前的房间列表
        this.socket.on('fullRoom',(msg)=>{
            alert(msg)
        }) //如果某个房间满了就会触发这个
        this.socket.on('joinInRoom',(roomName,roomList)=>{
            localStorage.setItem('room',this.roomNumber)
            localStorage.setItem('user',this.userName)
        })//成功加入房间，路由，启动。
        
    }
  }
</script>

<style scoped>
ul,li{
  margin: 0px;
  list-style: none;
}
button{
    position: absolute;
    background-color: #1352a3;
    width: 120px;
    height: 50px;
    left: 50%;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
}
.roomName{
    display: flex;
}
.form{
    font-size: 32px;
    margin: 20px;
}

ul{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}
li{
    margin-right: 10px;
}
#form{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
    display: flex;
    flex-direction: column;
}
#login{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
    width: 60%;
    height: 50%;
    background-image: linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%);
}
#top{
    position: relative;
    height: 10%;
}
#main{
    position: relative;
    height: 75%;
}
#buttom{
    position: relative;
    height: 15%;
}
</style>