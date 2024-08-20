import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {

  return createUserWithEmailAndPassword(auth, email, password);

};

export const doSignInWithEmailAndPassword = async (email, password) => {
  console.log("reached1")
  try {
    console.log("reached2")
  await signInWithEmailAndPassword(auth, email, password);
  console.log("reached4")
  return true;
}catch (error){
  console.log("reached3")
  console.log("reached here")
  return false;
}
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  return user.uid

  // add user to firestore
};

export const doSignOut = () => {
  return auth.signOut();
};

// export const doPasswordReset = (email) => {
//   return sendPasswordResetEmail(auth, email);
// };

// export const doPasswordChange = (password) => {
//   return updatePassword(auth.currentUser, password);
// };

// export const doSendEmailVerification = () => {
//   return sendEmailVerification(auth.currentUser, {
//     url: `${window.location.origin}/home`,
//   });
// };
