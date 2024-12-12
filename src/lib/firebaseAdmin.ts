import { getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCEyBegZXNul7Dz1bpAcp0QT07MSFmOLF8",
  authDomain: "tapaksuci-33bab.firebaseapp.com",
  projectId: "tapaksuci-33bab",
  storageBucket: "tapaksuci-33bab.appspot.com",
  messagingSenderId: "986620079962",
  appId: "1:986620079962:web:9d1e98764eb055f5228d63",
  measurementId: "G-BFV0EYFKX2",
};
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const STORAGE_FOLDER_PATH = "gs://tapaksuci-33bab.appspot.com";
export const storage = getStorage(app, STORAGE_FOLDER_PATH);

export default app;
