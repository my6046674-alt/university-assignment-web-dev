let users = JSON.parse(localStorage.getItem("users")) || [];
let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let activity = JSON.parse(localStorage.getItem("activity")) || [];
let settings = JSON.parse(localStorage.getItem("settings")) || {
  theme: "light",
  notifications: false,
  privacy: false,
};

let quotes = [
  "You're doing great – keep going!",
  "The expert in anything was once a beginner.",
  "Success is the sum of small efforts repeated daily.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future depends on what you do today.",
  "Believe you can and you're halfway there.",
  "Quality is not an act, it is a habit.",
  "The only way to do great work is to love what you do.",
  "Education is the passport to the future.",
  "Learning never exhausts the mind.",
];

let editIndex = -1;
let slideIndex = 0;

//  RANDOM QUOTE
function getRandomQuote() {
  var index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

// Default assignments
if (assignments.length === 0) {
  assignments = [
    {
      name: "Project Work",
      subject: "ICS",
      dueDate: "2025-12-18",
      description: "",
      status: "pending",
    },
    {
      name: "Assignment",
      subject: "SAAD",
      dueDate: "2025-12-20",
      description: "",
      status: "pending",
    },
    {
      name: "Assignment",
      subject: "Web Designing and Development",
      dueDate: "2025-12-21",
      description: "",
      status: "pending",
    },
    {
      name: "Completed Task 1",
      subject: "Math",
      dueDate: "2025-12-10",
      description: "",
      status: "completed",
    },
    {
      name: "Completed Task 2",
      subject: "Science",
      dueDate: "2025-12-15",
      description: "",
      status: "completed",
    },
  ];
  localStorage.setItem("assignments", JSON.stringify(assignments));
}

// Default activity
if (activity.length === 0) {
  activity = [
    '✓ You completed "Web Designing Assignment"',
    '+ New task added "ICS Project"',
    "+ New assignment added",
  ];
  localStorage.setItem("activity", JSON.stringify(activity));
}

// ==================== PAGE SWITCHING ====================
function showPage(pageId) {
  document.querySelectorAll(".page, .content").forEach((el) => {
    el.style.display = "none";
  });

  if (pageId === "login") {
    document.getElementById(pageId).style.display = "flex";
    document.getElementById("app").style.display = "none";
  } else {
    document.getElementById("app").style.display = "block";
    document.getElementById(pageId).style.display = "block";
  }

  loadPageData(pageId);
}

function loadPageData(pageId) {
  if (pageId === "dashboard") {
    updateProgress();
    document.getElementById("quoteText").innerText = getRandomQuote();
    loadUpcoming();
    loadActivity();
    updateDashCircle();
  } else {
    if (pageId === "assignments") {
      filterAssignments("all");
    }

    if (pageId === "calendar") {
      generateCalendar();
    }

    if (pageId === "progress") {
      updateProgressCircle();
    }

    if (pageId === "subjects") {
      showSlide(slideIndex);
    }

    if (pageId === "profile") {
      loadProfile();
    }

    if (pageId === "settings") {
      loadSettings();
    }

    if (pageId === "Discipline") {
      setTimeout(loadDisciplineCharts, 100);
    }
  }
}

// LOGIN FUNCTIONS 

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value;

  if (!email || !pass) {
    alert("Please fill in all fields");
    return;
  }


  if (email === "student@gmail.com" && pass === "password") {
    currentUser = { email: email };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    activity.unshift("Logged in");
    localStorage.setItem("activity", JSON.stringify(activity));

    showPage("dashboard");
  } else {
    alert("Invalid credentials");
  }
});







// ASSIGNMENT FUNCTIONS

// ADD / EDIT ASSIGNMENT
document
  .getElementById("addAssignmentForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // stop page refresh

    var name = document.getElementById("assignName").value;
    var subject = document.getElementById("assignSubject").value;
    var due = document.getElementById("assignDue").value;
    var desc = document.getElementById("assignDesc").value;

    // ADD NEW ASSIGNMENT
    if (editIndex === -1) {
      var newAssignment = {
        name: name,
        subject: subject,
        dueDate: due,
        description: desc,
        status: "pending",
      };

      assignments.push(newAssignment);
      activity.unshift("New task added: " + name);
    }
    // EDIT ASSIGNMENT
    else {
      assignments[editIndex].name = name;
      assignments[editIndex].subject = subject;
      assignments[editIndex].dueDate = due;
      assignments[editIndex].description = desc;

      activity.unshift("Task edited: " + name);
      editIndex = -1;
    }

    // Save to browser
    localStorage.setItem("assignments", JSON.stringify(assignments));
    localStorage.setItem("activity", JSON.stringify(activity));

    showPage("assignments");
  });

// SHOW ASSIGNMENTS
function filterAssignments(filter) {
  var tbody = document.querySelector("#assignmentsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  for (var i = 0; i < assignments.length; i++) {
    if (filter === "all" || assignments[i].status === filter) {
      var row = document.createElement("tr");

      row.innerHTML =
        "<td>" +
        assignments[i].name +
        "</td>" +
        "<td>" +
        assignments[i].subject +
        "</td>" +
        "<td>" +
        assignments[i].dueDate +
        "</td>" +
        "<td>" +
        assignments[i].status +
        "</td>" +
        "<td>" +
        "<span onclick='editAssignment(" +
        i +
        ")'>✏️</span> " +
        "<span onclick='completeAssignment(" +
        i +
        ")'>✅</span> " +
        "<span onclick='deleteAssignment(" +
        i +
        ")'>❌</span>" +
        "</td>";

      tbody.appendChild(row);
    }
  }
}

// EDIT ASSIGNMENT
function editAssignment(index) {
  editIndex = index;
  var a = assignments[index];

  document.getElementById("assignName").value = a.name;
  document.getElementById("assignSubject").value = a.subject;
  document.getElementById("assignDue").value = a.dueDate;
  document.getElementById("assignDesc").value = a.description;

  showPage("add-assignment");
}

// COMPLETE ASSIGNMENT
function completeAssignment(index) {
  assignments[index].status = "completed";

  activity.unshift("Completed task: " + assignments[index].name);

  localStorage.setItem("assignments", JSON.stringify(assignments));
  localStorage.setItem("activity", JSON.stringify(activity));

  filterAssignments("all");
}
// Delete Assignment

function deleteAssignment(index) {
  var name = assignments[index].name;

  assignments.splice(index, 1);

  activity.unshift("Deleted task: " + name);

  localStorage.setItem("assignments", JSON.stringify(assignments));
  localStorage.setItem("activity", JSON.stringify(activity));

  filterAssignments("all");
}

// PROGRESS FUNCTIONS

// 1. UPDATE DASHBOARD PROGRESS BAR
function updateProgress() {
  var completed = 0;
  var total = assignments.length;

  // Count completed tasks
  for (var i = 0; i < assignments.length; i++) {
    if (assignments[i].status === "completed") {
      completed++;
    }
  }

  var percent = 0;
  if (total > 0) {
    percent = Math.round((completed / total) * 100);
  }

  var progressBar = document.getElementById("dashProgress");
  var percentText = document.getElementById("dashPercent");

  if (progressBar) {
    progressBar.value = percent;
  }

  if (percentText) {
    percentText.innerText = percent + "% Completed";
  }
}
// 2. UPDATE DASHBOARD CIRCLE
function updateDashCircle() {
  var completed = 0;
  var total = assignments.length;

  for (var i = 0; i < assignments.length; i++) {
    if (assignments[i].status === "completed") {
      completed++;
    }
  }

  var percent = 0;
  if (total > 0) {
    percent = Math.round((completed / total) * 100);
  }

  var circle = document.getElementById("dashCircle");
  var text = document.getElementById("dashCirclePercent");

  if (circle) {
    circle.style.background =
      "conic-gradient(#4caf50 0% " + percent + "%, #ddd " + percent + "% 100%)";
  }

  if (text) {
    text.innerText = percent + "%";
  }
}
// 3. UPDATE PROGRESS PAGE CIRCLE
function updateProgressCircle() {
  var completed = 0;
  var total = assignments.length;

  for (var i = 0; i < assignments.length; i++) {
    if (assignments[i].status === "completed") {
      completed++;
    }
  }

  var percent = 0;
  if (total > 0) {
    percent = Math.round((completed / total) * 100);
  }

  var text = document.getElementById("progressPercent");
  var message = document.getElementById("progressMessage");
  var circle = document.getElementById("progressCircle");

  if (text) {
    text.innerText = percent + "%";
  }

  if (message) {
    message.innerText = "You've completed " + percent + "% of your tasks!";
  }

  if (circle) {
    circle.style.background =
      "conic-gradient(#4caf50 0% " + percent + "%, #ddd " + percent + "% 100%)";
  }
}
// 4. LOAD UPCOMING ASSIGNMENTS
function loadUpcoming() {
  var tbody = document.querySelector("#upcomingTable tbody");
  if (!tbody) {
    return;
  }

  tbody.innerHTML = "";

  var today = new Date("2025-12-19");

  for (var i = 0; i < assignments.length; i++) {
    if (assignments[i].status === "pending") {
      var dueDate = new Date(assignments[i].dueDate);

      if (dueDate >= today) {
        var diff = dueDate - today;
        var days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        var dueText = "";
        if (days === 0) {
          dueText = "Today";
        } else if (days === 1) {
          dueText = "Tomorrow";
        } else {
          dueText = "In " + days + " Days";
        }

        var row = document.createElement("tr");
        row.innerHTML =
          "<td>" +
          assignments[i].name +
          "</td>" +
          "<td>" +
          dueText +
          "</td>" +
          "<td>" +
          assignments[i].subject +
          "</td>" +
          "<td>pending</td>";

        tbody.appendChild(row);
      }
    }
  }
}
// 5. LOAD ACTIVITY LIST
function loadActivity() {
  var list = document.getElementById("activityList");
  if (!list) {
    return;
  }

  list.innerHTML = "";

  for (var i = 0; i < activity.length && i < 10; i++) {
    var li = document.createElement("li");
    li.innerText = activity[i];
    list.appendChild(li);
  }
}

// 1. CALENDAR
function generateCalendar() {
  var grid = document.getElementById("calendarGrid");
  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  var today = new Date("2025-12-19");
  var month = today.getMonth();
  var year = today.getFullYear();

  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var firstDay = new Date(year, month, 1).getDay();

  // Day names
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Add day headers
  for (var i = 0; i < days.length; i++) {
    var header = document.createElement("div");
    header.innerText = days[i];
    header.style.fontWeight = "bold";
    grid.appendChild(header);
  }

  // Empty boxes before first day
  for (var i = 0; i < firstDay; i++) {
    grid.appendChild(document.createElement("div"));
  }

  // Add dates
  for (var d = 1; d <= daysInMonth; d++) {
    var dayBox = document.createElement("div");
    dayBox.innerText = d;

    // Highlight today
    if (d === 19) {
      dayBox.className = "today";
    }

    // Check assignment due date
    for (var j = 0; j < assignments.length; j++) {
      var due = new Date(assignments[j].dueDate);

      if (
        due.getDate() === d &&
        due.getMonth() === month &&
        due.getFullYear() === year
      ) {
        dayBox.innerHTML += "<span class='dot'></span>";
        break;
      }
    }

    grid.appendChild(dayBox);
  }
}
// 3. SUBJECT SLIDER
var subjectSlideIndex = 0;

function slideSubjects(direction) {
  var slides = document.querySelectorAll(".slider-list li");

  subjectSlideIndex = subjectSlideIndex + direction;

  if (subjectSlideIndex < 0) {
    subjectSlideIndex = slides.length - 1;
  }

  if (subjectSlideIndex >= slides.length) {
    subjectSlideIndex = 0;
  }

  document.querySelector(".slider-list").style.transform =
    "translateX(-" + subjectSlideIndex * 100 + "%)";
}

// 4. SHOW PROFILE DATA
function loadProfile() {
  if (!currentUser) {
    return;
  }

  document.getElementById("profileName").innerText = currentUser.name;
  document.getElementById("profileEmail").innerText = currentUser.email;
  document.getElementById("profileMajor").innerText = currentUser.major;

  var completed = 0;

  for (var i = 0; i < assignments.length; i++) {
    if (assignments[i].status === "completed") {
      completed++;
    }
  }

  var percent = 0;
  if (assignments.length > 0) {
    percent = Math.round((completed / assignments.length) * 100);
  }

  document.getElementById("profileProgress").value = percent;
  document.getElementById("profilePercent").innerText = percent + "%";
}
// 5. EDIT PROFILE FORM
function showEditProfile() {
  document.getElementById("editProfileForm").style.display = "block";

  document.getElementById("editName").value = currentUser.name;
  document.getElementById("editEmail").value = currentUser.email;
  document.getElementById("editMajor").value = currentUser.major;
}
// 6. SAVE PROFILE
function saveProfile() {
  currentUser.name = document.getElementById("editName").value;
  currentUser.email = document.getElementById("editEmail").value;
  currentUser.major = document.getElementById("editMajor").value;

  for (var i = 0; i < users.length; i++) {
    if (users[i].email === currentUser.email) {
      users[i] = currentUser;
      break;
    }
  }

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  document.getElementById("editProfileForm").style.display = "none";

  loadProfile();
}

// setting

let userSettings = {
  theme: "light",
  notifications: false,
  privacy: false,
};

const saved = localStorage.getItem("userSettings");
if (saved) {
  userSettings = JSON.parse(saved);
}

function applyTheme() {
  if (userSettings.theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

function loadSettings() {
  const themeRadio = document.querySelector(
    `input[name="theme"][value="${userSettings.theme}"]`,
  );
  if (themeRadio) themeRadio.checked = true;

  const notifToggle = document.getElementById("notifToggle");
  if (notifToggle) notifToggle.checked = userSettings.notifications;

  const privacyToggle = document.getElementById("privacyToggle");
  if (privacyToggle) privacyToggle.checked = userSettings.privacy;

  applyTheme();
}

function saveSettings() {
  const selectedTheme = document.querySelector('input[name="theme"]:checked');
  if (selectedTheme) userSettings.theme = selectedTheme.value;

  const notifToggle = document.getElementById("notifToggle");
  if (notifToggle) userSettings.notifications = notifToggle.checked;

  const privacyToggle = document.getElementById("privacyToggle");
  if (privacyToggle) userSettings.privacy = privacyToggle.checked;

  localStorage.setItem("userSettings", JSON.stringify(userSettings));
  applyTheme();
  alert("Settings saved!");
}

window.addEventListener("DOMContentLoaded", loadSettings);

// supports

function toggleFaq(el) {
  const p = el.querySelector("p");
  const arrow = el.querySelector(".arrow");
  const isVisible = p.style.display === "block";

  p.style.display = isVisible ? "none" : "block";
  arrow.innerText = isVisible ? "▼" : "▲";
  el.classList.toggle("active", !isVisible);
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  showPage("login");
}
