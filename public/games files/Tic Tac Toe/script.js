let music=new Audio("music/music.mp3");
let audioTurn=new Audio("music/ting.mp3");
let gameover=new Audio("music/gameover.mp3");
let turn="X";
let isgameover=false;
let filled=0;
const changeTurn=()=>{
    return turn==="X"?"0":"X";
}
var singlePlayer=true;

var singlePlayerBtn=document.querySelector("#singlePlayerBtn");
var multiPlayer=document.querySelector("#multiPlayer");
var roomInfo=document.querySelector(".roomInfo");
var info=document.getElementsByClassName("info");
var line=document.querySelector(".line");
var boxtext=document.getElementsByClassName('boxtext');
var imgbox=document.querySelector(".imgbox");
var reset=document.getElementById("reset");
var gameContainer=document.querySelector(".gameContainer");
var roomId=document.querySelector("#roomId");

//Function to check for a win
const checkWin=(wmsg)=>{
    music.play();
    music.volume=0.4;
    let wins=[
        [0,1,2,5,5,0],
        [3,4,5,5,15,0],
        [6,7,8,5,25,0],
        [0,3,6,-5,15,90],
        [1,4,7,5,15,90],
        [2,5,8,15,15,90],
        [0,4,8,5,15,45],
        [2,4,6,5,15,135]
    ]
    wins.forEach(e=>{
        if((boxtext[e[0]].innerText===boxtext[e[1]].innerText)&&(boxtext[e[2]].innerText===boxtext[e[1]].innerText)&&
       ( boxtext[e[0]].innerText!=="")){
            if(singlePlayer)
                info[0].innerText=boxtext[e[1]].innerText+" Wins";
            else
                info[0].innerText=wmsg;
            isgameover=true;
            imgbox.getElementsByTagName("img")[0].style.width="200px";
            line.style.transform=`rotate(${e[5]}deg)`;
            line.style.top=`${e[4]}vw`;
            line.style.left=`${e[3]}vw`;
            line.style.width="20vw";
            reset.disabled=false;
            audioTurn.volume=0;
            gameover.play();
       }
    })
}

if(singlePlayer)
    info[0].innerText="Turn for X";

reset.addEventListener('click',()=>{
    if(!singlePlayer)
        socket.emit('reset');
    callReset();
    
})
function callReset(){
    let boxtexts=document.querySelectorAll('.boxtext');
    Array.from(boxtexts).forEach(element=>{
        element.innerText="";
    })
    turn="X";
    isgameover=false;
    // if(!isgameover)
    info[0].innerText="Turn for X";
    imgbox.getElementsByTagName("img")[0].style.width="0px";
    line.style.width="0vw";
    filled =0;
    reset.disabled=true;
}
// Game Logic
function engine(element,message){
    let boxtext=element.querySelector('.boxtext');
    console.log(" turn is "+turn)
    boxtext.innerText=turn;
    turn = changeTurn();
    audioTurn.play();
    var mess;
    var wmsg;
    if(message==0){
        wmsg="Opponent won";
        mess="Your Turn";
    }else{
        wmsg="You won";
        mess="Opponent's Turn";
    }
    checkWin(wmsg);
    filled++;
    if(filled==9&&!isgameover){
        info[0].innerText="Game Drawn";
        isgameover=true; 
        reset.disabled=false;
    }
    
    if(!isgameover){
        if(singlePlayer)
            info[0].innerText="Turn for "+turn;
        else
            info[0].innerText=mess;
    }
           
}

let boxes=document.getElementsByClassName("box");
Array.from(boxes).forEach(element=>{
    let boxtext=element.querySelector('.boxtext');
    element.addEventListener('click',()=>{
        if(boxtext.innerText===''&&!isgameover){
            var data={
                className:element.className.split(" ")[0],
                box: element,
                currTurn:turn
            }
            if(singlePlayer)
                engine(element);
            else
                socket.emit('played',data);
        }
    })
})
multiPlayer.addEventListener('click',()=>{
    callReset();
    singlePlayerBtn.classList.remove("active");
    multiPlayer.classList.add("active");
    roomInfo.style.display="block";
    singlePlayer=false;
    roomId.style.display="block";
    document.querySelector("#youAre").style.display="block";
    document.querySelector(".friendsInfo").style.display="block";
})
singlePlayerBtn.addEventListener('click',()=>{
    callReset();
    multiPlayer.classList.remove("active");
    singlePlayerBtn.classList.add("active");
    roomInfo.style.display="none";
    singlePlayer=true;
    roomId.style.display="none";
    document.querySelector("#youAre").style.display="none";
    document.querySelector(".friendsInfo").style.display="none";
})

function callModal(ele,text){
    gameContainer.style.filter="blur(3px)"
    gameContainer.style.pointerEvents="none"
    document.querySelector(".menu-bar").innerHTML+=`<div class="modal">
                                                    <h4>${text}</h4>
                                                    <input id="${ele}Room" placeholder="Enter room name" type="text" />
                                                    <input id="yourName" placeholder="Enter Your Name" type="text" />
                                                    <div class="actionButtons">
                                                        <button id="${ele}">${ele}</button>
                                                        <button id="cancel">Cancel</button>
                                                    </div>
                                                </div>`;
}

function callCancel(){
    document.querySelector(".modal").remove();
    gameContainer.style.filter="none"
    gameContainer.style.pointerEvents="all";
}

hostBtn.addEventListener('click',()=>{
    console.log("coming");
    callModal('Host','Make a room Id');
    document.querySelector("#Host").addEventListener('click',()=>{
        var newRoom=document.querySelector("#HostRoom").value;
        if(newRoom==='')
            alert("Please Enter Room Name");
        else{
            socket.emit('make room',newRoom);
        }
    })
    document.querySelector("#cancel").addEventListener('click',()=>{
        callCancel();
    });
    info[0].innerText="Your Turn";
});

joinBtn.addEventListener('click',()=>{
    callModal('Join','Join a room :');
    
    document.querySelector("#Join").addEventListener('click',()=>{
        var joinRoom=document.querySelector("#JoinRoom").value;
        var yourName=document.querySelector("#yourName").value;
        var data={
            roomName:joinRoom,
            userName:yourName,
            token:"0"
        }        
        document.querySelector("#youAre").innerHTML=`You Are '0'`;
        socket.emit('join room',data);
    })
    
    document.querySelector("#cancel").addEventListener('click',()=>{
        callCancel();
    });
    info[0].innerText="Opponent's Turn";
});

function home(){
    location.href = '/';
}


socket.on('played',data=>{
    let element=document.querySelector(`.${data.className}`);
    engine(element,0);
})

socket.on('join',data=>{
    user.push(data.userId);
    console.log("Hey, Play with me "+data.userid);
})

socket.on('returnplayed', function(data) {
    let element=document.querySelector(`.${data.className}`);
    if(data.status==="OK"){
        engine(element,1);
    }else{
        alert("This is not your turn . Keep Patience ! ")
    }
  });

socket.on('return', function(data) {
    alert(data);
  });

  socket.on('returnHostDiss', function(data) {
    alert(data);
    location.reload();
  });
  socket.on('resetData', function(data) {
    callReset();
  });
  socket.on('returnJoinAllFriends', function(data) {
    document.querySelector(".friends").innerHTML="";
    for(var i=0;i<data.users.length;i++){
        var li=document.createElement("li");
        li.innerHTML=data.users[i].name;
        document.querySelector(".friends").appendChild(li); 
    }
  });
  socket.on('returnJoin', function(data) {
    callCancel();
    roomId.innerHTML=`Room Id : ${data}`;
    roomId.style.display="block";
  });

socket.on('returnMakeRoom', function(newRoom) {
    var yourName=document.querySelector("#yourName").value;
    // if(yourName==''){
    //     yourName=getRandomName();
    // }
    var data={
        roomName:newRoom,
        userName:yourName,
        token:"X"
    }
    document.querySelector("#youAre").innerHTML=`You Are 'X'`;
    socket.emit('join room',data);
  });
