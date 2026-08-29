import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXDrtpu1IkHksUCj8EuzJzzoa-OaH19TI",
  authDomain: "seedsync-25e42.firebaseapp.com",
  projectId: "seedsync-25e42",
  storageBucket: "seedsync-25e42.firebasestorage.app",
  messagingSenderId: "443122100477",
  appId: "1:443122100477:web:3a62c04dd8cf4eb5743694"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };