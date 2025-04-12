import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD4B0mAzcNtADCFFwzxgjGaC29QYRXn6vk",
  authDomain: "keosstall.firebaseapp.com",
  projectId: "keosstall",
  storageBucket: "keosstall.firebasestorage.app",
  messagingSenderId: "12786715356",
  appId: "1:12786715356:web:524253a8cffffe0d054219"
};
firebase.initializeApp(firebaseConfig);

//export 
export const auth= firebase.auth();

export const googleAuthProvider=new firebase.auth.GoogleAuthProvider();