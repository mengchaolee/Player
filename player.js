var myAudio = document.getElementById("myAudio");
var funcBtn = document.getElementById("funcBtn");
var volRangeBar = document.getElementById("volControl").children[0];
var volValue = document.getElementById("volControl").children[3];
var info = document.getElementById("info");
var progressBar = document.getElementById("progressBar");
var musicPool = document.getElementById("musicPool");
var bookSource = document.getElementById("book").children[0];
var bookTarget = document.getElementById("book").children[1];
var info2 = document.getElementById("info2");

setVolumeByRangeBar();  //一開始的初始音量設定

var audioSource = myAudio.children[0];
var ProgreesTask_ID;  //這個變數是用來存放Progrees的任務ID
var btnStatus = "";
var btnLoop = funcBtn.children[7];
var btnRandom = funcBtn.children[8];
var btnAllLoop = funcBtn.children[9];




//模組化設計
//更新歌單
function updateMusic(){
    for(var i=musicPool.options.length-1;i>=0;i--){
        musicPool.remove(i);
    }


    for (var i = 0; i < bookTarget.children.length; i++) {
        var option = document.createElement("option");
        option.value = bookTarget.children[i].title; //歌曲的路徑
        option.innerText = bookTarget.children[i].innerText; //歌名
        musicPool.appendChild(option);
    }
    changeMusic(0);
}
//初始化音樂庫
function InitMusicPool() {
    
    for (var i = 0; i < bookSource.children.length; i++) {
        var option = document.createElement("option");
        bookSource.children[i].id="song"+(i+1);
        bookSource.children[i].draggable="true";
        bookSource.children[i].ondragstart=drag;
        option.value = bookSource.children[i].title; //歌曲的路徑
        option.innerText = bookSource.children[i].innerText; //歌名
        musicPool.appendChild(option);
    }
    changeMusic(0);
}
InitMusicPool();

//====drag & drop的功能區=====
function allowDrop(ev) {
    ev.preventDefault();//放棄物件預設行為
}

function drag(ev) {
    ev.dataTransfer.setData("a", ev.target.id);  //抓取正要拖曳的物件
}

function drop(ev) {
    ev.preventDefault();//放棄物件預設行為
    var data = ev.dataTransfer.getData("a");
    if(ev.target.id=="")
        ev.target.appendChild(document.getElementById(data));
    else
        ev.target.parentNode.appendChild(document.getElementById(data));
}
//====drag & drop的功能區 end=====
//開啟或關閉我的歌本
function showBook(){
    book.className=book.className==""?"hide":"";
}
//隨機、單曲、全曲循環的控制
function setFuncBtnStatus(evt) {

    console.log(evt.target);
    //myAudio.loop = false;
    btnStatus = btnStatus == evt.target.innerText ? "" : evt.target.innerText;


    btnLoop.className = "";
    btnRandom.className = "";
    btnAllLoop.className = "";

    evt.target.className = btnStatus == evt.target.innerText ? "funcBtnSytle" : "";

    
   
}


//用下拉選單換歌

function changeMusic(n) {
    console.log(n);

    //1.抓到使用者選下拉選單中的哪一首歌曲
    audioSource.src = musicPool.options[musicPool.selectedIndex + n].value;      //歌曲路徑
    audioSource.title = musicPool.options[musicPool.selectedIndex + n].innerText;  //歌名
    musicPool.options[musicPool.selectedIndex + n].selected = true;
    myAudio.load();

    clearInterval(ProgreesTask_ID);

    if (funcBtn.children[0].innerText == ";")
        myAudio.onloadeddata = playMusic; //call back function

}



//時間格式顯示格式
function getTimeFormat(n) {
    var sec = Math.floor(n % 60);  //計算秒數
    var min = Math.floor(n / 60);  //計算分

    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    return min + ":" + sec;
}

//指定音樂進度條
function setProgress() {
    myAudio.currentTime = progressBar.value / 1000;  //指定播放進度給audio

}

//音樂播放時間顯示,音樂進度條讀取
function getProgress() {

    var w = myAudio.currentTime / myAudio.duration * 100;
    progressBar.value = myAudio.currentTime * 1000;
    progressBar.style.backgroundImage = "-webkit-linear-gradient(left, rgb(167, 0, 0),rgb(167, 0, 0) " + w + "%,  rgb(230, 230, 230) " + w + "% ,rgb(230, 230, 230))";

    info.children[1].innerText = getTimeFormat(myAudio.currentTime) + " / " + getTimeFormat(myAudio.duration);


    //如果歌曲播完,換播下一首歌
    if (myAudio.currentTime == myAudio.duration) {
        
        if (btnLoop.className == "funcBtnSytle") {

            changeMusic(0);
        
           
        }
        else if (btnRandom.className == "funcBtnSytle") {
            //亂數函數
            var r = Math.floor(Math.random() * musicPool.options.length);  //取0-4的隨機值
            r = r - musicPool.selectedIndex;
            changeMusic(r);
        }

        else if (musicPool.selectedIndex==musicPool.options.length-1) {
            if(btnAllLoop.className == "funcBtnSytle"){
                changeMusic(0-musicPool.selectedIndex);
        } 
            else 
            stopMusic();
        }

        else {
            changeMusic(1);
        }
    }

}



//音量調整
function setVolumeByRangeBar() {
    myAudio.volume = volRangeBar.value / 100;  //指定音量大小給audio
    volValue.value = volRangeBar.value;
    volRangeBar.style.backgroundImage = "-webkit-linear-gradient(left, rgb(255, 152, 35),rgb(255, 152, 35) " + volRangeBar.value + "%,  rgb(218, 216, 216) " + volRangeBar.value + "% ,rgb(218, 216, 216))";
}

//音量大小微調
function setVolume(n) {
    volRangeBar.value = parseInt(volRangeBar.value) + n;
    setVolumeByRangeBar()
}

//靜音
function setMuted() {
    myAudio.muted = !myAudio.muted;
    
}

//快轉倒轉
function changeTime(t) {
    myAudio.currentTime += t;
}





//播放音樂
function playMusic() {
    myAudio.play();
    statusChange(";", pauseMusic, "現正播放" + audioSource.title);

    //一開始呼叫
    //T1_ID = setInterval(getDuration, 1000);  //無限次的每隔一秒呼叫getDuration()     //getDuration();
    ProgreesTask_ID = setInterval(getProgress, 50);    //無限次的每隔0.005秒呼叫getProgress()  //getProgress();
    progressBar.max = myAudio.duration * 1000;
    console.log(progressBar.max);

}


//音樂暫停
function pauseMusic() {
    myAudio.pause();
    //clearInterval(T1_ID);
    clearInterval(ProgreesTask_ID);
    statusChange("4", playMusic, audioSource.title + "(暫停中)");
}

//音樂停止
function stopMusic() {
    myAudio.pause();
    myAudio.currentTime = 0;
    //clearInterval(T1_ID);
    clearInterval(ProgreesTask_ID);
    statusChange("4", playMusic, "音樂停止");
}

 //單曲循環
 function loopMusic() {
    myAudio.pause(btnLoop);
    info2.innerText = "單曲循環";
}


//播放鈕及資訊看板狀態判斷處理
function statusChange(text, func, infoText) {
    funcBtn.children[0].innerText = text;
    funcBtn.children[0].onclick = func;
    info.children[0].innerText = infoText;
}

