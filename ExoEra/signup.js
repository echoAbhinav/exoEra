// Function to save user details to Firestore
async function saveUserDetails(uid, userDetails) {
    try {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
            ...userDetails,
            createdAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error("Error saving user details:", error);
        throw error;
    }
}

document.getElementById("createNewAccount").addEventListener("click", async (e) => {
    e.preventDefault();

    try {
        // Get form values
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const phone = document.getElementById("phone").value.trim();
        const dob = document.getElementById("dob").value;
        const gender = document.getElementById("gender").value;
        const street = document.getElementById("street").value.trim();
        const city = document.getElementById("city").value.trim();
        const state = document.getElementById("state").value.trim();
        const zipcode = document.getElementById("zipcode").value.trim();
        const country = document.getElementById("country").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Basic validation
        if (!firstName || !lastName || !email || !phone || !password) {
            alert("Please fill in all required fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Prepare user data
        const userData = {
            firstName: firstName,
            lastName: lastName,
            fullName: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            dob: dob,
            gender: gender,
            address: {
                street: street,
                city: city,
                state: state,
                zipcode: zipcode,
                country: country
            }
        };

        // Update profile
        await updateProfile(user, {
            displayName: userData.fullName
        });

        // Save to Firestore
        await saveUserDetails(user.uid, userData);

        // Show success message
        alert("Signup successful! Redirecting to login page...");
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

    } catch (error) {
        console.error("Signup error:", error);
        let errorMessage = "Signup failed: ";

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += "This email is already registered.";
                break;
            case 'auth/invalid-email':
                errorMessage += "Invalid email format.";
                break;
            case 'auth/weak-password':
                errorMessage += "Password is too weak.";
                break;
            default:
                errorMessage += error.message;
        }

        alert(errorMessage);
    }
});
