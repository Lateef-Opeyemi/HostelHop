const API_URL = "https://hostelhop-backend.onrender.com/";
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;

        if (name === "") {
            alert("The name field is required.");
            return;
        }
        if (email === "") {
            alert("The email field is required.");
            return;
        }

        if (password === "") {
            alert("The password field is required.");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/users/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    role: "student"
                })
            });

            const data = await response.json();
            if (!response.ok) {
                alert(data.detail || "Signup failed.");
                return;
            }

            localStorage.setItem("studentname", name);
            alert("Student account created successfully!");

            window.location.href = "StudentSignUp.html";

        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server.");
        }
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("loginName").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (name === "") {
            alert("Please enter your name or email.");
            return;
        }

        if (password === "") {
            alert("Please enter your login password.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nameOremail: name,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.detail || "Invalid name/email or password.");
                return;
            }

            localStorage.setItem(
                "accessToken",
                data.token.accesstoken
            );

            localStorage.setItem(
                "refreshToken",
                data.token.refreshtoken
            );

            localStorage.setItem("studentname", name);

            alert("Login successful!");

            window.location.href = "studentdashboard.html";

        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server.");
        }
    });
}