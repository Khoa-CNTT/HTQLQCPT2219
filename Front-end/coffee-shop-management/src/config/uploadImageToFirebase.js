import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {storage} from "./firebaseConfig";

const uploadImageToFirebase = async (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file selected");
            return;
        }

        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Có thể thêm logic hiển thị tiến trình upload nếu cần
            },
            (error) => {
                reject(error);
            },
            () => {
                // Lấy URL của ảnh sau khi upload
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        resolve(downloadURL); // Trả về URL của ảnh
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        );
    });
};

export default uploadImageToFirebase;
