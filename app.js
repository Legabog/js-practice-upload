import firebase from "firebase/app";
import "firebase/storage";
import { upload } from "./upload.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXcnMGoBLK_UPd8MEHRkisVhErBjPnN6A",
  authDomain: "js-practice-upload.firebaseapp.com",
  projectId: "js-practice-upload",
  storageBucket: "js-practice-upload.appspot.com",
  messagingSenderId: "1042284247577",
  appId: "1:1042284247577:web:6864c70ef6ac3fde4b8888",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload("#file", {
  multi: true,
  accept: [".png", ".jpg", ".jpeg", ".gif"],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`);
      const task = ref.put(file);

      task.on(
        "state_changed",
        (snapshot) => {
          const percentage = (
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0);
          const block = blocks[index].querySelector(".preview-info-progress");
          block.style.width = `${percentage}%`;
          block.textContent = `${percentage}%`;
        },
        (error) => {
          console.log(error);
        },
        () => {
          task.snapshot.ref
            .getDownloadURL()
            .then((url) => console.log(`Downloaded URL: ${url}`));
        }
      );
    });
  },
});
