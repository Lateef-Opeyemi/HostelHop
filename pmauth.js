const API_URL = "https://hostelhop-backend.onrender.com";
const pmSignupForm = document.getElementById("pmSignupForm");

if (pmSignupForm) {
    pmSignupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const phone = document.getElementById("signupPhone").value.trim();
        const password = document.getElementById("signupPassword").value;

        try {
            const response = await fetch(`${API_URL}/users/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phonenumber: phone,
                    password: password,
                    role: "landlord"
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.detail || "Signup failed");
                return;
            }

            alert("Property Manager account created successfully!");

            localStorage.setItem("pmName", name);

            window.location.href = "PMSignUp.html";

        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server.");
        }
    });
}


const pmLoginForm = document.getElementById("pmLoginForm");

if (pmLoginForm) {
    pmLoginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch(`${API_URL}/users/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nameOremail: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.detail || "Invalid email or password");
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

            localStorage.setItem("currentPm", email);

            alert("Login successful!");

            window.location.href = "PMdashboard.html";

        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server.");
        }
    });
}