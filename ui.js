var classData = [];
var classDataFileId = null;

var currClassIndex = null;
var currClassAmt = null;
var currClassGoal = null;

var isSaving = false;
var needsSave = false;

function setupClassList(rows, fileId) {
  classDataFileId = fileId;
  
  var sel = document.getElementById("classSelect");
  while(sel.firstChild) { sel.removeChild(sel.firstChild); }
  
  classData = rows;
  
  for(var i = 0; i < classData.length; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerText = classData[i][0];
    sel.appendChild(opt);
  }
  
  clearClassButton();
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
  currClassIndex = null;
  currClassAmt = null;
  currClassGoal = null;

  begin();
  
  updateCurrUI();
}

function updateCurrUI() {
  if(currClassIndex === null) {
    document.getElementById("currClass").innerText = "";
  } else {
    document.getElementById("currClass").innerText = classData[currClassIndex][0];
  }
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
  if(currClassIndex === null) { return; }
  
  currClassAmt += amt;
  toDrop += amt;
  classData[currClassIndex][1] = currClassAmt.toString();
  
  if(classDataFileId === null) {
    appendPre("Error: No file selected. Not saved.");
    document.getElementById("saveInfo").innerText = "Not saved.";
  } else {
    if(isSaving) {
      needsSave = true;
    } else {
      save();
    }
  }
  
  updateCurrUI();
}

function save() {
  isSaving = true;
  needsSave = false;
  
  document.getElementById("saveInfo").innerText = "Saving...";
  //update sheet
  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: classDataFileId,
    range: "Sheet1!A2:C",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: classData
    }
  }).then(function(response) {
    var result = response.result;
    console.log(result.updatedCells + " cells updated.");
    
    var now = new Date();
    document.getElementById("saveInfo").innerText = "Saved at " + now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0") + ":" + now.getSeconds().toString().padStart(2, "0"); //FIXME
    
    isSaving = false;
    if(needsSave) {
      save();
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
}
