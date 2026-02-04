var ticks = 0;
var pgColor = ["border-danger", "border-warning", "border-success", "border-primary"];
var btnClass = ["btn-danger", "btn-warning", "btn-success", "btn-primary"];
var btnOtlnClass = ["btn-outline-danger", "btn-outline-warning", "btn-outline-success", "btn-outline-primary"];
var pgData = [["行為者1", "行為者2", "行為者3"], ["被1", "被2", "被3", "被4", "被5", "被6"], ["行為1", "行為2", "行為3", "行為4", "行為5", "行為6"], ["影響1", "影響2", "影響3", "影響4", "影響5", "影響6"]];
var pgDataCal = [[0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
var data = [];
var stage = 0;//0-3
var round = 0;
var roundData = new Array(6);
var masterRunning = false;
var startTime;
var endTime;

var msbtn = document.getElementById("bM");
/* 
  *	info window control
  */

// Get the modal
var modal = document.getElementById('myModal');
// Get the button that opens the modal
var btn = document.getElementById("infoButton");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks the button, open the modal 
btn.onclick = function () {
  modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



function masterStartStop() {
  if (masterRunning == false) {
    //check all name are not empty

    var pgDataUpdate = document.getElementById("workDiv").querySelectorAll("input");
    var oldPg = parseInt(pgDataUpdate[0].id.charAt(0));
    pgDataUpdate.forEach(function (pgd, i) {
      pgData[oldPg][i] = pgd.value.trim();
    });

    var emptyExist = false;
    pgData.forEach(pg => {
      pg.forEach(ob => {
        if (ob == "") {
          emptyExist = true;
        }
      })
    });

    if (emptyExist) {
      alert("The Object name can not be empty.");
      return;
    }

    $("#setting").addClass("d-none");
    $("#info").removeClass("d-none");
    $("#action").removeClass("d-none");

    startTime = new Date();

    //change masterbtn state
    msbtn.innerHTML = "Stop";
    msbtn.style.color = "white";
    msbtn.setAttribute("class", "btn btn-lg btn-warning fs-2 px-4");

    saveButtons();

    ticker.start();
    masterRunning = true;
    stageStart();

  } else {
    endTime = new Date();
    $("#divOperate button").removeClass("disabled");
    stopAll();
  }
}

function saveButtons() {
  localStorage.pgData = JSON.stringify(pgData);
}
function loadButtons() {
  if (typeof (Storage) !== "undefined") {
    if (localStorage.pgData) {
      pgDataCal = [];
      pgData = JSON.parse(localStorage.pgData);
      for (i = 0; i < 4; i++) {
        var tmpAry = [];
        for (j = 0; j < pgData[i].length + 1; j++) {
          tmpAry.push(0);
        }
        pgDataCal.push(tmpAry);
      }
    } else {
      pgData = [["", ""], ["", ""], ["", ""], ["", ""]];
      pgDataCal = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
    }
  } else {
    console.log("Sorry, your browser does not support web storage...");
  }
}

function resetStop() {
  stopAll();
  //div
  $("#setting").attr("class", "d-flex row justify-content-center");
  $("#info").attr("class", "d-flex justify-content-center row d-none");
  $("#action").attr("class", "d-flex justify-content-center d-none");

  //data
  loadButtons();
  data = [];
  ticks = 0;
  stage = 0;//0-3
  round = 0;
  roundData = new Array(6);

  //
  msbtn.innerHTML = "Start";
  document.querySelector("#MasterTime").innerHTML = "00:00";
  msbtn.setAttribute("class", "btn btn-primary btn-lg px-4 fs-2");
  document.getElementById("p-0").click();
  inptGen(0);

  var divTimeline = document.getElementById("divTimelineP1P3");
  while (divTimeline.firstChild) divTimeline.removeChild(divTimeline.lastChild);
  var divTimeline = document.getElementById("divTimelineP2P4");
  while (divTimeline.firstChild) divTimeline.removeChild(divTimeline.lastChild);

  var divTable = document.getElementById("divTable");
  while (divTable.firstChild) divTable.removeChild(divTable.lastChild);

  $("#divOperate button").addClass("disabled");
}

function stopAll() {
  ticker.stop();
  masterRunning = false;

  $("#workDiv label").addClass("disabled");
  $("#action button").addClass("disabled");
  $("#bM").addClass("disabled btn-secondary");
  $("#bM").removeClass("btn-warning");
  $("#bM").html("Finish");
}

/*
* timer
*/
function AdjustingInterval(workFunc, interval, errorFunc) {
  var that = this;
  var expected, timeout;
  this.interval = interval;

  this.start = function () {
    expected = Date.now() + this.interval;
    timeout = setTimeout(step, this.interval);
  }

  this.stop = function () {
    clearTimeout(timeout);
    //stopAll();
  }

  this.clear = function () {
    if (!confirm('Are you sure? Clear data and reset timer.')) return;
    ticker.stop();
    document.getElementById("bM").style.background = "#009bff";
    document.getElementById("bM").innerHTML = "Start";
    masterRunning = false;
    //stopAll();
    ticks = 0;
    document.getElementById("MasterTime").innerHTML = "0:00";
    clearData();
    clearTimeline();
  }

  function step() {
    var drift = Date.now() - expected;
    if (drift > that.interval) {
      // You could have some default stuff here too...
      if (errorFunc) errorFunc();
    }
    workFunc();
    expected += that.interval;
    timeout = setTimeout(step, Math.max(0, that.interval - drift));
  }
}
var doWork = function () {
  console.log(++ticks); // time goes up
  var minutes = Math.floor(ticks / 60);
  if (minutes.toString().length < 2) { minutes = '0' + minutes.toString() }
  var seconds = ticks - (60 * minutes);
  if (seconds.toString().length < 2) { seconds = '0' + seconds.toString() }
  document.getElementById("MasterTime").innerHTML = minutes + ':' + seconds;
};

// Define what to do if something goes wrong
var doError = function () {
  console.warn('The drift exceeded the interval.');
};

var ticker = new AdjustingInterval(doWork, 1000, doError);

function secToTimeString(secs) {
  var minutes = Math.floor(secs / 60);
  if (minutes.toString().length < 2) { minutes = '0' + minutes.toString() }
  var seconds = secs - (60 * minutes);
  if (seconds.toString().length < 2) { seconds = '0' + seconds.toString() }
  return minutes + ':' + seconds;
}

function btnGen(pgIndex) {
  var workDiv = document.getElementById("workDiv");
  while (workDiv.firstChild) workDiv.removeChild(workDiv.lastChild);
  for (var i = 0; i < pgData[pgIndex].length; i++) {
    var inptdiv = document.createElement("div");
    var inpt = document.createElement("input");
    var lbl = document.createElement("label");

    inptdiv.setAttribute("class", "d-grid col-8 col-sm-7 col-md-5 col-lg-4");

    inpt.type = "radio";
    inpt.id = pgIndex + "-" + i;
    inpt.name = pgIndex;
    inpt.setAttribute("class", "btn-check");
    inpt.setAttribute("autocomplete", "off");
    inpt.setAttribute("value", i);
    if (i == 0) inpt.setAttribute("checked", "true");

    lbl.innerHTML = pgData[pgIndex][i];
    lbl.setAttribute("class", "btn myhover fs-4 mb-2");
    lbl.setAttribute("for", inpt.id);

    inptdiv.appendChild(inpt);
    inptdiv.appendChild(lbl);
    workDiv.appendChild(inptdiv);
  }
}

function inptGen(pgIndex) {
  var workDiv = document.getElementById("workDiv");
  var labels = ["行為者 ", "被行為者 ", "行為 ", "影響 "]
  while (workDiv.firstChild) workDiv.removeChild(workDiv.lastChild);

  for (var i = 0; i < pgData[pgIndex].length; i++) {
    var inptdiv = document.createElement("div");
    var inpt = document.createElement("input");
    var lbl = document.createElement("label");

    inptdiv.setAttribute("class", "form-floating col-8 col-sm-7 col-md-5 col-lg-4")

    inpt.id = pgIndex + "" + i;
    inpt.setAttribute("class", "form-control border " + pgColor[pgIndex]);
    inpt.type = "text";
    inpt.value = pgData[pgIndex][i];
    inpt.maxLength = "20";


    lbl.innerHTML = labels[pgIndex] + (i + 1);
    lbl.setAttribute("for", inpt.id);

    inptdiv.appendChild(inpt);
    inptdiv.appendChild(lbl);
    workDiv.appendChild(inptdiv);
  }
}

function pgChange(pgIndex) {
  var pgDataUpdate = document.getElementById("workDiv").querySelectorAll("input");
  var oldPg = parseInt(pgDataUpdate[0].id.charAt(0));
  pgDataUpdate.forEach(function (pgd, i) {
    pgData[oldPg][i] = pgd.value.trim();
  });
  inptGen(pgIndex);
}

function stageStart() {
  stage = 0;
  $("#info button:nth-child(1)").toggleClass(btnOtlnClass[stage]);
  $("#info button:nth-child(1)").toggleClass(btnClass[stage]);

  $("#action button").removeClass("d-none disabled");
  $("#action button:nth-child(2)").addClass("d-none");
  btnGen(0);
  roundData = new Array(6);
}

function stageChange() {//stage 0-3
  if (stage == 0) roundData[0] = new Date();
  $("#info button:nth-child(" + (stage + 1) + ")").toggleClass(btnClass[stage]);
  $("#info button:nth-child(" + (stage + 1) + ")").toggleClass(btnOtlnClass[stage]);
  var checkedVal = parseInt($("#workDiv input:checked").val());
  roundData[stage + 2] = checkedVal;
  pgDataCal[stage][checkedVal]++;
  pgDataCal[stage][pgDataCal[stage].length - 1]++;
  stage++;

  $("#info button:nth-child(" + (stage + 1) + ")").toggleClass(btnOtlnClass[stage]);
  $("#info button:nth-child(" + (stage + 1) + ")").toggleClass(btnClass[stage]);

  if (stage == 2) {
    $("#action button:nth-child(1)").removeClass("d-none");
    $("#action button:nth-child(2)").removeClass("d-none");
  } else if (stage == 3) {
    $("#action button:nth-child(1)").addClass("d-none");
  }
  if (!$("#bM").hasClass("disabled")) $("#bM").toggleClass("disabled");

  btnGen(stage);
}
function nextRound() {
  roundData[1] = new Date();
  $("#info button:nth-child(" + (stage + 1) + ")").addClass(btnClass[stage]);
  $("#info button:nth-child(" + (stage + 1) + ")").removeClass(btnOtlnClass[stage]);
  var checkedVal = parseInt($("#workDiv input:checked").val());
  roundData[stage + 2] = checkedVal;
  pgDataCal[stage][checkedVal]++;
  pgDataCal[stage][pgDataCal[stage].length - 1]++;

  data.push(roundData);
  if ($("#bM").hasClass("disabled")) $("#bM").toggleClass("disabled");
  stageStart();
}

function pgObReduse() {
  if (document.getElementById("workDiv").querySelectorAll("input").length <= 2) {
    alert("Min number of Objects is 2");
    return;
  }
  var pg = parseInt(document.querySelector('input[name="page"]:checked').value);
  pgData[pg].pop();
  pgDataCal[pg].pop();

  document.getElementById("workDiv").removeChild(document.getElementById("workDiv").lastChild);
  pgChange(pg);
}

function pgOBIncrease() {
  if (document.getElementById("workDiv").querySelectorAll("input").length >= 6) {
    alert("Max number of Objects is 6");
    return;
  }
  var pg = parseInt(document.querySelector('input[name="page"]:checked').value);
  pgData[pg].push("");
  pgDataCal[pg].push(0);
  pgChange(pg);
  //inptGen(pg);
}

function addZero(i) {
  return i < 10 ? "0" + i : i;
}

function timeFormating(time) {
  var h = addZero(time.getHours());
  var m = addZero(time.getMinutes());
  var s = addZero(time.getSeconds());
  return h + ":" + m + ":" + s;
}