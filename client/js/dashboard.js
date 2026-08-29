import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { logout } from "./auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  document.getElementById("user-name").textContent = user.displayName || "Not available";
  document.getElementById("user-email").textContent = user.email || "Not available";
  document.getElementById("user-uid").textContent = user.uid;

  const photo = document.getElementById("user-photo");
  if (user.photoURL) {
    photo.src = user.photoURL;
  } else {
    photo.style.display = "none";
  }

  console.log("Current Firebase user:", {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL
  });
});

const logoutButton = document.getElementById("logout-btn");
if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}
