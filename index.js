const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submit-button");
const alarmContainer = document.querySelector("#alarms-container");

// Adding Hours, Minutes, Seconds in DropDown Menu
window.addEventListener("DOMContentLoaded", (event) => {
  
  dropDownMenu(1, 12, setHours);
 
  dropDownMenu(0, 59, setMinutes);

  dropDownMenu(0, 59, setSeconds);

  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

// Setting Alarm Button
setAlarmButton.addEventListener("click", getInput);

function getInput(e) {
  e.preventDefault();
  const hourValue = setHours.value;
  const minuteValue = setMinutes.value;
  const secondValue = setSeconds.value;
  const amPmValue = setAmPm.value;

  const alarmTime = convertToTime(
     hourValue,
     minuteValue,
     secondValue,
     amPmValue
  );
  setAlarm(alarmTime);
}

function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      var audio = new Audio('audio_file.mp3');
      audio.play();
      audio.loop = true;
     
    }
    });

  addAlaram(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}
//stoping alarm
const stopingAlarm = document.querySelector(".stop-alarm");
stopingAlarm.addEventListener("click", stopAlarm);

function stopAlarm(){
  
 // var audio = new Audio('audio_file.mp3');
  //audio.stop();
  let test = JSON.parse(localStorage.getItem('alarms'));
  let data = [];
  for(var a of test){
    if(a>getCurrentTime()) data.push(a);
    //if(a<getCurrentTime()) data.push(a);
  }
  localStorage.removeItem('alarms');
  localStorage.setItem('alarms',JSON.stringify(data));
  location.reload();
}

// getting current time
function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;

  return time;
}

// display alarm in front view 
function addAlaram(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "class-flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmContainer.prepend(alarm);
}

// checking alarms
function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}

// saving alarm in localstorage
function saveAlarm(time) {
  const alarms = checkAlarams();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function fetchAlarm() {
  const alarms = checkAlarams();

  alarms.forEach((time) => {
    setAlarm(time, true); 
  }); 
}
// adding dropdown menu 
function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}

// 24 hours format
function convertToTime(hour, minute, second, amPm) {
  return parseInt(hour)+':'+minute+':'+second+' '+amPm;
}
// delete function
function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;

  deleteAlarmFromLocal(time);
  alarm.remove();
}

// clearing in localstorage
function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}
