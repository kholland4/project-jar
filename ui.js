var classData = [];

var currClassIndex = null;
var currClassAmt = null;
var currClassGoal = null;

function setupClassList(rows) {
  var sel = document.getElementById("classSelect");
  while(sel.firstChild) { sel.removeChild(sel.firstChild); }
  
  classData = rows;
  
  for(var i = 0; i < classData.length; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerText = classData[i][0];
    sel.appendChild(opt);
  }
}

function selectClassButton() {
  var sel = document.getElementById("classSelect");
  var val = parseInt(sel.value);
  if(isNaN(val)) { return; } //TODO error
  
  currClassIndex = val;
  
  var row = classData[val];
  
  dropCount = 0;
  toDrop = 0;
  totalCount = 0;
  holdCount = parseInt(row[2]);
  if(isNaN(holdCount)) { holdCount = 3000; } //TODO error
  
  begin();
  
  var amt = parseInt(row[1]);
  if(!isNaN(amt)) {
    toDrop = amt;
  }
  
  currClassAmt = parseInt(row[1]);
  currClassGoal = parseInt(row[2]);
  
  updateCurrUI();
}

function clearClassButton() {
  var currClassIndex;
  var currClassAmt;
  var currClassGoal;

  begin();
}

function updateCurrUI() {
  if(currClassAmt === null) {
    document.getElementById("currAmount").innerText = "";
  } else if(isNaN(currClassAmt)) {
    document.getElementById("currAmount").innerText = "<not a number>";
  } else {
    document.getElementById("currAmount").innerText = currClassAmt.toString();
  }
  
  if(currClassGoal === null) {
    document.getElementById("currGoal").innerText = "";
  } else if(isNaN(currClassGoal)) {
    document.getElementById("currGoal").innerText = "<not a number>";
  } else {
    document.getElementById("currGoal").innerText = currClassGoal.toString();
  }
}

function currClassAdd(amt) {
  currClassAmt += amt;
  toDrop += amt;
  
  //TODO update sheet
  
  updateCurrUI();
}
