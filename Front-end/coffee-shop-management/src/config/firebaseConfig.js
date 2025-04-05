import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; // Thêm dòng này để sử dụng Firebase Storage

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDldnJOJteafL9FRrEpoyyPhikOHMZw6p0",
    authDomain: "fir-48309.firebaseapp.com",
    projectId: "fir-48309",
    storageBucket: "fir-48309.appspot.com",
    messagingSenderId: "1034160810131",
    appId: "1:1034160810131:web:04fda5260aeebfd8340566",
    measurementId: "G-TRJ7R2KHM4"
};
// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);  // Thêm dòng này

// Export các thành phần cần thiết
export { storage };