import { auth, googleProvider, facebookProvider, db } from "./firebase.js";
import { 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

let firstName = document.getElementById("firstName").value;
let lastName = document.getElementById("lastName").value;

// Function to store user data in Firestore if they are new
const saveUserToFirestore = async (user) => {
    try {
        if (!user || !user.uid) return; // Ensure user exists

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Save new user details in Firestore
            await setDoc(userRef, {
                displayName: user.displayName || "No Name",
                email: user.email || "No Email",
                photoURL: user.photoURL || "",
                provider: user.providerData[0]?.providerId || "unknown",
                createdAt: serverTimestamp(),
            });
        }
    } catch (error) {
        console.error("Error saving user to Firestore:", error);
    }
};

function saveUserDetails(uid, name, email) {
    const userRef = database.ref('users/' + uid); // Path: users/{uid}
    userRef.set({
      name: name,
      email: email,
      createdAt: Date.now()  // Optional: You can add a timestamp of when the account was created
    }).then(() => {
      console.log("User details saved successfully!");
    }).catch((error) => {
      console.error("Error saving user details: ", error);
    });
  }

// Signup with Email & Password and save user data
const signupUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        user.displayName = fullName;

        let fullName = firstName + " " + lastName;

        // await saveUserToFirestore(user);
        await saveUserDetails(user.uid, user.displayName , user.email);

        alert("Account created successfully!");
        window.location.href = "dashboard.html"; // Redirect after signup
    } catch (error) {
        console.error("Signup failed:", error);
        alert("Signup failed: " + error.message);
    }
};

// Login with Email & Password
const loginUser = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        window.location.href = "dashboard.html"; // Redirect after login
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed: " + error.message);
    }
};

// Google Authentication (Signup/Login)
const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        await saveUserToFirestore(user);

        alert(`Logged in as ${user.displayName}`);
        window.location.href = "dashboard.html"; // Redirect after login
    } catch (error) {
        console.error("Google login failed:", error);
        alert("Google login failed: " + error.message);
    }
};

// Facebook Authentication (Signup/Login)
const loginWithFacebook = async () => {
    try {
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;

        await saveUserToFirestore(user);

        alert(`Logged in as ${user.displayName}`);
        window.location.href = "dashboard.html"; // Redirect after login
    } catch (error) {
        console.error("Facebook login failed:", error);
        alert("Facebook login failed: " + error.message);
    }
};

// Logout function
const logoutUser = async () => {
    try {
        await signOut(auth);
        alert("Logged out successfully!");
        window.location.href = "login.html"; // Redirect to login
    } catch (error) {
        console.error("Logout failed:", error);
        alert("Logout failed: " + error.message);
    }
};

// Forgot Password (Reset Password)
const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent!");
    } catch (error) {
        console.error("Error sending password reset email:", error);
        alert("Error sending password reset email: " + error.message);
    }
};

// Export functions for use in other files
export { 
    loginUser, 
    signupUser, 
    loginWithGoogle, 
    loginWithFacebook, 
    logoutUser, 
    resetPassword 
};
