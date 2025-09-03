// Navbar Menu
const optionBtn = document.getElementById("option");
const dropdown = document.getElementById("dropdownMenu");

// Toggle dropdown on click
optionBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // don’t close immediately
  dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target) && !optionBtn.contains(e.target)) {
    dropdown.style.display = "none";
  }
});

const uploadBtn = document.getElementById("upload-reviews");
const reviewSection = document.getElementById("two-part");
const mainSection = document.getElementById("main-section");

uploadBtn.addEventListener("click", () => {
  mainSection.classList.add("hidden");
  uploadBtn.classList.add("hidden");
  reviewSection.classList.remove("hidden");
});





document.getElementById("camera-button").addEventListener("click", function () {
  document.getElementById("review-photo").click();
});
const cameraButton = document.getElementById("camera-button");
const chooseButton = document.getElementById("choose-button");
const reviewPhotoInput = document.getElementById("review-photo");
const photoFileInput = document.getElementById("photo-file");

// cameraButton.addEventListener("click", () => {
//   reviewPhotoInput.click();
// });

chooseButton.addEventListener("click", () => {
  photoFileInput.click();
});

const previewContainer = document.getElementById("photo-preview-container");

function showPreview(inputElement) {
  const file = inputElement.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    previewContainer.innerHTML = `<img src="${e.target.result}" />`;
  };
  reader.readAsDataURL(file);
}

reviewPhotoInput.addEventListener("change", () =>
  showPreview(reviewPhotoInput)
);
photoFileInput.addEventListener("change", () => showPreview(photoFileInput));

// finding vendors
function showVendors() {
  // Show vendor section
  document.getElementById("event-vendor-section").style.display = "block";

  // Hide other sections (optional - change IDs to match your layout)
  const homeSection = document.getElementById("home-section"); // Replace with your homepage section ID
  if (homeSection) homeSection.style.display = "none";
}

function goBackFromVendors() {
  // Hide vendor section
  document.getElementById("event-vendor-section").style.display = "none";

  // Show other sections again
  const homeSection = document.getElementById("home-section"); // Replace with your homepage section ID
  if (homeSection) homeSection.style.display = "block";
}

// Scroll to vendor booking section:
document.addEventListener("DOMContentLoaded", function () {
  const findVendorsBtn = document.getElementById("find-vendors-btn");
  const vendorSection = document.getElementById("event-vendor-section");

  findVendorsBtn.addEventListener("click", function () {
    // Make sure vendor section is visible
    vendorSection.style.display = "block";

    // Scroll to vendor section smoothly
    vendorSection.scrollIntoView({ behavior: "smooth" });
  });
});

// Toggle vendor details:
function toggleVendors() {
  const vendorSection = document.getElementById("event-vendor-section");
  const findBtn = document.getElementById("find-vendors-btn");

  if (vendorSection.style.display === "none" || vendorSection.style.display === "") {
    vendorSection.style.display = "block";
    findBtn.textContent = "Hide Vendors";
  } else {
    vendorSection.style.display = "none";
    findBtn.textContent = "Find Vendors";
  }
}

// New Reviews Storing Dynamically:
// New Reviews Storing Dynamically:
document.getElementById('review-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  previewContainer.innerHTML = "";

  const formData = new FormData(this);  // ⬅️ collects all inputs, including file input

  console.log("📩 Sending:", [...formData]); // debug log

  await fetch('/submit', {
    method: 'POST',
    body: formData   // ⬅️ no headers, browser sets them automatically
  });

  this.reset();
  loadUsers();
});




async function loadUsers() {
  const res = await fetch("/getAllReviews");
  const reviews = await res.json();

  const allReviews = document.getElementById("userReviews");
  // allUser.innerHTML = "<h2>Hello Dosto</h2>";
  allReviews.innerHTML = ""; // Clear previous content

  reviews.forEach(rev => {
    allReviews.innerHTML += ` 
    <div class="newReviews">
      <div class="newImg">
        <img src="${rev.photo}" alt="img" loading="lazy">
      </div>
      <div class="newDetail">
        <div class="main">
          <p id="p1">${rev.stallName} ${"⭐".repeat(rev.overallRating)}</p>
          <p id="p2">View</p>
        </div>
        <p>Location : ${rev.stallLocation}</p>
        <p>Dishes : ${rev.dishName}</p>
        <p>Review : ${rev.reviewText}</p>
        <p>Hygiene : ${rev.hygieneCondition}</p>
        <div class="giveReview">
          <div class="satisfyButton">
            <button id="b1">Worth It👌</button>
            <button id="b2">👎Not Satisfied</button>
          </div>
          <div class="report">
            <p>Report</p>
          </div>
        </div>
      </div>
    </div>`;
  });
}

loadUsers();


// New Vendors Data Storing Dynamically:
document.getElementById('venderForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);  // ⬅️ collects all inputs, including file input

  await fetch('/vendorData', {
    method: 'POST',
    body: formData   // ⬅️ no headers, browser sets them automatically
  });

  this.reset();
});


// Login_form
const signIn = document.querySelector("#sign-in");
const vendorRegister = document.querySelector("#vendor-register");
const loginForm = document.querySelector(".login-container");
signIn.addEventListener("click", () => {
  loginForm.style.display = "block";
  mainSection.style.display = "none";
  uploadBtn.style.display = "none";
})

// Toggle password visibility
const toggle = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

toggle.addEventListener("click", () => {
  const currentType = passwordInput.getAttribute("type");

  if (currentType === "password") {
    passwordInput.setAttribute("type", "text");      // Show password
    toggle.textContent = "🙈";                        // Change icon
  } else {
    passwordInput.setAttribute("type", "password");  // Hide password
    toggle.textContent = "👁️";                        // Change icon back
  }
});

// Vendor-Registration
document.addEventListener("DOMContentLoaded", function () {
  const vendorRegistration = document.querySelector(".vendor-registration"); // class selector
  const form = document.getElementById("vendorForm");
  const successMsg = document.getElementById("successMsg");

  function showPage() {
    vendorRegistration.style.display = "flex";
    mainSection.style.display = "none";
    document.querySelector(".search-section").style.display = "none";
    document.querySelector(".popular-tags").style.display = "none";


  }

  vendorRegister.addEventListener("click", () => {
    showPage();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const vendorData = {
      stallName: document.getElementById("stallName").value,
      ownerName: document.getElementById("ownerName").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      location: document.getElementById("location").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      accountNumber: document.getElementById("accountNumber").value,
      ifsc: document.getElementById("ifsc").value,
      description: document.getElementById("description").value
    };

    console.log("Vendor Data Submitted:", vendorData);

    // Show success message
    successMsg.style.display = "block";

    // Optional: hide after 5 seconds
    setTimeout(() => {
      successMsg.style.display = "none";
    }, 5000);

    // Clear form
    form.reset();
  });
});

// Back Button
const backBtn = document.getElementById("back-btn");
const heroButtons = document.querySelector(".hero-buttons");
const vendorSection = document.getElementById("event-vendor-section");
// const reviewSection = document.getElementById("two-part");
// const vendorRegister = document.querySelector(".vendor-registration");
// const mainSection = document.getElementById("main-section");

// Book Vendors button
document.getElementById("find-vendors-btn").addEventListener("click", () => {
  mainSection.style.display = "none";
  vendorSection.style.display = "block";
  backBtn.style.display = "inline-block";
});

// Upload Reviews button
document.getElementById("upload-reviews").addEventListener("click", () => {
  mainSection.style.display = "none";
  reviewSection.style.display = "flex";
  backBtn.style.display = "inline-block";
});

// Vendor Register button
document.getElementById("vendor-register").addEventListener("click", () => {
  mainSection.style.display = "none";
  vendorRegister.style.display = "block";
  backBtn.style.display = "inline-block";
});

// Back button logic


// Initialize map (default center = Bhawanipatna)
var map = L.map("map").setView([19.9075, 83.1661], 13);

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Example marker (food stall)
L.marker([19.9075, 83.1661])
  .addTo(map)
  .bindPopup("<b>Example Food Stall</b><br>Bhawanipatna, Odisha");

// Try to get user location
map.locate({ setView: true, maxZoom: 16 });

// If location is found
map.on("locationfound", function (e) {
  L.marker(e.latlng, {
    icon: L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    })
  })
    .addTo(map)
    .bindPopup("📍 You are here")
    .openPopup();

  // Optionally, add accuracy circle
  L.circle(e.latlng, { radius: e.accuracy }).addTo(map);
});

// If location fails
map.on("locationerror", function () {
  alert("Unable to get your location. Please enable GPS or allow browser location access.");
});