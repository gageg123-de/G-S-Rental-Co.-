const bookingKey = "gsEventCoBookings";
const adminPassword = "admin123";

const addOns = [
  {
    name: "Additional Animal Hopper",
    description: "Add another ride-on animal for additional play options.",
    price: "$25"
  },
  {
    name: "Additional Ball Color",
    description: "Add a second ball color to match your event theme.",
    price: "$15"
  },
  {
    name: "Toddler Table & Chairs",
    description: "Child-sized table and chair setup for snacks, crafts, and activities.",
    price: "$50"
  }
];

const addonCards = document.querySelector("#addonCards");
const bookingForm = document.querySelector("#bookingForm");
const bookingMessage = document.querySelector("#bookingMessage");
const adminPanel = document.querySelector("#adminPanel");
const bookingPreview = document.querySelector("#bookingPreview");
const loginButton = document.querySelector("#loginButton");
const loginMessage = document.querySelector("#loginMessage");
const exportJson = document.querySelector("#exportJson");
const clearBookings = document.querySelector("#clearBookings");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

function getBookings() {
  return JSON.parse(localStorage.getItem(bookingKey) || "[]");
}

function saveBookings(bookings) {
  localStorage.setItem(bookingKey, JSON.stringify(bookings));
}

function renderAddonCards() {
  addonCards.innerHTML = addOns
    .map(
      (addon) => `
        <article class="addon-card">
          <div class="addon-visual" aria-hidden="true"><div class="addon-icon"></div></div>
          <h3>${addon.name}</h3>
          <p>${addon.description}</p>
          <strong>${addon.price}</strong>
        </article>
      `
    )
    .join("");
}

function renderBookings() {
  const bookings = getBookings();

  if (!bookings.length) {
    bookingPreview.innerHTML = '<p class="form-message">No booking requests yet.</p>';
    return;
  }

  bookingPreview.innerHTML = bookings
    .map(
      (booking) => `
        <article class="booking-item">
          <h3>${booking.package}</h3>
          <dl>
            <dt>Selected Package</dt>
            <dd>${booking.package}</dd>
            <dt>Selected Add-ons</dt>
            <dd>${booking.addons.length ? booking.addons.join(", ") : "None selected"}</dd>
            <dt>Customer</dt>
            <dd>${booking.name}<br>${booking.email}<br>${booking.phone}</dd>
            <dt>Event Date/Time</dt>
            <dd>${booking.eventDate} at ${booking.eventTime}</dd>
            <dt>Event Location</dt>
            <dd>${booking.location}</dd>
            <dt>Notes</dt>
            <dd>${booking.notes || "No notes provided"}</dd>
            <dt>Submitted</dt>
            <dd>${new Date(booking.createdAt).toLocaleString()}</dd>
          </dl>
        </article>
      `
    )
    .join("");
}

function downloadJson() {
  const bookings = getBookings();
  const blob = new Blob([JSON.stringify(bookings, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "gs-event-co-bookings.json";
  link.click();
  URL.revokeObjectURL(url);
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const addons = formData.getAll("addons");
  const booking = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    package: formData.get("package"),
    addons,
    eventDate: formData.get("eventDate"),
    eventTime: formData.get("eventTime"),
    location: formData.get("location"),
    notes: formData.get("notes"),
    createdAt: new Date().toISOString()
  };

  const bookings = getBookings();
  bookings.unshift(booking);
  saveBookings(bookings);

  // Future Twilio integration:
  // Send text message to G&S Event Co. partners when a booking request is submitted.

  bookingForm.reset();
  bookingMessage.textContent = "Your booking request has been saved. G&S Event Co. will follow up soon.";
  renderBookings();
});

loginButton.addEventListener("click", () => {
  const password = document.querySelector("#adminPassword").value;

  if (password !== adminPassword) {
    loginMessage.textContent = "Incorrect password.";
    return;
  }

  loginMessage.textContent = "";
  adminPanel.hidden = false;
  renderBookings();
});

exportJson.addEventListener("click", downloadJson);

clearBookings.addEventListener("click", () => {
  if (!confirm("Clear all local preview booking requests?")) return;
  saveBookings([]);
  renderBookings();
});

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
renderAddonCards();
