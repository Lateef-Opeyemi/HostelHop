const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault(); 

        const name = document.getElementById("signupName").value.trim();
        const password = document.getElementById("signupPassword").value.trim();

        if (name === "") {
            alert("The name field is required.");
            return;
        }
        if (password === "") {
            alert("The password field is required.");
            return;
        }
        localStorage.setItem("studentname", name);
        localStorage.setItem("studentpassword", password); 
        alert("Account created successfully!");
        window.location.href = "studentdashboard.html";
    });
}
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const name = document.getElementById("loginName").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        if (name === "") {
            alert("Please enter your login name.");
            return;
        }
        if (password === "") {
            alert("Please enter your login password.");
            return;
        }
        
        const savedName = localStorage.getItem("studentname");
        const savedPassword = localStorage.getItem("studentpassword");

        if (name === savedName && password === savedPassword) {
            alert("Login successful!");
            window.location.href = "studentdashboard.html";
        } else {
            alert("Invalid name or password. Please sign up first!");
        }
    });
}