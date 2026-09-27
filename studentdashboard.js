const API_URL = "https://hostelhop-backend.onrender.com/";
const name = localStorage.getItem("studentname");
const welcometext = document.getElementById("welcometext");
const hostelcontainer = document.getElementById("hostelcontainer");
welcometext.innerHTML = `Hello, ${name || "Student"}`;
let hostels = [];
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        logout();
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
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            logout();
            return null;
        }
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
    } catch (error) {

        console.error(error);
        return null;
    }
}
async function fetchWithAuth(url, options = {}) {
    let token = localStorage.getItem("accessToken");
    if (!token) {
        logout();
        return null;
    }
    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`
    };
    let response = await fetch(url, options);
    if (response.status === 401) {
        token = await refreshAccessToken();
        if (!token) {
            return null;
        }
        options.headers = {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        };
        response = await fetch(url, options);
    }
    return response;
}
async function loadHostels() {
    try {
        const response = await fetchWithAuth(
            `${API_URL}/hostels`
        );
        if (!response) {
            return;
        }
        const data = await response.json();
        if (!response.ok) {

            alert(data.detail || "Unable to load hostels.");

            return;
        }
        hostels = data;
        displayHostels();
    } catch (error) {
        console.error(error);
        hostelcontainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Unable to connect to server.
                </div>
            </div>
        `;
    }
}
function displayHostels() {
    hostelcontainer.innerHTML = "";
    if (hostels.length === 0) {
        hostelcontainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    No hostels have been uploaded yet.
                </div>
            </div>
        `;
        return;
    }
    for (let i = 0; i < hostels.length; i++) {

        const hostel = hostels[i];

        const detailBoxId = `details-${i}`;
        const carouselId = `carousel-${i}`;

        const firstImage =
            hostel.images && hostel.images.length > 0
                ? hostel.images[0]
                : null;
        // Create the carousel images
        let carouselImages = "";

        if (hostel.images && hostel.images.length > 0) {

            for (let j = 0; j < hostel.images.length; j++) {

                carouselImages += `
                    <div class="carousel-item ${j === 0 ? "active" : ""}">
                        <img
                            src="${hostel.images[j]}"
                            class="d-block w-100 rounded"
                            style="height:300px; object-fit:cover;"
                        >
                    </div>
                `;
            }
        } else {
            carouselImages = `
                <div class="carousel-item active">
                    <div
                        class="bg-light d-flex justify-content-center align-items-center"
                        style="height:300px;"
                    >
                        No Image Available
                    </div>
                </div>
            `;
        }
        hostelcontainer.innerHTML += `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card hostel-card border-0 shadow-sm h-100">
                ${
                    firstImage
                    ?
                    `
                    <img
                        src="${firstImage}"
                        class="card-img-top"
                        style="height:180px; object-fit:cover;"
                    >
                    `
                    :
                    `
                    <div
                        class="bg-light d-flex justify-content-center align-items-center"
                        style="height:180px;"
                    >
                        No Image Yet
                    </div>
                    `
                }
                <div class="card-body">
                    <h5 class="fw-bold">
                        ${hostel.name}
                    </h5>
                    <p class="text-muted mb-2">
                        ${hostel.university}
                    </p>
                    <h6 class="text-success fw-bold">
                        ₦${Number(hostel.price).toLocaleString()}
                    </h6>
                    <button
                        class="btn btn-outline-success w-100 mt-2"
                        onclick="toggleDetails('${detailBoxId}')"
                    >
                        View Details
                    </button>
                    <div
                        id="${detailBoxId}"
                        style="display:none;"
                        class="mt-3"
                    >
                        <hr>
                        <!-- IMAGE CAROUSEL -->
                        <div
                            id="${carouselId}"
                            class="carousel slide mb-3"
                        >
                            <div class="carousel-inner">
                                ${carouselImages}

                            </div>
                            ${
                                hostel.images &&
                                hostel.images.length > 1
                                ?
                                `
                                <button
                                    class="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#${carouselId}"
                                    data-bs-slide="prev"
                                >
                                    <span class="carousel-control-prev-icon"></span>
                                </button>

                                <button
                                    class="carousel-control-next"
                                    type="button"
                                    data-bs-target="#${carouselId}"
                                    data-bs-slide="next"
                                >
                                    <span class="carousel-control-next-icon"></span>
                                </button>
                                `
                                :
                                ""
                            }
                        </div>
                        <p class="small fw-bold text-muted mb-1">
                            Location:
                        </p>

                        <p class="small text-dark mb-2">
                            ${hostel.location}
                        </p>
                        <p class="small fw-bold text-muted mb-1">
                            Room Type:
                        </p>
                        <p class="small text-dark mb-2">
                            ${hostel.roomtype}
                        </p>
                        <!-- DESCRIPTION -->
                        <p class="small fw-bold text-muted mb-1">
                            Description:
                        </p>
                        <p class="small text-dark mb-3">
                            ${hostel.description}
                        </p>
                        <button
                            class="btn btn-success w-100 fw-bold"
                            onclick="bookWithWhatsApp(${i})"
                        >
                            Book Inspection via WhatsApp
                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;
    }
}
function toggleDetails(elementId) {
    const targetDiv = document.getElementById(elementId);
    if (targetDiv.style.display === "none") {
        targetDiv.style.display = "block";

    } else {

        targetDiv.style.display = "none";
    }
}
function bookWithWhatsApp(index) {
    const chosenHostel = hostels[index];
    if (
        !chosenHostel.lanlordid ||
        !chosenHostel.lanlordid.phonenumber
    ) {
        alert("Landlord WhatsApp number is not available.");
        return;
    }
    let phone = chosenHostel.lanlordid.phonenumber;
    if (phone.startsWith("0")) {
        phone = "234" + phone.substring(1);
    }
    const text =
        "Hello, I want to inspect " +
        chosenHostel.name +
        " at " +
        chosenHostel.university;
    window.open(
        "https://wa.me/" +
        phone +
        "?text=" +
        encodeURIComponent(text),
        "_blank"
    );
}
function logout() {

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("studentname");

    window.location.href = "StudentSignUp.html";
}
loadHostels();