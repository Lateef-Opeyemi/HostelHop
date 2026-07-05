const pmSignupForm = document.getElementById("pmSignupForm");
if (pmSignupForm) {
    pmSignupForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const phone = document.getElementById("signupPhone").value.trim();
        const password = document.getElementById("signupPassword").value.trim();
        const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        localStorage.setItem("pmEmail", email);
        localStorage.setItem("pmPassword", password);
        localStorage.setItem("pmName", name); 
        alert("Property Manager account created successfully!");

localStorage.setItem("currentPm", email);
        window.location.href = "PMdashboard.html"; 
    });
}
const pmLoginForm = document.getElementById("pmLoginForm");

if (pmLoginForm) {
    pmLoginForm.addEventListener("submit", function(e) {
        e.preventDefault(); 
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        const savedEmail = localStorage.getItem("pmEmail");
        const savedPassword = localStorage.getItem("pmPassword");
        if (email === savedEmail && password === savedPassword) {
            alert("Login successful!");
        
localStorage.setItem("currentPm", email);
            window.location.href = "PMdashboard.html";
        } else {
            alert("Invalid email or password. Please check details or signup first.");
        }
    });
}