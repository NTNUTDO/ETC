var ticks = 0;
var pgColor = ["border-danger", "border-warning", "border-success", "border-primary"];
var btnClass = ["btn-danger", "btn-warning", "btn-success", "btn-primary"];
var btnOtlnClass = ["btn-outline-danger", "btn-outline-warning", "btn-outline-success", "btn-outline-primary"];
var pgData = [["", ""], ["", ""], ["", ""], ["", ""]];

var labels = ["行為者 ", "行為 ", "被行為者 ", "反應 "];
var pgDataCal = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
var data = [];
var stage = 0;//0-3
var round = 0;
var roundData = new Array(6);
var masterRunning = false;
var startTime;
var roundTimeChecked = false;
var ismobile = isMobile();

function isMobile() {
  try {
    document.createEvent("TouchEvent"); return true;
  } catch (e) {
    return false;
  }
}

function prepare() {
  loadButtons();
  if (ismobile) {
    $(mobile_device).removeClass("d-none");
    inptGen(0);
  } else {
    $(desktop_device).removeClass("d-none");
    for (i = 0; i < 4; i++) {
      inptGen(i);
    }
  }
}

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

document.getElementById("exchangeButton").onclick = function () {
  if (ismobile) {
    var pgDataUpdate = document.getElementById("mb_work_div").querySelectorAll("input");
    var oldPg = parseInt(pgDataUpdate[0].id.charAt(0));
    pgDataUpdate.forEach(function (pgd, i) {
      pgData[oldPg][i] = pgd.value.trim();
    });
    console.log(pgData);
  } else {
    for (i = 0; i < 4; i++) {
      var pgDataUpdate = document.getElementById("dt_work_div_" + i).querySelectorAll("input");
      pgDataUpdate.forEach(function (pgd, j) {
        pgData[i][j] = pgd.value.trim();
      });
    }
    console.log(pgData);
  }
  ismobile = !ismobile;
  $("#mobile_device").toggleClass("d-none");
  $("#desktop_device").toggleClass("d-none");
  if (ismobile) {
    $(mobile_device).removeClass("d-none");
    inptGen(0);
  } else {
    $(desktop_device).removeClass("d-none");
    for (i = 0; i < 4; i++) {
      inptGen(i);
    }
  }
}

function masterStartStop() {
  if (masterRunning == false) {
    //check all name are not empty

    if (ismobile) {
      var pgDataUpdate = document.getElementById("mb_work_div").querySelectorAll("input");
      var oldPg = parseInt(pgDataUpdate[0].id.charAt(0));
      pgDataUpdate.forEach(function (pgd, i) {
        pgData[oldPg][i] = pgd.value.trim();
      });
    } else {
      for (i = 0; i < 4; i++) {
        var pgDataUpdate = document.getElementById("dt_work_div_" + i).querySelectorAll("input");
        pgDataUpdate.forEach(function (pgd, j) {
          pgData[i][j] = pgd.value.trim();
        });
      }
    }

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
    $("#exchangeButton").addClass("d-none");
    if (ismobile) {
      $("#mb_setting_div").addClass("d-none");
      $("#mb_info_div").removeClass("d-none");
      $("#mb_action_div").removeClass("d-none");
    } else {
      for (var i = 0; i < 4; i++) {
        $("#dt_setting_div_" + i).addClass("d-none");
        $("#dt_info_div_" + i).removeClass("d-none");
      }
      $("#dt_action_div").removeClass("d-none");
    }

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
  if (ismobile) {
    $("#mb_setting_div").attr("class", "d-flex row justify-content-center");
    for (var i = 0; i < 4; i++) {
      $("#mb_info_div  button:nth-child(" + (i + 1) + ")").attr("class", "btn fs-4 mb-2 disabled " + btnClass[i]);
    }
    $("#mb_info_div").attr("class", "d-flex justify-content-center row d-none");
    $("#mb_action_div").attr("class", "d-flex justify-content-center d-none");
  } else {
    for (var i = 0; i < 4; i++) {
      $("#dt_setting_div_" + i).attr("class", "d-flex justify-content-center mb-2");
      $("#dt_info_div_" + i).attr("class", "d-flex justify-content-center row d-none");
      $("#dt_action_div").attr("class", "d-flex justify-content-center d-none");
    }
  }

  //data
  loadButtons();
  prepare();
  data = [];
  ticks = 0;
  stage = 0;//0-3
  round = 0;
  roundData = new Array(6);
  document.getElementById("exchangeButton").setAttribute("class", "exchangeButton");

  //
  msbtn.innerHTML = "Start";
  document.querySelector("#MasterTime").innerHTML = "00:00";
  msbtn.setAttribute("class", "btn btn-primary btn-lg px-4 fs-2");
  document.getElementById("p-0").click();

  var divTimeline = document.getElementById("divTimelineP1P2");
  while (divTimeline.firstChild) divTimeline.removeChild(divTimeline.lastChild);
  var divTimeline = document.getElementById("divTimelineP3P4");
  while (divTimeline.firstChild) divTimeline.removeChild(divTimeline.lastChild);

  var divTable = document.getElementById("divTable");
  while (divTable.firstChild) divTable.removeChild(divTable.lastChild);

  $("#divOperate button").addClass("disabled");
}

function stopAll() {
  ticker.stop();
  masterRunning = false;
  if (ismobile) {
    $("#mb_work_div label").addClass("disabled");
    $("#mb_action_div button").addClass("disabled");
  } else {
    for (i = 0; i < 4; i++) {
      $("#dt_work_div_" + i + " label").addClass("disabled");
      $("#dt_action_div button").addClass("disabled");
    }
  }
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
  }

  this.clear = function () {
    if (!confirm('Are you sure? Clear data and reset timer.')) return;
    ticker.stop();
    document.getElementById("bM").style.background = "#009bff";
    document.getElementById("bM").innerHTML = "Start";
    masterRunning = false;
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
  if (ismobile) {
    var workDiv = document.getElementById("mb_work_div");
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
  } else {
    for (var j = 0; j < 4; j++) {
      var workDiv = document.getElementById("dt_work_div_" + j);
      while (workDiv.firstChild) workDiv.removeChild(workDiv.lastChild);
      for (var i = 0; i < pgData[j].length; i++) {
        var inptdiv = document.createElement("div");
        var inpt = document.createElement("input");
        var lbl = document.createElement("label");

        inptdiv.setAttribute("class", "d-grid col-11 col-lg-12 ");

        inpt.type = "radio";
        inpt.id = j + "-" + i;
        inpt.name = j;
        inpt.setAttribute("class", "btn-check");
        inpt.setAttribute("autocomplete", "off");
        inpt.setAttribute("value", i);

        lbl.innerHTML = pgData[j][i];
        lbl.setAttribute("class", "btn myhover fs-4 mb-2");
        lbl.setAttribute("for", inpt.id);
        lbl.addEventListener("click", function () {
          if (!roundTimeChecked) {
            roundData = new Array(6);
            roundData[0] = new Date();
          }
          roundTimeChecked = true;
        });

        inptdiv.appendChild(inpt);
        inptdiv.appendChild(lbl);
        workDiv.appendChild(inptdiv);
      }
    }
  }
}

function inptGen(pgIndex) {

  var workDiv = document.getElementById(ismobile ? "mb_work_div" : "dt_work_div_" + pgIndex);

  while (workDiv.firstChild) workDiv.removeChild(workDiv.lastChild);
  for (var i = 0; i < pgData[pgIndex].length; i++) {
    var inptdiv = document.createElement("div");
    var inpt = document.createElement("input");
    var lbl = document.createElement("label");

    inptdiv.setAttribute("class", ismobile ? "form-floating col-8 col-sm-7 col-md-5 col-lg-4" : "form-floating col-lg-12");

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
  var pgDataUpdate = document.getElementById("mb_work_div").querySelectorAll("input");
  var oldPg = parseInt(pgDataUpdate[0].id.charAt(0));
  pgDataUpdate.forEach(function (pgd, i) {
    pgData[oldPg][i] = pgd.value.trim();
  });
  inptGen(pgIndex);
}

function stageStart() {
  stage = 0;
  $("#mb_info_div button:nth-child(1)").toggleClass(btnOtlnClass[stage]);
  $("#mb_info_div button:nth-child(1)").toggleClass(btnClass[stage]);

  $("#mb_action_div button").removeClass("d-none disabled");
  $("#mb_action_div button:nth-child(2)").addClass("d-none");

  $("#dt_action_div button").removeClass("d-none disabled");
  btnGen(0);
  roundData = new Array(6);
  roundData[0] = new Date();
}

function stageChange() {//stage 0-3
  if (stage == 0) roundData[0] = new Date();
  $("#mb_info_div button:nth-child(" + (stage + 1) + ")").toggleClass(btnClass[stage]);
  $("#mb_info_div button:nth-child(" + (stage + 1) + ")").toggleClass(btnOtlnClass[stage]);
  var checkedVal = parseInt($("#mb_work_div input:checked").val());
  roundData[stage + 2] = checkedVal;
  pgDataCal[stage][checkedVal]++;
  pgDataCal[stage][pgDataCal[stage].length - 1]++;
  stage++;

  $("#mb_info_div button:nth-child(" + (stage + 1) + ")").toggleClass(btnOtlnClass[stage]);
  $("#mb_info_div button:nth-child(" + (stage + 1) + ")").toggleClass(btnClass[stage]);

  if (stage == 3) {
    $("#mb_action_div button:nth-child(1)").addClass("d-none");
    $("#mb_action_div button:nth-child(2)").removeClass("d-none");
  }
  if (!$("#bM").hasClass("disabled")) $("#bM").toggleClass("disabled");

  btnGen(stage);
}
function nextRound() {
  if (ismobile) {
    roundData[1] = new Date();
    $("#mb_info_div button:nth-child(" + (stage + 1) + ")").addClass(btnClass[stage]);
    $("#mb_info_div button:nth-child(" + (stage + 1) + ")").removeClass(btnOtlnClass[stage]);
    var checkedVal = parseInt($("#mb_work_div input:checked").val());
    roundData[stage + 2] = checkedVal;
    pgDataCal[stage][checkedVal]++;
    pgDataCal[stage][pgDataCal[stage].length - 1]++;

    data.push(roundData);
    if ($("#bM").hasClass("disabled")) $("#bM").toggleClass("disabled");
    stageStart();
  } else {
    var checkedData = Array.from($("[id*='dt_work_div_'] input:checked"));
    if (checkedData.length < 4) {
      alert("Please select all objects.");
      return;
    }
    roundData[1] = new Date();
    checkedData.forEach(function (d) {
      var pg = parseInt(d.id.charAt(0));
      var ob = parseInt(d.value);
      roundData[pg + 2] = ob;
      pgDataCal[pg][ob]++;
      pgDataCal[pg][pgDataCal[pg].length - 1]++;
      d.checked = false;
    });
    data.push(roundData);
    roundTimeChecked = false;
  }
}

function pgObReduce() {
  if (document.getElementById("mb_work_div").querySelectorAll("input").length <= 2) {
    alert("Min number of Objects is 2");
    return;
  }
  var pg = parseInt(document.querySelector('input[name="page"]:checked').value);
  pgData[pg].pop();
  pgDataCal[pg].pop();

  document.getElementById("mb_work_div").removeChild(document.getElementById("mb_work_div").lastChild);
  pgChange(pg);
}
function ObReduce(pg) {
  if (document.getElementById("dt_work_div_" + pg).querySelectorAll("input").length <= 2) {
    alert("Min number of Objects is 2");
    return;
  }

  pgData[pg].pop();
  pgDataCal[pg].pop();

  document.getElementById("dt_work_div_" + pg).removeChild(document.getElementById("dt_work_div_" + pg).lastChild);
}

function pgObIncrease() {
  if (document.getElementById("mb_work_div").querySelectorAll("input").length >= 6) {
    alert("Max number of Objects is 6");
    return;
  }
  var pg = parseInt(document.querySelector('input[name="page"]:checked').value);
  pgData[pg].push("");
  pgDataCal[pg].push(0);
  pgChange(pg);
}
function ObIncrease(pg) {
  if (document.getElementById("dt_work_div_" + pg).querySelectorAll("input").length >= 6) {
    alert("Max number of Objects is 6");
    return;
  }
  pgData[pg].push("");
  pgDataCal[pg].push(0);

  var pgDataUpdate = document.getElementById("dt_work_div_" + pg).querySelectorAll("input");
  var oldPg = parseInt(pgDataUpdate[0].id.charAt(0));
  pgDataUpdate.forEach(function (pgd, i) {
    pgData[oldPg][i] = pgd.value.trim();
  });
  inptGen(pg);
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

window.addEventListener("online", function (event) {
  event.stopPropagation();
  console.log("網路已重新連線，但不會自動刷新頁面");
});