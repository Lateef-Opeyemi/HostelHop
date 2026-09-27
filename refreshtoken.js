async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        window.location.href = "StudentSignUp.html";
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/users/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refreshToken: refreshToken
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.detail || "Session expired. Please login again.");

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            window.location.href = "StudentSignUp.html";
            return null;
        }

        // Save the new access token
        localStorage.setItem("accessToken", data.accessToken);

        return data.accessToken;

    } catch (error) {
        console.error(error);
        alert("Unable to refresh your session.");
        return null;
    }
}