// auth.js (Fitness Streams Auth System using localStorage)

// ---------------- USERS STORAGE ----------------
function getUsers() {
  return JSON.parse(localStorage.getItem("fs_users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("fs_users", JSON.stringify(users));
}

// ---------------- SESSION ----------------
function setSession(user) {
  localStorage.setItem("fs_currentUser", JSON.stringify(user));
}

function getSession() {
  return JSON.parse(localStorage.getItem("fs_currentUser"));
}

function logoutUser() {
  localStorage.removeItem("fs_currentUser");
  window.location.href = "login.html";
}

// ---------------- SIGNUP ----------------
function signupUser(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("⚠️ Fill all fields.");
    return;
  }

  if (password.length < 6) {
    alert("⚠️ Password must be at least 6 characters.");
    return;
  }

  let users = getUsers();

  if (users.find(u => u.email === email)) {
    alert("⚠️ Email already registered.");
    return;
  }

  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password,
    profilePic: ""
  };

  users.push(newUser);
  saveUsers(users);

  alert("✅ Signup successful! Now login.");
  window.location.href = "login.html";
}

// ---------------- LOGIN ----------------
function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  let users = getUsers();

  const found = users.find(u => u.email === email && u.password === password);

  if (!found) {
    alert("❌ Invalid email or password.");
    return;
  }

  setSession(found);
  window.location.href = "home.html";
}

// ---------------- PAGE PROTECTION ----------------
function protectPage() {
  const user = getSession();
  if (!user) {
    window.location.href = "login.html";
  }
}

// ---------------- LOAD USER DATA ----------------
function loadUser() {
  const user = getSession();

  if (user) {
    if (document.getElementById("userName")) {
      document.getElementById("userName").innerText = user.name;
    }

    if (document.getElementById("userEmail")) {
      document.getElementById("userEmail").innerText = user.email;
    }

    if (document.getElementById("profilePic")) {
      if (user.profilePic && user.profilePic !== "") {
        document.getElementById("profilePic").src = user.profilePic;
      }
    }
  }
}

// ---------------- UPDATE USER DATA ----------------
function updateCurrentUser(updatedUser) {
  let users = getUsers();

  users = users.map(u => {
    if (u.id === updatedUser.id) {
      return updatedUser;
    }
    return u;
  });

  saveUsers(users);
  setSession(updatedUser);
}

// ---------------- DELETE ACCOUNT ----------------
function deleteAccount() {
  const user = getSession();
  if (!user) return;

  if (!confirm("⚠️ Are you sure you want to delete your account? This cannot be undone.")) {
    return;
  }

  let users = getUsers();
  users = users.filter(u => u.id !== user.id);

  saveUsers(users);

  localStorage.removeItem("fs_currentUser");
  localStorage.removeItem("workoutPlan");
  localStorage.removeItem("fs_progress");

  alert("✅ Account deleted successfully.");
  window.location.href = "signup.html";
}

document.getElementById("removePicBtn").addEventListener("click", function () {
  if (!currentUser) return;

  currentUser.profilePic = "";
  document.getElementById("profilePic").src = "defaultpfp.jpeg";

  updateCurrentUser(currentUser);

  alert("✅ Profile picture removed!");
});