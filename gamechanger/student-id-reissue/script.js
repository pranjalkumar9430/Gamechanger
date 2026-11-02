

function showSection(sectionName) {

  var allSections = document.querySelectorAll('.section');

  for (var i = 0; i < allSections.length; i++) {
    allSections[i].classList.remove('active-section');
  }

  document.getElementById(sectionName).classList.add('active-section');

  var allLinks = document.querySelectorAll('.nav-link');
  for (var j = 0; j < allLinks.length; j++) {
    allLinks[j].classList.remove('active');
    if (allLinks[j].getAttribute('data-section') === sectionName) {
      allLinks[j].classList.add('active');
    }
  }

  var nav = document.getElementById('mainNav');
  nav.classList.remove('open');

  if (sectionName === 'track') {
    loadTrackingInfo();
  }

  if (sectionName === 'dashboard') {
    loadDashboardStatus();
  }

  window.scrollTo(0, 0);
}

var menuToggle = document.getElementById('menuToggle');
menuToggle.addEventListener('click', function () {
  var nav = document.getElementById('mainNav');
  if (nav.classList.contains('open')) {
    nav.classList.remove('open');
  } else {
    nav.classList.add('open');
  }
});

var navLinks = document.querySelectorAll('.nav-link');
for (var n = 0; n < navLinks.length; n++) {
  navLinks[n].addEventListener('click', function (event) {
    event.preventDefault();
    var targetSection = this.getAttribute('data-section');
    showSection(targetSection);
  });
}

function updateChecklist() {
  var reason = document.getElementById('reason').value;

  var checklistFieldset = document.getElementById('checklistFieldset');
  var policeItem = document.getElementById('checklistPolice');
  var oldCardItem = document.getElementById('checklistOldCard');

  document.getElementById('chkPolice').checked = false;
  document.getElementById('chkOldCard').checked = false;

  if (reason === '') {

    checklistFieldset.style.display = 'none';
    policeItem.style.display = 'none';
    oldCardItem.style.display = 'none';
  } else if (reason === 'Lost') {

    checklistFieldset.style.display = 'block';
    policeItem.style.display = 'block';
    oldCardItem.style.display = 'none';
  } else if (reason === 'Damaged' || reason === 'Defaced') {

    checklistFieldset.style.display = 'block';
    policeItem.style.display = 'none';
    oldCardItem.style.display = 'block';
  }

  document.getElementById('checklistError').textContent = '';
}

function updateFee() {

  var radios = document.getElementsByName('processingType');
  var selectedType = 'Standard';

  for (var r = 0; r < radios.length; r++) {
    if (radios[r].checked) {
      selectedType = radios[r].value;
      break;
    }
  }

  var fee = 200;
  var typeLabel = 'Standard Reissue';

  if (selectedType === 'Urgent') {
    fee = 500;
    typeLabel = 'Urgent 24-Hour Processing';
  }

  document.getElementById('feeType').textContent = typeLabel;
  document.getElementById('feeAmount').textContent = '\u20B9' + fee;
  document.getElementById('feeTotal').innerHTML = '<strong>\u20B9' + fee + '</strong>';
}

function validateForm() {
  var isValid = true;

  document.getElementById('rollNumberError').textContent = '';
  document.getElementById('fullNameError').textContent = '';
  document.getElementById('branchError').textContent = '';
  document.getElementById('bloodGroupError').textContent = '';
  document.getElementById('reasonError').textContent = '';
  document.getElementById('checklistError').textContent = '';

  var rollNumber = document.getElementById('rollNumber').value.trim();
  if (rollNumber === '') {
    document.getElementById('rollNumberError').textContent = 'Roll Number is required.';
    isValid = false;
  }

  var fullName = document.getElementById('fullName').value.trim();
  if (fullName === '') {
    document.getElementById('fullNameError').textContent = 'Full Name is required.';
    isValid = false;
  }

  var branch = document.getElementById('branch').value;
  if (branch === '') {
    document.getElementById('branchError').textContent = 'Please select your Branch.';
    isValid = false;
  }

  var bloodGroup = document.getElementById('bloodGroup').value;
  if (bloodGroup === '') {
    document.getElementById('bloodGroupError').textContent = 'Please select your Blood Group.';
    isValid = false;
  }

  var reason = document.getElementById('reason').value;
  if (reason === '') {
    document.getElementById('reasonError').textContent = 'Please select a Reason for Reissue.';
    isValid = false;
  }

  if (reason !== '') {
    if (reason === 'Lost') {
      if (!document.getElementById('chkPolice').checked) {
        document.getElementById('checklistError').textContent = 'You must confirm you have the Police Lost Report Acknowledgment.';
        isValid = false;
      }
    } else if (reason === 'Damaged' || reason === 'Defaced') {
      if (!document.getElementById('chkOldCard').checked) {
        document.getElementById('checklistError').textContent = 'You must confirm you have the Old Damaged Card for submission.';
        isValid = false;
      }
    }
  }

  return isValid;
}

function generateAppId() {
  var year = new Date().getFullYear();

  var counter = localStorage.getItem('lpuAppCounter');
  if (counter === null) {
    counter = 1;
  } else {
    counter = parseInt(counter) + 1;
  }

  localStorage.setItem('lpuAppCounter', counter);

  var paddedCounter = String(counter).padStart(3, '0');
  return 'LPU-IDR-' + year + paddedCounter;
}

document.getElementById('reissueForm').addEventListener('submit', function (event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  var rollNumber = document.getElementById('rollNumber').value.trim();
  var fullName = document.getElementById('fullName').value.trim();
  var branch = document.getElementById('branch').value;
  var bloodGroup = document.getElementById('bloodGroup').value;
  var reason = document.getElementById('reason').value;

  var radios = document.getElementsByName('processingType');
  var processingType = 'Standard';
  for (var r = 0; r < radios.length; r++) {
    if (radios[r].checked) {
      processingType = radios[r].value;
      break;
    }
  }

  var fee = (processingType === 'Urgent') ? 500 : 200;
  var processingLabel = (processingType === 'Urgent') ? 'Urgent 24-Hour Processing' : 'Standard Reissue';

  var appId = generateAppId();

  var now = new Date();
  var submittedOn = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN');

  var applicationData = {
    appId: appId,
    rollNumber: rollNumber,
    fullName: fullName,
    branch: branch,
    bloodGroup: bloodGroup,
    reason: reason,
    processingType: processingLabel,
    fee: fee,
    submittedOn: submittedOn,
    status: 0
  };

  localStorage.setItem('lpuApplication', JSON.stringify(applicationData));

  showSuccessMessage(applicationData);
});

function showSuccessMessage(data) {

  document.getElementById('reissueForm').style.display = 'none';

  var detailsHTML = '<table>';
  detailsHTML += '<tr><td><strong>Application ID</strong></td><td style="color:#C8102E; font-weight:bold;">' + data.appId + '</td></tr>';
  detailsHTML += '<tr><td><strong>Roll Number</strong></td><td>' + data.rollNumber + '</td></tr>';
  detailsHTML += '<tr><td><strong>Full Name</strong></td><td>' + data.fullName + '</td></tr>';
  detailsHTML += '<tr><td><strong>Branch</strong></td><td>' + data.branch + '</td></tr>';
  detailsHTML += '<tr><td><strong>Blood Group</strong></td><td>' + data.bloodGroup + '</td></tr>';
  detailsHTML += '<tr><td><strong>Reason for Reissue</strong></td><td>' + data.reason + '</td></tr>';
  detailsHTML += '<tr><td><strong>Processing Type</strong></td><td>' + data.processingType + '</td></tr>';
  detailsHTML += '<tr><td><strong>Total Fee</strong></td><td>&#8377;' + data.fee + '</td></tr>';
  detailsHTML += '<tr><td><strong>Submitted On</strong></td><td>' + data.submittedOn + '</td></tr>';
  detailsHTML += '<tr><td><strong>Status</strong></td><td style="color:green;">Submitted</td></tr>';
  detailsHTML += '</table>';

  document.getElementById('successDetails').innerHTML = detailsHTML;

  document.getElementById('successMessage').style.display = 'block';

  document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {

  document.getElementById('reissueForm').style.display = 'block';

  document.getElementById('successMessage').style.display = 'none';

  document.getElementById('reissueForm').reset();

  document.getElementById('checklistFieldset').style.display = 'none';
  document.getElementById('checklistPolice').style.display = 'none';
  document.getElementById('checklistOldCard').style.display = 'none';

  updateFee();
}

function loadTrackingInfo() {
  var savedData = localStorage.getItem('lpuApplication');

  if (savedData === null) {

    document.getElementById('noApplicationNotice').style.display = 'block';
    document.getElementById('trackingContent').style.display = 'none';
  } else {

    var data = JSON.parse(savedData);

    document.getElementById('noApplicationNotice').style.display = 'none';
    document.getElementById('trackingContent').style.display = 'block';

    document.getElementById('trackAppId').textContent = data.appId;
    document.getElementById('trackName').textContent = data.fullName;
    document.getElementById('trackRoll').textContent = data.rollNumber;
    document.getElementById('trackReason').textContent = data.reason;
    document.getElementById('trackProcessing').textContent = data.processingType;
    document.getElementById('trackFee').textContent = '\u20B9' + data.fee;

    document.getElementById('statusSelect').value = data.status;

    renderTimeline(data.status);
  }
}

function renderTimeline(currentStatus) {
  var totalSteps = 4;

  for (var s = 0; s < totalSteps; s++) {
    var stepEl = document.getElementById('step-' + s);

    if (s <= currentStatus) {

      stepEl.classList.add('step-done');
    } else {

      stepEl.classList.remove('step-done');
    }

    if (s < totalSteps - 1) {
      var connector = document.getElementById('conn-' + s);
      if (s < currentStatus) {
        connector.classList.add('connector-done');
      } else {
        connector.classList.remove('connector-done');
      }
    }
  }
}

function updateStatus() {
  var newStatus = parseInt(document.getElementById('statusSelect').value);

  var savedData = localStorage.getItem('lpuApplication');
  if (savedData !== null) {
    var data = JSON.parse(savedData);
    data.status = newStatus;

    localStorage.setItem('lpuApplication', JSON.stringify(data));

    renderTimeline(newStatus);
  }
}

function loadDashboardStatus() {
  var savedData = localStorage.getItem('lpuApplication');

  if (savedData !== null) {
    var data = JSON.parse(savedData);

    var statusLabels = ['Submitted', 'Payment Verified', 'Printing', 'Ready for Collection'];

    var summaryHTML = '<table style="width:100%; font-size:14px; border-collapse:collapse;">';
    summaryHTML += '<tr><td style="padding:6px; border:1px solid #ddd;"><strong>Application ID</strong></td><td style="padding:6px; border:1px solid #ddd; color:#C8102E; font-weight:bold;">' + data.appId + '</td></tr>';
    summaryHTML += '<tr><td style="padding:6px; border:1px solid #ddd;"><strong>Name</strong></td><td style="padding:6px; border:1px solid #ddd;">' + data.fullName + '</td></tr>';
    summaryHTML += '<tr><td style="padding:6px; border:1px solid #ddd;"><strong>Reason</strong></td><td style="padding:6px; border:1px solid #ddd;">' + data.reason + '</td></tr>';
    summaryHTML += '<tr><td style="padding:6px; border:1px solid #ddd;"><strong>Status</strong></td><td style="padding:6px; border:1px solid #ddd; color:green;">' + statusLabels[data.status] + '</td></tr>';
    summaryHTML += '</table>';

    document.getElementById('dashboardStatusContent').innerHTML = summaryHTML;
    document.getElementById('dashboardStatusCard').style.display = 'block';
  } else {

    document.getElementById('dashboardStatusCard').style.display = 'none';
  }
}

window.onload = function () {

  showSection('dashboard');

  updateFee();

};
