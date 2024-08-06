import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAszvzC0XVBhQvmBTEr9WawDgiI9ReiNys",
  authDomain: "datn-fa8ff.firebaseapp.com",
  projectId: "datn-fa8ff",
  storageBucket: "datn-fa8ff.appspot.com",
  messagingSenderId: "615038554279",
  appId: "1:615038554279:web:52400bd41147962a308b82",
  measurementId: "G-WELLZ5NZFF",
};

const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };
