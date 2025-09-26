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
  document.getElementById("event-vendor-section").style.display = "flex";

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
  const vendorHead = document.getElementById("bookVendorHead");

  findVendorsBtn.addEventListener("click", function () {
    // Make sure vendor section is visible
    vendorSection.style.display = "flex";

    // Scroll to vendor section smoothly
    vendorHead.scrollIntoView({ behavior: "smooth" });
  });
});



// Toggle vendor details:
// const findBtn = document.getElementById("find-vendors-btn");
// findBtn.addEventListener('click', () => {
//   document.getElementById("bookVendorHead").style.display = "block";
// })

// scroll to userReviews when click explore reviews button
exploreReviews = document.getElementById("explore-reviews");
exploreReviews.addEventListener("click", () => {
  const reviewsSection = document.getElementById("streetEatsReview");
  if (reviewsSection) {
    reviewsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});



function showVendorBooking() {
  document.getElementById('bookVendorHead').style.display = 'block';
}

function hideVendorBooking() {
  document.getElementById('bookVendorHead').style.display = 'none';
  // document.getElementById('event-vendor-section').style.display = 'none';
}



// Toast () for popup successful msg
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;

  toast.className = "toast " + type;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


// New Reviews Storing Dynamically:
// New Reviews Storing Dynamically:
const loader = document.getElementById("loader");
document.getElementById('review-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  previewContainer.innerHTML = "";

  const loader = document.getElementById("loader-overlay");
  loader.style.display = "flex"; // show loader

  const formData = new FormData(this); // collects all inputs (including file input)

  try {
    const res = await fetch('/submit', {
      method: 'POST',
      body: formData // no headers needed for FormData
    });

    loader.style.display = "none"; // hide loader

    if (res.ok) {
      this.reset();
      previewContainer.innerHTML = "";

      showToast("✅ Review submitted successfully!", "success");

      await loadUsers(); // reload all reviews

      // ✅ Scroll to the last added review
      const reviewsContainer = document.getElementById("userReviews");
      if (reviewsContainer && reviewsContainer.firstElementChild) {
        const newReview = reviewsContainer.firstElementChild;

        // Add highlight effect
        newReview.classList.add("highlight-review");

        // Smooth scroll
        newReview.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        // Remove highlight after 2s
        setTimeout(() => {
          newReview.classList.remove("highlight-review");
        }, 2000);
      }
    } else {
      showToast("❌ Error submitting review", "error");
    }
  } catch (err) {
    loader.style.display = "none"; // hide loader if error
    console.error("⚠️ Error:", err);
    showToast("⚠️ Something went wrong!", "error");
  }
});







async function loadUsers() {
  const res = await fetch("/getAllReviews");
  const reviews = await res.json();

  const allReviews = document.getElementById("userReviews");
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
            <p class="viewBtn" data-location="${rev.stallLocation}" data-lat="${rev.latitude}" data-lng="${rev.longitude}">📍 View</p>
          </div>
          <p>Location : ${rev.stallLocation}</p>
          <p>Dishes : ${rev.dishName}</p>
          <p>Review : ${rev.reviewText}</p>
          <p>Hygiene : ${rev.hygieneCondition}</p>
          <p>Rating : ${rev.overallRating}</p>
              <p>
                ${new Date(rev.createdAt).getDate()}/
                ${new Date(rev.createdAt).getMonth() + 1}/
                ${new Date(rev.createdAt).getFullYear()} ,
                ${(() => {
                    const date = new Date(rev.createdAt);
                    let hours = date.getHours();
                    const minutes = String(date.getMinutes()).padStart(2, "0");
                    const ampm = hours >= 12 ? "PM" : "AM";
                    hours = hours % 12 || 12; // convert 0 → 12, 13 → 1
                    return `${hours}:${minutes} ${ampm}`;
                })()}
              </p>

          <div class="giveReview">
            <div class="satisfyButton">
              <button id="b1">Worth It👌</button>
              <button id="b2">👎Not Satisfied</button>
            </div>
            <div class="report">
              <p class="reportBtn">🚨 Report</p>
            </div>
          </div>
        </div>
      </div>`;
  });

  // Attach listeners AFTER rendering
  document.querySelectorAll(".viewBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const stallLoc = btn.getAttribute("data-location");
      const lat = btn.getAttribute("data-lat");
      const lng = btn.getAttribute("data-lng");


      console.log("Opening map with:", stallLoc, lat, lng);
      getLocation(stallLoc, lat, lng);
    });
  });


  document.querySelectorAll(".reportBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const popup = document.getElementById("popup");
      popup.style.display = "flex";
    });
  });
}
loadUsers();


document.getElementById("getLocationBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          document.getElementById("latitude").value = position.coords.latitude;
          document.getElementById("longitude").value = position.coords.longitude;
          alert("✅ Location added successfully!");
        },
        (error) => {
          alert("⚠️ Location access denied or unavailable.");
        }
      );
    } else {
      alert("❌ Geolocation is not supported by this browser.");
    }
  });


// 🔍 Handle search
document.getElementById("searchBtn").addEventListener("click", async () => {
  const location = document.getElementById("searchLocation").value.trim();
  const food = document.getElementById("searchFood").value.trim();

  const allReviews = document.getElementById("search-result");
  allReviews.innerHTML = "<h2>Search Results</h2>"; // reset with heading
  allReviews.style.display = "flex"; // show the results section.

  try {
    const res = await fetch(`/searchReviews?location=${location}&food=${food}`);
    const reviews = await res.json();

    if (reviews.length === 0) {
      allReviews.innerHTML += "<p>No matching reviews found.</p>";
    } else {
      reviews.forEach(rev => {
        allReviews.innerHTML += ` 
          <div class="newReviews">
            <div class="newImg">
              <img src="${rev.photo}" alt="img" loading="lazy">
            </div>
            <div class="newDetail">
              <div class="main">
                <p id="p1">${rev.stallName} ${"⭐".repeat(rev.overallRating)}</p>
                <p class="viewBtn" 
                data-location="${rev.stallLocation}" 
                data-lat="${rev.latitude}" 
                data-lng="${rev.longitude}">📍 View</p>

              </div>
              <p>Location : ${rev.stallLocation}</p>
              <p>Dishes : ${rev.dishName}</p>
              <p>Review : ${rev.reviewText}</p>
              <p>Hygiene : ${rev.hygieneCondition}</p>
               <p>Rating : ${rev.overallRating}</p>
               <p>
                ${new Date(rev.createdAt).getDate()}/
                ${new Date(rev.createdAt).getMonth() + 1}/
                ${new Date(rev.createdAt).getFullYear()} ,
                ${(() => {
                    const date = new Date(rev.createdAt);
                    let hours = date.getHours();
                    const minutes = String(date.getMinutes()).padStart(2, "0");
                    const ampm = hours >= 12 ? "PM" : "AM";
                    hours = hours % 12 || 12; // convert 0 → 12, 13 → 1
                    return `${hours}:${minutes} ${ampm}`;
                })()}
              </p>

              <div class="giveReview">
                <div class="satisfyButton">
                  <button class="b1">Worth It👌</button>
                  <button class="b2">👎Not Satisfied</button>
                </div>
                <div class="report">
                  <p class="reportBtn">🚨 Report</p>
                </div>
              </div>
            </div>
          </div>`;
      });

      // ✅ Attach event listeners to "View" buttons
      document.querySelectorAll(".viewBtn").forEach(btn => {
        btn.addEventListener("click", () => {
          const stallLoc = btn.getAttribute("data-location");
          const lat = btn.getAttribute("data-lat");
          const lng = btn.getAttribute("data-lng");

          console.log("Opening map with:", stallLoc, lat, lng);
          getLocation(stallLoc, lat, lng);
        });
      });


      // ✅ Attach event listeners to "Report" buttons
      document.querySelectorAll(".reportBtn").forEach(btn => {
        btn.addEventListener("click", () => {
          document.getElementById("popup").style.display = "flex";
        });
      });
    }

    allReviews.scrollIntoView({ behavior: "smooth" });

  } catch (err) {
    console.error("❌ Error searching:", err);
  }
});






function getLocation(location, latitude, longitude) {
  // Check if both latitude and longitude are valid numbers
  if (typeof latitude === "number" && typeof longitude === "number") {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, "_blank");
  } else {
    // Fallback: open using text location entered by user
    window.open(`https://www.google.com/maps?q=${encodeURIComponent(location)}`, "_blank");
  }
}





// Popup logic (only ONE popup in HTML, not inside forEach)
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const submitReport = document.getElementById("submitReport");

// Close popup
closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

// Submit report
submitReport.addEventListener("click", () => {
  const remark = document.getElementById("remark").value;
  if (remark.trim() === "") {
    alert("Please enter your remark before submitting.");
  } else {
    alert("Report submitted: " + remark);
    popup.style.display = "none";
    document.getElementById("remark").value = "";
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

});



// New Vendors Data Storing Dynamically:
// Vendor Registration with Loader
document.getElementById('vendorForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const submitBtn = this.querySelector("button[type='submit']");
  const overlay = document.getElementById("loader-overlay");

  const formData = new FormData(this); // ✅ keep as FormData (not JSON)

  submitBtn.classList.add("loading");
  const overlayTimeout = setTimeout(() => { overlay.style.display = "flex"; }, 1500);

  try {
    const res = await fetch('/vendorData', {
      method: 'POST',
      body: formData // ✅ don't set Content-Type, fetch will handle it
    });

    if (res.ok) {
      showToast("✅ Vendor registered successfully! ", "success");
      this.reset();
      loadVendors();

    } else {
      const err = await res.json();
      showToast("❌ " + (err.message || "Error saving vendor data"), "error");
    }
  } catch (err) {
    console.error("⚠️ Error:", err);
    showToast("⚠️ Something went wrong!", "error");
  } finally {
    clearTimeout(overlayTimeout);
    overlay.style.display = "none";
    submitBtn.classList.remove("loading");
  }
});


async function loadVendors() {
  const res = await fetch("/getAllVendors");
  const vendors = await res.json();

  const allVendors = document.getElementById("event-vendor-section");
  allVendors.innerHTML = "";

  vendors.forEach(v => {
    allVendors.innerHTML += ` 
      <div class="event-vendor-card">
        <img src="${v.photo}" alt="vendorStallImage">

        <h3>${v.stallName}</h3>

        <p><strong>Special Dishes:</strong> ${v.description}</p>
        <p><strong>Location:</strong> ${v.city}, ${v.state}</p>
        <p><strong>Contact:</strong> ${v.phone}</p>
        <p><strong>Price Range:</strong> ₹2000 - ₹5000 per event</p>
        <p><strong>Rating:</strong> ⭐⭐⭐⭐ (4.5/5)</p>

        <button class="book-btn">Book Now</button>
      </div>`;
  });
}

loadVendors();




// Login_form
const signIn = document.querySelector("#sign-in");
const vendorRegister = document.querySelector("#vendor-register");
const loginForm = document.querySelector(".login-container");
signIn.addEventListener("click", () => {
  loginForm.style.display = "block";
  mainSection.style.display = "none";
  // uploadBtn.style.display = "none";
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

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;

  // Reset classes
  toast.className = "toast " + type;

  // Show toast
  toast.classList.add("show");

  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


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
