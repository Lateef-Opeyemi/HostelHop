const API_URL = "https://hostelhop-backend.onrender.com/";
const hostelForm = document.getElementById("hostelForm");
const myHostels = document.getElementById("myHostels");
const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const pmName = localStorage.getItem("pmName");
let editingHostelId = null;
document.getElementById("welcomepm").innerHTML =
    `Hello ${pmName || "Property Manager"}`;
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
            alert("Your session has expired. Please login again.");
            logout();
            return null;
        }
        localStorage.setItem(
            "accessToken",
            data.accessToken
        );
        return data.accessToken;
    } catch (error) {
        console.error(error);
        alert("Unable to refresh your session.");
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
    // Access token expired
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
function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function () {
            reject(reader.error);
        };
        reader.readAsDataURL(file);
    });
}
hostelForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name =
        document.getElementById("hostelName").value.trim();

    const university =
        document.getElementById("university").value.trim();

    const location =
        document.getElementById("location").value.trim();

    const price =
        Number(document.getElementById("price").value);

    const roomtype =
        document.getElementById("roomType").value;

    const description =
        document.getElementById("description").value.trim();

    const file1 =
        document.getElementById("img1").files[0];
    const file2 =
        document.getElementById("img2").files[0];
    const file3 =
        document.getElementById("img3").files[0];
    if (!name || !university || !location ||
        !price || !roomtype || !description) {
        alert("Please fill all hostel details.");
        return;
    }
    if (editingHostelId) {
        const hostelData = {
            name,
            university,
            location,
            price,
            roomtype,
            description
        };
        if (file1 || file2 || file3) {
            if (!file1 || !file2 || !file3) {
                alert("Please select all 3 images when changing images.");
                return;
            }
            hostelData.images = [
                await imageToBase64(file1),
                await imageToBase64(file2),
                await imageToBase64(file3)
            ];
        }
        try {
            const response = await fetchWithAuth(
                `${API_URL}/hostels/${editingHostelId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(hostelData)
                }
            );

            if (!response) return;
            const data = await response.json();
            if (!response.ok) {
                alert(data.detail || "Unable to update hostel.");
                return;
            }
            alert("Hostel updated successfully!");
            cancelEdit();
            loadMyHostels();
        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server.");

        }
        return;
    }

    if (!file1 || !file2 || !file3) {
        alert("Please select all 3 hostel images.");
        return;
    }
    try {
        const images = [
            await imageToBase64(file1),
            await imageToBase64(file2),
            await imageToBase64(file3)

        ];
        const hostelData = {
            name,
            university,
            location,
            price,
            roomtype,
            description,
            images
        };
        const response = await fetchWithAuth(
            `${API_URL}/hostels`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(hostelData)
            }
        );

        if (!response) return;
        const data = await response.json();

        if (!response.ok) {
            alert(data.detail || "Unable to add hostel.");
            return;
        }
        alert("Hostel added successfully!");
        hostelForm.reset();
        loadMyHostels();
    } catch (error) {
        console.error(error);
        alert("Unable to connect to the server.");
    }
});
async function loadMyHostels() {
    try {
        const response = await fetchWithAuth(
            `${API_URL}/hostels/my-hostels`
        );
        if (!response) return;
        const data = await response.json();
        if (!response.ok) {
            alert(data.detail || "Unable to load hostels.");
            return;
        }
        displayHostels(data.hostels);
    } catch (error) {
        console.error(error);
        myHostels.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Unable to load your hostels.
                </div>
            </div>

        `;
    }
}
function displayHostels(hostels) {
    myHostels.innerHTML = "";
    if (!hostels || hostels.length === 0) {
        myHostels.innerHTML = `
            <div class="col-12">
                <div class="card hostel-card shadow-sm border-0">
                    <div class="card-body">
                        No Hostels Uploaded Yet
                    </div>
                </div>
            </div>
        `;
        return;
    }
    hostels.forEach(function (hostel) {
        const image = hostel.images &&
                      hostel.images.length > 0
                      ? hostel.images[0]
                      : "";
        myHostels.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card hostel-card shadow-sm border-0 h-100">
                    ${
                        image
                        ?

                        `<img
                            src="${image}"
                            class="card-img-top"
                            style="height:160px; object-fit:cover;"
                        >`

                        :

                        `<div
                            class="bg-light d-flex justify-content-center align-items-center"
                            style="height:160px;"
                        >
                            No Image
                        </div>`
                    }
                    <div class="card-body">
                        <h5 class="fw-bold">
                            ${hostel.name}
                        </h5>
                        <p class="text-muted mb-1">
                            ${hostel.university}
                        </p>
                        <p class="small text-muted mb-1">
                            ${hostel.location}
                        </p>
                        <p class="small mb-2">
                            ${hostel.roomtype}
                        </p>
                        <h6 class="fw-bold text-success">
                            ₦${hostel.price}
                        </h6>
                        <p class="small text-muted">
                            ${hostel.description}
                        </p>
                        <div class="d-flex gap-2 mt-3">
                            <button
                                class="btn btn-main btn-sm flex-fill"
                                onclick="editHostel('${hostel._id}')"
                            >
                                Update
                            </button>
                            <button
                                class="btn btn-danger btn-sm flex-fill"
                                onclick="deleteHostel('${hostel._id}')"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}
async function editHostel(id) {
    try {
        const response = await fetchWithAuth(
            `${API_URL}/hostels/${id}`
        );
        if (!response) return;
        const hostel = await response.json();
        if (!response.ok) {
            alert(hostel.detail || "Unable to load hostel.");
            return;
        }
        editingHostelId = id;
        document.getElementById("hostelName").value =
            hostel.name;
        document.getElementById("university").value =
            hostel.university;
        document.getElementById("location").value =
            hostel.location;
        document.getElementById("price").value =
            hostel.price;
        document.getElementById("roomType").value =
            hostel.roomtype;
        document.getElementById("description").value =
            hostel.description;
        formTitle.textContent = "Update Hostel";
        submitButton.textContent = "Update Hostel";
        cancelEditButton.style.display = "inline-block";
        // Images are not required when  editing details.
        document.getElementById("img1").required = false;
        document.getElementById("img2").required = false;
        document.getElementById("img3").required = false;
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    } catch (error) {
        console.error(error);
        alert("Unable to load hostel.");
    }
}
function cancelEdit() {
    editingHostelId = null;
    hostelForm.reset();
    formTitle.textContent = "Add New Hostel";
    submitButton.textContent = "Add Hostel";
    cancelEditButton.style.display = "none";
    document.getElementById("img1").required = true;
    document.getElementById("img2").required = true;
    document.getElementById("img3").required = true;
}
async function deleteHostel(id) {
    const confirmDelete =
        confirm("Are you sure you want to delete this hostel?");
    if (!confirmDelete) {
        return;
    }
    try {
        const response = await fetchWithAuth(
            `${API_URL}/hostels/${id}`,
            {
                method: "DELETE"
            }
        );
        if (!response) return;
        const data = await response.json();
        if (!response.ok) {
            alert(data.detail || "Unable to delete hostel.");
            return;
        }
        alert("Hostel deleted successfully!");
        loadMyHostels();
    } catch (error) {
        console.error(error);
        alert("Unable to connect to the server.");
    }
}
function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("pmName");
    localStorage.removeItem("currentPm");
    window.location.href = "PMSignUp.html";
}
const accessToken = localStorage.getItem("accessToken");
if (!accessToken) {
    window.location.href = "PMSignUp.html";
} else {
    loadMyHostels();
}