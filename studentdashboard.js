// localStorage.clear();
const name = localStorage.getItem("studentname") 
document.getElementById("welcometext").innerHTML = `Hello, ${name}`;
const hostelcontainer = document.getElementById("hostelcontainer");
const hostels = JSON.parse(localStorage.getItem("hostels")) ;
hostelcontainer.innerHTML = "";

for (let i = 0; i < hostels.length; i++) {
  const hostel = hostels[i];
  const detailBoxId = "details-" + i; 
hostelcontainer.innerHTML += `
<div class="col-12 col-md-6 col-lg-4">
    <div class="card hostel-card border-0 shadow-sm h-100">

        <img src="${hostel.image1}" class="card-img-top" style="height:180px; object-fit:cover;">

        <div class="card-body">

            <h5 class="fw-bold">${hostel.name}</h5>

            <p class="text-muted mb-2">${hostel.university}</p>

            <h6 class="text-success fw-bold">₦${hostel.price}</h6>

            <button class="btn btn-outline-success w-100 mt-2"
                onclick="toggleDetails('${detailBoxId}')">
                View Details
            </button>

            <div id="${detailBoxId}" style="display:none;" class="mt-3">
                <hr>

              
                <div id="carousel${i}" class="carousel slide mb-3">

                    <div class="carousel-inner">

                        <div class="carousel-item active">
                            <img src="${hostel.image1}"
                                class="d-block w-100 rounded"
                                style="height:300px; object-fit:cover;">
                        </div>

                        <div class="carousel-item">
                            <img src="${hostel.image2}"
                                class="d-block w-100 rounded"
                                style="height:300px; object-fit:cover;">
                        </div>

                        <div class="carousel-item">
                            <img src="${hostel.image3}"
                                class="d-block w-100 rounded"
                                style="height:300px; object-fit:cover;">
                        </div>

                    </div>

                    <button class="carousel-control-prev"
                        type="button"
                        data-bs-target="#carousel${i}"
                        data-bs-slide="prev">

                        <span class="carousel-control-prev-icon"></span>

                    </button>

                    <button class="carousel-control-next"
                        type="button"
                        data-bs-target="#carousel${i}"
                        data-bs-slide="next">

                        <span class="carousel-control-next-icon"></span>

                    </button>

                </div>

                <p class="small fw-bold text-muted mb-1">
                    Room Type:
                </p>

                <p class="small text-dark mb-2">
                    ${hostel.roomType}
                </p>

                <p class="small fw-bold text-muted mb-1">
                    Description:
                </p>

                <p class="small text-dark mb-3">
                    ${hostel.description}
                </p>

                <button class="btn btn-success w-100 fw-bold"
                    onclick="bookWithWhatsApp(${i})">

                    Book Inspection via WhatsApp

                </button>

            </div>

        </div>

    </div>

</div>
`;
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

  const booked = JSON.parse(localStorage.getItem("bookedInspections")) || [];
  booked.push(chosenHostel);
  localStorage.setItem("bookedInspections", JSON.stringify(booked));


  const phone = chosenHostel.landlordPhone;

  const text =
    "Hello, I want to inspect " +
    chosenHostel.name +
    " at " +
    chosenHostel.university;

  window.open(
    "https://wa.me/" + phone + "?text=" + encodeURIComponent(text),
    "_blank"
  );
}
