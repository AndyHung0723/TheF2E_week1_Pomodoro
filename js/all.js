// init
var data = [{index:"1", content:"寫 HTML", completePomoNum:"3", status: "running", date: "2019.7.14"},
{index:"2", content:"寫 CSS", completePomoNum:"0", status: "incomplete", date: "2019.7.15"},
{index:"3", content:"寫 JavaScript", completePomoNum:"0", status: "incomplete", date: "2019.7.16"},
{index:"4", content:"寫 Python", completePomoNum:"0", status: "incomplete", date: "2019.7.17"}];
// 存入 localStorage 中
localStorage.setItem('data', JSON.stringify(data));
// 設定 toDoList 畫面
setToDoList();

/************  VIEW  ************/
// 設定 toDoList 畫面
function setToDoList() {
    var current_jobContent = document.querySelector('.task-info .task-content .task-content__text');
    var current_inner_jobContent = document.querySelector('.todo-list-page .task-content .task-content__text');
    var current_jobCompleteRound = document.querySelector('.task-info .complete-icons');
    var isRunning = false;
    var count = 3;
    // 讀取 data
    var data = JSON.parse(localStorage.getItem('data'));
    var waitJob = document.querySelector('.waiting-task__ul');
    // 先清空
    current_jobContent.textContent = '';
    current_inner_jobContent.textContent = '';
    current_jobCompleteRound.innerHTML = '';
    waitJob.innerHTML = "";

    for(var i = 0 ; i < data.length ; i++) {
        // 顯示正在執行的蕃茄鐘
        if(data[i].status == "running") {
            // 寫值
            current_jobContent.textContent = data[i].content;
            current_inner_jobContent.textContent = data[i].content;
            current_jobContent.setAttribute('data-index', data[i].index);
            current_inner_jobContent.setAttribute('data-index', data[i].index);
            for(var j = 0 ; j < data[i].completePomoNum ; j++) {
                var el_i = document.createElement('i');
                el_i.setAttribute('class', 'material-icons complete-icon complete-icon--blue'); 
                el_i.textContent = 'brightness_1';
                current_jobCompleteRound.appendChild(el_i);
            }
            isRunning = true;
        }else if(data[i].status == "incomplete"){
        // 顯示待辦的蕃茄鐘
            var wait_uncheck_icon = document.createElement('i');
            wait_uncheck_icon.setAttribute('class', 'material-icons unchecked-icon unchecked-icon--sm unchecked-icon--blue'); 
            wait_uncheck_icon.textContent = 'radio_button_unchecked';
            var wait_play_icon = document.createElement('i');
            wait_play_icon.setAttribute('class', 'material-icons play-icon play-icon--blue'); 
            wait_play_icon.textContent = 'play_circle_outline';
            var content_li = document.createElement('li');
            var content_div = document.createElement('div');
            var content = document.createElement('h2'); 
            content.textContent = data[i].content;
            content.setAttribute('class', 'task-content__text');
            content.setAttribute('data-index', data[i].index);
            content_div.setAttribute('class', 'task-content');
            content_div.appendChild(wait_uncheck_icon);
            content_div.appendChild(content);
            content_li.setAttribute('class', 'waiting-task-list');
            content_li.appendChild(content_div);
            content_li.appendChild(wait_play_icon);
            waitJob.appendChild(content_li);
        }
        count--;
        if(count < 0) {
            break;
        }
    }
    // 如果沒有正在執行的任務，抓非完成的第一筆
    if(!isRunning) {
        data[0].status = 'running';
        current_jobContent.textContent = data[0].content;
        current_inner_jobContent.textContent = data[0].content;
        current_jobContent.setAttribute('data-index', data[0].index);
        current_inner_jobContent.setAttribute('data-index', data[0].index);
        for(var j = 0 ; j < data[0].completePomoNum ; j++) {
            var el_i = document.createElement('i');
            el_i.setAttribute('class', 'material-icons complete-icon complete-icon---blue'); 
            el_i.textContent = 'brightness_1';
            current_jobCompleteRound.appendChild(el_i);
        }
        // 從 toDoList 中移除
        document.querySelector('.waiting-task [data-index="'+data[0].index+'"]').parentElement.parentElement.remove();
        localStorage.setItem('data', JSON.stringify(data));
        // 重新渲染畫面
        setToDoList();
    }
    // 等待中任務事件
    document.querySelectorAll('.left-content .waiting-task ul li').forEach((item, idx) => {
        // 任務完成
        item.querySelector('i').addEventListener('click', (e) => {
            var data = JSON.parse(localStorage.getItem('data'));
            if(localStorage.getItem('complete_data') != "" && localStorage.getItem('complete_data') != undefined && localStorage.getItem('complete_data') != null) {
                var complete_data = JSON.parse(localStorage.getItem('complete_data'));
            }else {
                var complete_data = [];
            }
            var index = e.target.nextSibling.dataset.index;
            for(var i = 0 ; i < data.length ; i++) {
                if(data[i].index == index) {
                    data[i].status = 'complete';
                    complete_data.push(data[i]);
                    data.splice(i,1);
                }
            }
            localStorage.setItem('data', JSON.stringify(data));
            localStorage.setItem('complete_data', JSON.stringify(complete_data));
            // 重新渲染畫面
            setToDoList();
        });
        // 等待中轉為進行中
        item.querySelector('i:last-child').addEventListener('click', (e) => {
            // 若還在計時，將它停止
            changeColorAndStatus('work-stop', '#FFEDF7', '#FF4384', 'add-task__input add-task__input--red');
            changeShowIcon('work-run');
            restartCountDown();
            var index = e.target.parentElement.querySelector('h2').dataset.index;
            var data = JSON.parse(localStorage.getItem('data'));
            for(var i = 0 ; i < data.length ; i++) {
                if(data[i].index == index) {
                    // 將 incomplete 改為 running
                    data[i].status = 'running';
                }else if(data[i].status == 'running') {
                    // 將 running 改為 incomplete
                    data[i].status = 'incomplete';
                }
            }
            localStorage.setItem('data', JSON.stringify(data));
            // 重新渲染畫面
            setToDoList();
        });
    });
    
} 
// 顯示 List
function renderSpecificList(container, status, count) {
    var data = status == 'complete' ? JSON.parse(localStorage.getItem('complete_data')) : JSON.parse(localStorage.getItem('data'));
    var length = (count == undefined || count == null || count > data.length) ? data.length : count;
    for(var i = 0 ; i < length ; i++) {
        if(data[i].status == status) {
            var content_li = document.createElement('li');
            var content_div = document.createElement('div');
            var content = document.createElement('h2'); 
            content.textContent = data[i].content;
            content.setAttribute('data-index', data[i].index);
            content.setAttribute('class', 'task-content__text');
            content_div.setAttribute('class', 'task-content');
            content_li.setAttribute('class', 'waiting-task-list');

            if(status == 'complete') {
                var status_icon = document.createElement('i');
                status_icon.setAttribute('class', 'material-icons checked-icon checked-icon--sm checked-icon--white'); 
                status_icon.textContent = 'check_circle_outline';
                var play_div = document.createElement('div');
                play_div.setAttribute('class', 'complete-icons');
                for(var j = 0 ; j < data[i].completePomoNum ; j++) {
                    var el = document.createElement('i');
                    el.setAttribute('class', 'material-icons complete-icon complete-icon--white'); 
                    el.textContent = 'brightness_1';
                    play_div.appendChild(el);
                }
                content_div.appendChild(status_icon);
                content_div.appendChild(content);
                content_li.appendChild(content_div);
                content_li.appendChild(play_div);
            }else {
                var status_icon = document.createElement('i');
                status_icon.setAttribute('class', 'material-icons unchecked-icon unchecked-icon--sm unchecked-icon--white'); 
                status_icon.textContent = 'radio_button_unchecked';
                var play_icon = document.createElement('i');
                play_icon.setAttribute('class', 'material-icons play-icon play-icon--white'); 
                play_icon.textContent = 'play_circle_outline';
                content_div.appendChild(status_icon);
                content_div.appendChild(content);
                content_li.appendChild(content_div);
                content_li.appendChild(play_icon);
            }

            
            container.appendChild(content_li);
        }
    }
}
// 改變顏色與狀態
function changeColorAndStatus(status, bgColor, textColor, className) {
    document.querySelector('.left-content').style.background = bgColor;
    document.querySelector('.add-task').style.color = textColor;
    document.querySelector('.add-task .add-task__input').setAttribute('class', className);
    document.querySelector('.add-task .add-task__icon').style.color = textColor;
    document.querySelector('.remain-time h2').style.color = textColor;
    document.querySelector('.timing').style.borderColor = textColor;
    document.querySelector('.timing-inner').style.borderColor = textColor;
    document.querySelector('.timing-inner .status-icon').style.color = textColor;
    document.querySelector('.timing-inner .status-icon').dataset.status = status;
}
// 改變畫面
function changeShowIcon(status) {
    if(status == "work-stop") {
        var st = "work-run";
        var color = "#FF4384";
        var bgColor = "#FFFFFF";
        var iconColor = "#FF4384";
        var icon = "pause_circle_filled";
    }else if(status == "break-stop"){
        var st = "break-run";
        var color = "#00A7FF";
        var bgColor = "#FFFFFF";
        var iconColor = "#00A7FF";
        var icon = "pause_circle_filled";
    }else if(status == "work-run"){
        var st = "work-stop";
        var color = "#FF4384";
        var bgColor = "#FF4384";
        var iconColor = "#FFFFFF";
        var icon = "play_circle_filled";
    }else if(status == "break-run"){
        var st = "break-stop";
        var color = "#00A7FF";
        var bgColor = "#00A7FF";
        var iconColor = "#FFFFFF";
        var icon = "play_circle_filled";
    }
    document.querySelector('.timing-inner .status-icon-link').innerHTML = '<i class="material-icons status-icon" data-status="' + st + '">' + icon + '</i>';
    document.querySelector('.timing-inner').style.background = bgColor;
    document.querySelector('.timing-inner').style.borderColor = color;
    document.querySelector('.timing-inner .status-icon').style.color = iconColor;
}

/************  Model  ************/
// 重新計時
function restartCountDown() {
    for (var i = 1; i < 99999; i++) window.clearInterval(i);
    var status = document.querySelector('.timing-inner .status-icon').dataset.status;
    if(status == "work-stop") {
        document.querySelector('.todo-list-page .remain-time h2').innerHTML = '25:00';
        document.querySelector('.remain-time h2').innerHTML = '25:00';
    }else {
        document.querySelector('.todo-list-page .remain-time h2').innerHTML = '05:00';
        document.querySelector('.remain-time h2').innerHTML = '05:00';
    }
    // 移除進行中 icon
    if(document.querySelector('.time-icon') != null) {
        document.querySelector('.time-icon').remove();
    }
}

// 點擊倒數計時
document.querySelector('.timing-inner .status-icon-link').addEventListener('click', () => {
    // 判斷是開始還是暫停
    var status = document.querySelector('.timing-inner .status-icon').dataset.status;
    if(status.indexOf('stop') != -1) {
         // 加上開始圖形
         var completeRound = document.querySelector('.task-info .complete-icons');
        if(completeRound.childNodes.length != 0) {
            if(completeRound.childNodes[completeRound.childElementCount-1].textContent != 'access_time') {
                var el_i = document.createElement('i');
                el_i.setAttribute('class', 'material-icons time-icon time-icon--red'); 
                el_i.textContent = 'access_time';
                completeRound.appendChild(el_i);
            }
        }
        // 計算目前剩餘時間
        var current = document.querySelector('.remain-time h2');
        var current_inner = document.querySelector('.todo-list-page .half-circle .remain-time .remain-time__text');
        var min = current.textContent.split(":")[0];
        var sec = current.textContent.split(":")[1];
        var totalSecond = parseInt(min*60) + parseInt(sec);
        if(min == 0 || min < 10) min = "0" + min;
        if(sec == 0 || sec < 10) sec = "0" + sec;
        if(min == "") min = "00";

        var timeoutID = window.setInterval(function() {
            status = document.querySelector('.timing-inner .status-icon').dataset.status;
            totalSecond--;
            var min_show = Math.floor(totalSecond / 60)
            var sec_show = (totalSecond % 60);
            if(min_show == 0 || min_show < 10) min_show = "0" + min_show
            if(sec_show == 0 || sec_show < 10) sec_show = "0" + sec_show;
            current.textContent =  min_show + ":" + sec_show; 
            current_inner.textContent = min_show + ":" + sec_show;
            // 撥放提示鈴聲
            var work_alert = localStorage.getItem('work-alert');
            var break_alert = localStorage.getItem('break-alert');
            if(totalSecond == 0) {
                if(status == 'work-run') {
                    if(work_alert == 'ALARM') {
                        var audio = new Audio('music/Alarm_Clock.mp3');
                        audio.play();
                    }
                } else {
                    if(break_alert == 'ALARM') {
                        var audio = new Audio('music/Alarm_Clock.mp3');
                        audio.play();
                    }
                }
            }
            if(totalSecond == -1) {
                if(status == 'work-run') {
                    // 變為五分鐘休息
                    totalSecond = 300;
                    document.querySelector('.remain-time h2').innerHTML = '05:00';
                    current_inner.textContent = '05:00';
                    // 改變顏色與狀態
                    changeColorAndStatus('break-run', '#E5F3FF', '#00A7FF', 'add-task__input add-task__input--blue');
                    // 改變開始圖形
                    var completeRound = document.querySelector('.task-info .complete-icons');
                    completeRound.childNodes[completeRound.childElementCount-1].textContent = 'brightness_1';
                    completeRound.childNodes[completeRound.childElementCount-1].setAttribute('class', 'material-icons complete-icon complete-icon--blue'); 
                    // 將資料新增 1 round
                    var data = JSON.parse(localStorage.getItem('data'));
                    var index = document.querySelector('.processing-task .task-content .task-content__text').dataset.index;
                    for(var i = 0 ; i < data.length ; i++) {
                        if(data[i].index == index) {
                            data[i].completePomoNum++;
                        }
                    }
                    localStorage.setItem('data', JSON.stringify(data));
                }else {
                    // 停止計時
                    clearInterval(timeoutID);
                    // 改變為25分鐘
                    document.querySelector('.remain-time h2').innerHTML = '25:00';
                    // 改變顏色
                    changeColorAndStatus('work-stop', '#FFEDF7', '#FF4384', 'add-task__input add-task__input--red');
                    // 改變圖形
                    document.querySelector('.timing-inner .status-icon-link').innerHTML = '<i class="material-icons" data-status="work-stop">play_circle_filled</i>';
                    document.querySelector('.timing-inner').style = 'background-color: #FF4384;';
                }
            }
        }, 1000);
        // 改變圖形
        changeShowIcon(status);
    }else {
        for (var i = 1; i < 99999; i++) window.clearInterval(i);
        // 改變圖形
        changeShowIcon(status);
    }  
});

// 點擊重新計時
document.querySelector('.stop').addEventListener('click', () => {
    restartCountDown();
});

// 新增任務
document.querySelector('.add-task .add-task__icon-link').addEventListener('click', () => {
    var data = JSON.parse(localStorage.getItem('data'));
    var index = parseInt(data[data.length-1].index) + 1;
    var today = new Date();
    var mission = {};
    mission.index = index.toString();
    mission.content = document.querySelector('.add-task .add-task__input').value;
    mission.completePomoNum = '0';
    mission.status = 'incomplete';
    mission.date = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate();
    data.push(mission);
    localStorage.setItem('data', JSON.stringify(data));
    // 重新渲染畫面
    setToDoList();
    // 清空輸入框
    document.querySelector('.add-task .add-task__input').value = '';
});

// 任務完成
document.querySelector('.task-info .unchecked-icon').addEventListener('click', () => {
    // 若還在計時，將它停止
    changeColorAndStatus('work-stop', '#FFEDF7', '#FF4384', 'add-task__input add-task__input--red');
    changeShowIcon('work-run');
    restartCountDown();
    var data = JSON.parse(localStorage.getItem('data'));
    if(localStorage.getItem('complete_data') != "" && localStorage.getItem('complete_data') != undefined && localStorage.getItem('complete_data') != null) {
        var complete_data = JSON.parse(localStorage.getItem('complete_data'));
    }else {
        var complete_data = [];
    }
    var index = document.querySelector('.task-info .task-content .task-content__text').dataset.index;
    for(var i = 0 ; i < data.length ; i++) {
        if(data[i].index == index) {
            data[i].status = 'complete';
            complete_data.push(data[i]);
            data.splice(i,1);
        }
    }
    localStorage.setItem('data', JSON.stringify(data));
    localStorage.setItem('complete_data', JSON.stringify(complete_data));
    // 重新渲染畫面
    setToDoList();
});

// 切換到 To-Do List 畫面
function showToDoListPage() {
    var status = document.querySelector('.timing-inner .status-icon').dataset.status;
    // 將指定頁面 show 出來
    var toDoList_content = document.querySelector('.center-content__todo-list');
    var analytics_content = document.querySelector('.center-content__analytics');
    var music_content = document.querySelector('.center-content__music');
    toDoList_content.style.display = 'initial';
    analytics_content.style.display = 'none';
    music_content.style.display = 'none';
    // 內部 menu 反白
    document.querySelector('.todo-list-page .todo-list .menu-item__link').classList.add('menu-item__link--hover');
    document.querySelector('.todo-list-page .todo-list .menu-item__icon').classList.add('menu-item__icon--hover'); 
    // 顯示 TO-DO 清單
    document.querySelector('.todo-block ul').innerHTML = '';
    renderSpecificList(document.querySelector('.todo-block ul'), 'incomplete', 7);
    // 顯示 DONE 清單
    document.querySelector('.done-block ul').innerHTML = '';
    renderSpecificList(document.querySelector('.done-block ul'), 'complete', 7);
    // 下拉選單動態
    document.querySelectorAll('.list-block .title').forEach((item, idx) => {
        item.addEventListener('click',() => {
            if(item.nextElementSibling.style.display == 'none') {
                item.querySelector('.title__icon').textContent = 'expand_less';
                item.nextElementSibling.style.display = 'block';
            }else {
                item.querySelector('.title__icon').textContent = 'expand_more';
                item.nextElementSibling.style.display = 'none';
            }
        });
    });
    /*** 事件區 ***/
    // 新增任務
    document.querySelector('.center-content .add-task .add-task__icon-link').addEventListener('click', () => {
        var data = JSON.parse(localStorage.getItem('data'));
        var index = data[data.length-1].index + 1;
        var mission = {};
        mission.index = index;
        mission.content = document.querySelector('.add-task .add-task__input').value;
        mission.completePomoNum = 0;
        mission.status = 'incomplete';
        data.push(mission);
        localStorage.setItem('data', JSON.stringify(data));
        // 顯示 TO-DO 清單
        document.querySelector('.todo-block ul').innerHTML = '';
        renderSpecificList(document.querySelector('.todo-block ul'), 'incomplete', 7);
        // 清空輸入框
        document.querySelector('.add-task .add-task__input').value = '';
    });
}
// 切換到 To-Do List 畫面 -- 外層
document.querySelector('.todo-list').addEventListener('click', () => {
    // 將整個頁面移動過來
    var toDoListMenu = document.querySelector('.todo-list-page');
    toDoListMenu.style.right = '0';
    showToDoListPage();
});
// 切換到 To-Do List 畫面 -- 內部
document.querySelector('.todo-list-page .todo-list .menu-item__link').addEventListener('click', () => {
    // 內部 menu 還原
    document.querySelector('.todo-list-page .todo-list .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .todo-list .menu-item__icon').classList.remove('menu-item__icon--hover');
    document.querySelector('.todo-list-page .analyze .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .analyze .menu-item__icon').classList.remove('menu-item__icon--hover');
    document.querySelector('.todo-list-page .music .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .music .menu-item__icon').classList.remove('menu-item__icon--hover');
    showToDoListPage();
});

// 切換到 analytics 畫面
function showAnalyzePage() {
    // 將指定頁面 show 出來
    var toDoList_content = document.querySelector('.center-content__todo-list');
    var analytics_content = document.querySelector('.center-content__analytics');
    var music_content = document.querySelector('.center-content__music');
    toDoList_content.style.display = 'none';
    analytics_content.style.display = 'initial';
    music_content.style.display = 'none';
    // 內部 menu 反白
    document.querySelector('.todo-list-page .analyze .menu-item__link').classList.add('menu-item__link--hover');
    document.querySelector('.todo-list-page .analyze .menu-item__icon').classList.add('menu-item__icon--hover');
    // 產生報表
    var today = new Date();
    generateChart(getNearlyWeekDate(today.getFullYear()+"/"+(today.getMonth()+1)+"/"+today.getDate()));
    // 計算今日完成數量與本週完成數量
    var complete_data = JSON.parse(localStorage.getItem('complete_data'));
    var today_count = 0;
    var week_count = 0;
    var weekAry = getNearlyWeekDate(today.getFullYear()+"/"+(today.getMonth()+1)+"/"+today.getDate());
    var todayStr = today.getFullYear()+"."+(today.getMonth()+1)+"."+today.getDate();
    for(var i = 0 ; i < complete_data.length ; i++) {
        if(complete_data[i].date == todayStr) {
            today_count++;
        }
        if(weekAry.indexOf(complete_data[i].date) != -1) {
            week_count++;
        }
    }
    document.querySelector('.today .count-info__num').textContent = today_count;
    document.querySelector('.week .count-info__num').textContent = week_count;
}
// 切換到 analytics 畫面 -- 外層
document.querySelector('.analyze').addEventListener('click', () => {
    // 將整個頁面移動過來
    var toDoListMenu = document.querySelector('.todo-list-page');
    toDoListMenu.style.right = '0';
    showAnalyzePage();
});
// 切換到 analytics 畫面 -- 內部
document.querySelector('.todo-list-page .analyze .menu-item__link').addEventListener('click', () => {
    // 內部 menu 還原
    document.querySelector('.todo-list-page .todo-list .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .todo-list .menu-item__icon').classList.remove('menu-item__icon--hover');
    document.querySelector('.todo-list-page .analyze .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .analyze .menu-item__icon').classList.remove('menu-item__icon--hover');
    document.querySelector('.todo-list-page .music .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .music .menu-item__icon').classList.remove('menu-item__icon--hover');
    showAnalyzePage();
});

// 切換到 music 畫面
function showMusicPage() {
    // 將指定頁面 show 出來
    var toDoList_content = document.querySelector('.center-content__todo-list');
    var analytics_content = document.querySelector('.center-content__analytics');
    var music_content = document.querySelector('.center-content__music');
    toDoList_content.style.display = 'none';
    analytics_content.style.display = 'none';
    music_content.style.display = 'initial';
    // 內部 menu 反白
    document.querySelector('.todo-list-page .music .menu-item__link').classList.add('menu-item__link--hover');
    document.querySelector('.todo-list-page .music .menu-item__icon').classList.add('menu-item__icon--hover');
    // 預設鈴聲
    var work_alert = localStorage.getItem('work-alert');
    var break_alert = localStorage.getItem('break-alert');
    var work_icon = document.querySelector('.work-block .' + work_alert.toLowerCase() + ' .work-icon');
    work_icon.textContent = 'radio_button_checked';
    work_icon.classList.remove('unchecked-icon--white');
    work_icon.classList.add('unchecked-icon--red');
    var break_icon = document.querySelector('.break-block .' + break_alert.toLowerCase() + ' .break-icon');
    break_icon.textContent = 'radio_button_checked';
    break_icon.classList.remove('unchecked-icon--white');
    break_icon.classList.add('unchecked-icon--red');
}
// 切換到 music 畫面 -- 外層
document.querySelector('.music').addEventListener('click', () => {
    // 將整個頁面移動過來
    var toDoListMenu = document.querySelector('.todo-list-page');
    toDoListMenu.style.right = '0';
    showMusicPage();
});
// 切換到 music 畫面 -- 內部
document.querySelector('.todo-list-page .music .menu-item__link').addEventListener('click', () => {
    // 內部 menu 還原
    document.querySelector('.todo-list-page .todo-list .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .todo-list .menu-item__icon').classList.remove('menu-item__icon--hover');
    document.querySelector('.todo-list-page .analyze .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .analyze .menu-item__icon').classList.remove('menu-item__icon--hover');
    document.querySelector('.todo-list-page .music .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .music .menu-item__icon').classList.remove('menu-item__icon--hover');
    showMusicPage();
});

// 取得指定日期一周時間
function getNearlyWeekDate(dateStr) {
    // 計算近一周日期
    var date = new Date(dateStr);
    var date_sm = new Date(dateStr);
    var date_lg = new Date(dateStr);
    var dateAry = [];
    dateAry.push(date.getFullYear() + '.' + (date.getMonth()+1) + '.' + date.getDate());
    // 取得今天星期幾
    var day = date.getDay() == 0 ? 7 : date.getDay();
    var day_sm = date_sm.getDay() == 0 ? 7 : date_sm.getDay();
    var day_lg = date_lg.getDay() == 0 ? 7 : date_lg.getDay();
    // 從星期一取到今天
    for(var i = day ; i > 1 ; i--) {
        date_sm.setDate(date_sm.getDate()-1);
        dateAry.unshift(date_sm.getFullYear() + '.' + (date_sm.getMonth()+1) + '.' + date_sm.getDate());
    }
    // 從今天取到星期日
    for(var i = day ; i < 7 ; i++) {
        date_lg.setDate(date_lg.getDate()+1);
        dateAry.push(date_lg.getFullYear() + '.' + (date_lg.getMonth()+1) + '.' + date_lg.getDate());
    }
    return dateAry;
}

function generateChart(dateAry) {
    // title 日期區間
    document.querySelector('.date-choose__text').textContent = dateAry[0] + ' - ' + dateAry[dateAry.length-1];
    // 取得 data
    var complete_data = JSON.parse(localStorage.getItem('complete_data'));
    var num = [0,0,0,0,0,0,0];
    var bgcolor = ['#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF'];
    var today = new Date();
    // 先取得所有完成的個數
    for(var i = 0 ; i < dateAry.length ; i++) {
        for(var j = 0 ; j < complete_data.length ; j++) {
            if(complete_data[j].date == dateAry[i]) {
                num[i] = num[i] + 1;
            }
        }
        if(dateAry[i] == (today.getFullYear() + "." + (today.getMonth()+1) + '.' + today.getDate())) {
            bgcolor[i] = '#FF4384';
        }
    }
    // 將dateAry轉為只有月份+日期
    var dateMonthAry = dateAry.map(item => item.split('.')[1] + '/' + item.split('.')[2]);
    // 繪製圖表
    if(document.querySelector('.chart') != null) {
        document.querySelector('.chart').remove();
    }
    var chart_block = document.querySelector('.chart-block');
    chart_block.innerHTML = chart_block.innerHTML + '<canvas id="chart" class="chart" width="400" height="200"></canvas>';
    var canvas  = document.getElementById("chart");
    // 先清空 canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    canvas.height = 250;
    var chart = new Chart(canvas , {
        // 參數設定[註1]
        type: "bar", // 圖表類型
        data: {
            labels: dateMonthAry, // 標題
            datasets: [{
                label: " Set of Pomodoro", // 標籤
                data: num, // 資料
                backgroundColor: bgcolor,
                borderWidth: 1, // 外框寬度
            }]
        },
        options: { 
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    barPercentage: 0.8,
                    gridLines: {
                        zeroLineColor: 'white'
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: "white",
                        fontSize: 16,
                        padding: 10,
                        stepSize: 1
                    }
                }],
                xAxes: [{
                    offset: true,
                    barPercentage: 0.8,
                    gridLines: {
                        zeroLineColor: 'white'
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: "white",
                        fontSize: 16,
                        padding: 10,
                        stepSize: 1
                    }
                }]
            }
        }
    });
    // 報表往前算一個星期
    document.querySelector('.date-choose__before-icon').addEventListener('click', () => {
        var date_text = document.querySelector('.date-choose__text').textContent;
        var today = new Date(date_text.split(' - ')[0]);
        today.setDate(today.getDate() - 1);
        generateChart(getNearlyWeekDate(today.getFullYear()+"."+(today.getMonth()+1)+"."+today.getDate()));
    });
    // 報表往後算一個星期
    document.querySelector('.date-choose__next-icon').addEventListener('click', () => {
        var date_text = document.querySelector('.date-choose__text').textContent;
        var today = new Date(date_text.split(' - ')[1]);
        today.setDate(today.getDate() + 1);
        generateChart(getNearlyWeekDate(today.getFullYear()+"."+(today.getMonth()+1)+"."+today.getDate()));
    });
}

// 選擇鬧鐘
document.querySelectorAll('.select-block__item .unchecked-icon').forEach((item, idx) => {
    item.addEventListener('click', (e) => {
        if(e.target.classList.contains('work-icon')) {
            var area_class = '.work-icon';
        }else {
            var area_class = '.break-icon';
        }
        // 先將 icon 還原
        document.querySelectorAll('.select-block__item ' + area_class).forEach((item, idx) => {
            item.textContent = 'radio_button_unchecked';
            item.classList.add('unchecked-icon--white');
            item.classList.remove('unchecked-icon--red');
        });
        // 將 icon 改為點擊狀態
        e.target.textContent = 'radio_button_checked';
        e.target.classList.remove('unchecked-icon--white');
        e.target.classList.add('unchecked-icon--red');
        // 紀錄選擇的鈴聲
        if(e.target.classList.contains('work-icon')) {
            localStorage.setItem('work-alert', e.target.nextElementSibling.textContent);
        }else {
            localStorage.setItem('break-alert', e.target.nextElementSibling.textContent);
        }
    });
});

// 回到首頁
document.querySelector('.home').addEventListener('click', () => {
    var toDoListMenu = document.querySelector('.todo-list-page');
    toDoListMenu.style.right = '-100vw';
    // 內部 menu 還原
    document.querySelector('.todo-list-page .todo-list .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .todo-list .menu-item__icon').classList.remove('menu-item__icon--hover');
    document.querySelector('.todo-list-page .analyze .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .analyze .menu-item__icon').classList.remove('menu-item__icon--hover');
    document.querySelector('.todo-list-page .music .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .music .menu-item__icon').classList.remove('menu-item__icon--hover');
});
// 回到首頁
document.querySelector('.play-circle').addEventListener('click', () => {
    var toDoListMenu = document.querySelector('.todo-list-page');
    toDoListMenu.style.right = '-100vw';
    // 內部 menu 還原
    document.querySelector('.todo-list-page .todo-list .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .todo-list .menu-item__icon').classList.remove('menu-item__icon--hover');
    document.querySelector('.todo-list-page .analyze .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .analyze .menu-item__icon').classList.remove('menu-item__icon--hover');
    document.querySelector('.todo-list-page .music .menu-item__link').classList.remove('menu-item__link--hover');
    document.querySelector('.todo-list-page .music .menu-item__icon').classList.remove('menu-item__icon--hover');
});