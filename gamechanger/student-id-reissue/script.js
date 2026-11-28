function updateFee() {
  var radios = document.getElementsByName("processingType");
  var fee = 200;
  var feeName = "Standard Reissue";

  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked && radios[i].value === "Urgent") {
      fee = 500;
      feeName = "Urgent Processing";
    }
  }

  document.getElementById("dispType").innerText = feeName;
  document.getElementById("dispFee").innerHTML = "&#8377;" + fee;
}

function validateForm() {
  var roll = document.getElementById("rollNumber").value.trim();
  var name = document.getElementById("fullName").value.trim();
  var branch = document.getElementById("branch").value;
  var blood = document.getElementById("bloodGroup").value;
  var contact = document.getElementById("contactNumber").value.trim();
  var reason = document.getElementById("reason").value;
  var docCheck = document.getElementById("docCheck").checked;

  if (roll === "") {
    alert("Please enter your Registration / Roll Number.");
    document.getElementById("rollNumber").focus();
    return false;
  }

  if (name === "") {
    alert("Please enter your Full Name.");
    document.getElementById("fullName").focus();
    return false;
  }

  if (branch === "") {
    alert("Please select your Programme / Branch.");
    document.getElementById("branch").focus();
    return false;
  }

  if (blood === "") {
    alert("Please select your Blood Group.");
    document.getElementById("bloodGroup").focus();
    return false;
  }

  if (contact === "") {
    alert("Please enter your Contact Mobile Number.");
    document.getElementById("contactNumber").focus();
    return false;
  }

  if (reason === "") {
    alert("Please select the Reason for Reissue.");
    document.getElementById("reason").focus();
    return false;
  }

  if (!docCheck) {
    alert("Please check the document declaration box.");
    document.getElementById("docCheck").focus();
    return false;
  }

  return true;
}

function handleFormSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    return false;
  }

  var roll = document.getElementById("rollNumber").value.trim();
  var name = document.getElementById("fullName").value.trim();
  var branch = document.getElementById("branch").value;
  var reason = document.getElementById("reason").value;
  var processingType = document.getElementById("dispType").innerText;
  var fee = document.getElementById("dispFee").innerText;

  var randomNum = Math.floor(1000 + Math.random() * 9000);
  var appId = "LPU-IDR-" + randomNum;

  alert("Application Submitted Successfully!\nYour Application ID is: " + appId);

  document.getElementById("receiptAppId").innerText = appId;
  document.getElementById("receiptName").innerText = name;
  document.getElementById("receiptRoll").innerText = roll;
  document.getElementById("receiptBranch").innerText = branch;
  document.getElementById("receiptReason").innerText = reason;
  document.getElementById("receiptType").innerText = processingType;
  document.getElementById("receiptFee").innerText = fee;

  var receipt = document.getElementById("receiptSection");
  receipt.style.display = "block";
  receipt.scrollIntoView();

  return true;
}

function resetReceipt() {
  document.getElementById("receiptSection").style.display = "none";
  document.getElementById("dispType").innerText = "Standard Reissue";
  document.getElementById("dispFee").innerHTML = "&#8377;200";
}

var currentStatus = 0;

function renderPipeline(status) {
  var stages = ["Submitted", "Payment Verified", "Printing", "Ready for Collection"];

  for (var i = 0; i < stages.length; i++) {
    var statusCell = document.getElementById("step-status-" + i);
    var row = document.getElementById("step-row-" + i);

    if (i < status) {
      statusCell.innerText = "Done";
      row.style.backgroundColor = "lightgreen";
      statusCell.style.color = "darkgreen";
    } else if (i === status) {
      statusCell.innerText = "In Progress";
      row.style.backgroundColor = "lightyellow";
      statusCell.style.color = "darkred";
    } else {
      statusCell.innerText = "Pending";
      row.style.backgroundColor = "white";
      statusCell.style.color = "gray";
    }
  }

  var statusNames = ["Submitted", "Payment Verified", "Printing", "Ready for Collection"];
  document.getElementById("trackStatusText").innerText = statusNames[status];
}

function trackStatus() {
  var input = document.getElementById("trackInput").value.trim();

  if (input === "") {
    alert("Please enter your Application ID.");
    document.getElementById("trackInput").focus();
    return;
  }

  document.getElementById("trackAppId").innerText = input;
  document.getElementById("statusSelect").value = currentStatus;
  renderPipeline(currentStatus);

  var result = document.getElementById("trackResult");
  result.style.display = "block";
  result.scrollIntoView();
}

function changeStatus() {
  currentStatus = parseInt(document.getElementById("statusSelect").value);
  renderPipeline(currentStatus);
}
