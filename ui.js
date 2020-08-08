var classData = [];

function setupClassList(rows) {
  var sel = document.getElementById("classSelect");
  while(sel.firstChild) { sel.removeChild(sel.firstChild); }
  
  classData = rows;
  
  for(var i = 0; i < classData.length; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerText = classData[i][0];
  }
}

function selectClassButton() {
  var sel = document.getElementById("classSelect");
  var val = parseInt(sel.value);
  if(isNaN(val)) { return; } //TODO error
  
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
}

function clearClassButton() {
  begin();
}
