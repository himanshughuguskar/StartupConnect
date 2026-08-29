import {
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { auth, googleProvider } from "./firebase.js";

async function loginWithGoogle() {
  const message = document.getElementById("message");

  try {
    if (message) message.textContent = "Opening Google sign-in...";

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // This UID is the important identifier for integration with other modules.
    console.log("Login successful");
    console.log("Firebase UID:", user.uid);
    console.log("Name:", user.displayName);
    console.log("Email:", user.email);

    window.location.href = "./dashboard.html";
  } catch (error) {
    console.error("Google login failed:", error);

    if (message) {
      message.textContent = error.code === "auth/popup-closed-by-user"
        ? "Login popup was closed."
        : "Google login failed. Please try again.";
    }
  }
}

async function logout() {
  try {
    await signOut(auth);
    window.location.href = "./login.html";
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Logout failed. Please try again.");
  }
}

function requireAuth() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "./login.html";
      return;
    }

    console.log("Authenticated user UID:", user.uid);
  });
}

function redirectIfLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "./dashboard.html";
    }
  });
}

const googleLoginButton = document.getElementById("google-login");
if (googleLoginButton) {
  googleLoginButton.addEventListener("click", loginWithGoogle);
  redirectIfLoggedIn();
}

const logoutButton = document.getElementById("logout-btn");
if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}

export {
  loginWithGoogle,
  logout,
  requireAuth,
  redirectIfLoggedIn
};
