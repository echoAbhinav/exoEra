import { auth, googleProvider, facebookProvider } from "./firebase.js";
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const login = async () => {
        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("pass")?.value;

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful!");
            window.location.href = "index.html"; // Redirect after login
        } catch (error) {
            alert("Login failed: " + error.message);
        }
    };

    // Google login
    document.querySelector(".google")?.addEventListener("click", async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            alert(`Logged in as ${result.user.displayName}`); 
            window.location.href = "index.html"; // Redirect after login
        } catch (error) {
            alert("Google login failed: " + error.message);
        }
    });
    
    // Facebook login
    document.querySelector(".facebook")?.addEventListener("click", async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            alert(`Logged in as ${result.user.displayName}`); 
            window.location.href = "index.html"; // Redirect after login
        } catch (error) {
            alert("Facebook login failed: " + error.message);
        }
    });
    

    // Password visibility toggle
    document.querySelector(".toggle-password")?.addEventListener("click", function () {
        const passwordInput = document.getElementById("pass");
        if (passwordInput) {
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        }
    });

    // Add event listener for login button
    document.getElementById("loginBtn")?.addEventListener("click", login);
});