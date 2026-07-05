 //localstorage.clear(); 

const hostelForm = document.getElementById("hostelForm");
const currentPm = localStorage.getItem("currentPm"); 
hostelForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!currentPm) {
    alert("Error: Please log in again.");
    return;
  }

  const file1 = document.getElementById("img1").files[0];
  const file2 = document.getElementById("img2").files[0];
  const file3 = document.getElementById("img3").files[0];

  const reader1 = new FileReader();
  reader1.onload = function (e1) {
    compressImage(e1.target.result, function(compressed1) {
      
      const reader2 = new FileReader();
      reader2.onload = function (e2) {
        compressImage(e2.target.result, function(compressed2) {
          
          const reader3 = new FileReader();
          reader3.onload = function (e3) {
            compressImage(e3.target.result, function(compressed3) {
      
              saveHostel(compressed1, compressed2, compressed3);
            });
          };
          reader3.readAsDataURL(file3);
        });
      };
      reader2.readAsDataURL(file2);
    });
  };
  reader1.readAsDataURL(file1);
});
function compressImage(base64Str, callback) {
  const img = new Image();
  img.src = base64Str;
  img.onload = function() {
    const canvas = document.createElement("canvas");
    canvas.width = 400; 
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 400, 300);
    callback(canvas.toDataURL("image/jpeg", 0.7)); 
  };
}

function saveHostel(img1, img2, img3) {
  const hostel = {
    name: document.getElementById("hostelName").value,
    university: document.getElementById("university").value,
    location: document.getElementById("location").value,
    price: document.getElementById("price").value,
    roomType: document.getElementById("roomType").value,
    description: document.getElementById("description").value,
    image1: img1,
    image2: img2,
    image3: img3,
    owner: currentPm,
    landlordPhone: document.getElementById("landlordPhone").value
  };

  const hostels = JSON.parse(localStorage.getItem("hostels"))||[];
  hostels.push(hostel);
  localStorage.setItem("hostels", JSON.stringify(hostels));

  alert("Hostel Added Successfully!");
  hostelForm.reset();
  displayHostels(); 
}

function displayHostels() {
  const myHostels = document.getElementById("myHostels");
  const hostels = JSON.parse(localStorage.getItem("hostels")) ;
  myHostels.innerHTML = "";

  const myOwnHostels = hostels.filter(h => h.owner === currentPm);
  if (myOwnHostels.length === 0) {
    myHostels.innerHTML = `<div class="col-12"><div class="card p-3">No Hostels Uploaded Yet</div></div>`;
    return;
  }
  myOwnHostels.forEach(function (hostel) {
    myHostels.innerHTML += `
      <div class="col-12 col-md-6 col-lg-4">
          <div class="card hostel-card shadow-sm border-0 h-100">
              <img src="${hostel.image1}" class="card-img-top" style="height: 160px; object-fit: cover;">
              <div class="card-body">
                  <h5 class="fw-bold">${hostel.name}</h5>
                  <p class="text-muted mb-1">${hostel.university}</p>
                  <h6 class="text-success fw-bold">₦${hostel.price}</h6>
              </div>
          </div>
      </div>`;
  });
}
displayHostels();
//  localStorage.removeItem("currentPm"); 