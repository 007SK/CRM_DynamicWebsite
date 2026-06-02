import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

/*const firebaseConfig = {
  projectId: "qwiklabs-gcp-00-d4fbeb2d2d45",
  appId: "1:23863827188:web:5a4d3ef6657a3aa0925ca1",
  storageBucket: "qwiklabs-gcp-00-d4fbeb2d2d45.appspot.com",
  apiKey: "AIzaSyAu-8fYvWmN6SdQMgLdRTNJ323MUsovVGI",
  authDomain: "qwiklabs-gcp-00-d4fbeb2d2d45.firebaseapp.com",
  messagingSenderId: "23863827188",
  projectNumber: "23863827188",
  version: "2"
};
*/
const firebaseConfig = {
  apiKey: "AIzaSyAu-8fYvWmN6SdQMgLdRTNJ323MUsovVGI",
  authDomain: "qwiklabs-gcp-00-d4fbeb2d2d45.firebaseapp.com",
  projectId: "qwiklabs-gcp-00-d4fbeb2d2d45",
  storageBucket: "qwiklabs-gcp-00-d4fbeb2d2d45.appspot.com",
  messagingSenderId: "23863827188",
  appId: "1:23863827188:web:5a4d3ef6657a3aa0925ca1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);



export { db, storage };
