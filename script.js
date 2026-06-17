const bookingKey = "gsEventCoBookings";

const addOns = [
  {
    name: "Additional Animal Hopper",
    description: "Add another ride-on animal for extra play fun.",
    price: 25,
    image: "assets/images/addon-animal-hopper.jpg"
  },
  {
    name: "Additional Ball Color",
    description: "Match your event theme with a second ball color.",
    price: 15,
    image: "assets/images/addon-ball-color.jpg"
  },
  {
    name: "Toddler Table & Chairs",
    description: "Child-sized seating perfect for snacks, crafts, and activities.",
    price: 50,
    image: "assets/images/addon-toddler-table-chairs.jpg"
  }
];

const testimonials = [
  {
    quote: "Everything was beautiful, clean, and perfectly styled. The kids had the best time.",
    name: "Jasmine M."
  },
  {
    quote: "The setup looked amazing in photos and made our toddler party feel effortless.",
    name: "Avery R."
  },
  {
    quote: "Professional, on time, and so easy to work with. The neutral colors were perfect.",
    name: "Danielle S."
  }
];

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));

const siteHeader = qs("#siteHeader");
const navToggle = qs(".nav-toggle");
const siteNav = qs(".site-nav");
const backTop = qs("#backTop");
const addonCards = qs("#addonCards");
const bookingAddonChoices = qs("#bookingAddonChoices");
const bookingForm = qs("#bookingForm");
const bookingMessage = qs("#bookingMessage");
const bookingReview = qs("#bookingReview");
const prevStep = qs("#prevStep");
const nextStep = qs("#nextStep");
const submitBooking = qs("#submitBooking");
const testimonialTrack = qs("#testimonialTrack");

let currentStep = 0;
let currentTestimonial = 0;

function money(value) {
  return value === 0 ? "Custom Quote" : `$${value}`;
}

function getBookings() {
  return JSON.parse(localStorage.getItem(bookingKey) || "[]");
}

function saveBookings(bookings) {
  localStorage.setItem(bookingKey, JSON.stringify(bookings));
}

function selectedAddons() {
  return qsa('input[name="addons"]:checked').map((input) => ({
    name: input.value,
    price: Number(input.dataset.price || 0)
  }));
}

function selectedPackage() {
  const input = qs('input[name="package"]:checked');
  return {
    name: input ? input.value : "",
    price: input ? Number(input.dataset.price || 0) : 0
  };
}

function estimateTotal() {
  const pkg = selectedPackage();
  if (pkg.name === "Custom Quote") return 0;
  return pkg.price + selectedAddons().reduce((sum, addon) => sum + addon.price, 0);
}

function renderAddonCards() {
  addonCards.innerHTML = addOns
    .map(
      (addon) => `
        <article class="addon-card reveal" data-addon-card="${addon.name}">
          <img src="${addon.image}" alt="${addon.name}" width="1402" height="1024" loading="lazy" />
          <h3>${addon.name}</h3>
          <strong>+$${addon.price}</strong>
          <p>${addon.description}</p>
          <button class="button button-light addon-select" type="button" data-addon-select="${addon.name}">Select</button>
        </article>
      `
    )
    .join("");

  bookingAddonChoices.innerHTML = addOns
    .map(
      (addon) => `
        <label class="choice-card">
          <input type="checkbox" name="addons" value="${addon.name}" data-price="${addon.price}" />
          <span>${addon.name}</span>
          <strong>+$${addon.price}</strong>
        </label>
      `
    )
    .join("");

  qsa("[data-addon-select]").forEach((button) => {
    button.addEventListener("click", () => {
      const checkbox = qsa('input[name="addons"]').find((input) => input.value === button.dataset.addonSelect);
      if (!checkbox) return;
      checkbox.checked = !checkbox.checked;
      updateAddonCardStates();
      renderReview();
    });
  });

  qsa('input[name="addons"]').forEach((input) => {
    input.addEventListener("change", updateAddonCardStates);
  });
}

function updateAddonCardStates() {
  const selected = new Set(selectedAddons().map((addon) => addon.name));
  qsa("[data-addon-card]").forEach((card) => {
    const isSelected = selected.has(card.dataset.addonCard);
    card.classList.toggle("selected", isSelected);
    const button = card.querySelector(".addon-select");
    if (button) button.textContent = isSelected ? "Selected" : "Select";
  });
}

function showStep(index) {
  const steps = qsa(".form-step");
  const pills = qsa(".step-pill");
  currentStep = Math.max(0, Math.min(index, steps.length - 1));

  steps.forEach((step, stepIndex) => step.classList.toggle("active", stepIndex === currentStep));
  pills.forEach((pill, pillIndex) => pill.classList.toggle("active", pillIndex === currentStep));

  prevStep.style.display = currentStep === 0 ? "none" : "inline-flex";
  nextStep.style.display = currentStep === steps.length - 1 ? "none" : "inline-flex";
  submitBooking.style.display = currentStep === steps.length - 1 ? "inline-flex" : "none";

  if (currentStep === steps.length - 1) renderReview();
}

function stepIsValid() {
  const current = qsa(".form-step")[currentStep];
  const requiredFields = Array.from(current.querySelectorAll("[required]"));
  return requiredFields.every((field) => field.reportValidity());
}

function renderReview() {
  const formData = new FormData(bookingForm);
  const pkg = selectedPackage();
  const addons = selectedAddons();
  const total = estimateTotal();
  const remaining = pkg.name === "Custom Quote" ? "Custom Quote" : `$${Math.max(total - 50, 0)}`;

  bookingReview.innerHTML = `
    <div><span>Customer</span><strong>${formData.get("name") || "Not entered"}</strong></div>
    <div><span>Event</span><strong>${formData.get("eventDate") || "Date TBD"} at ${formData.get("eventTime") || "Time TBD"}</strong></div>
    <div><span>Location</span><strong>${formData.get("location") || "Not entered"} - ${formData.get("setting") || "Setting TBD"}</strong></div>
    <div><span>Package</span><strong>${pkg.name || "Not selected"}</strong></div>
    <div><span>Add-ons</span><strong>${addons.length ? addons.map((addon) => addon.name).join(", ") : "None selected"}</strong></div>
    <div><span>Estimated Total</span><strong>${money(total)}</strong></div>
    <div><span>Deposit Due</span><strong>$50 Deposit Required To Reserve Your Date</strong></div>
    <div><span>Estimated Remaining Balance</span><strong>${remaining}</strong></div>
  `;
}

function bookingPayload() {
  const formData = new FormData(bookingForm);
  const pkg = selectedPackage();
  const addons = selectedAddons();

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    eventDate: formData.get("eventDate"),
    eventTime: formData.get("eventTime"),
    location: formData.get("location"),
    setting: formData.get("setting"),
    package: pkg.name,
    packagePrice: pkg.price,
    addons,
    estimatedTotal: estimateTotal(),
    notes: formData.get("notes"),
    createdAt: new Date().toISOString()
  };
}

function renderTestimonials() {
  testimonialTrack.innerHTML = testimonials
    .map(
      (testimonial, index) => `
        <article class="testimonial-card ${index === currentTestimonial ? "active" : ""}">
          <p>"${testimonial.quote}"</p>
          <strong>${testimonial.name}</strong>
        </article>
      `
    )
    .join("");
}

function changeTestimonial(direction) {
  currentTestimonial = (currentTestimonial + direction + testimonials.length) % testimonials.length;
  renderTestimonials();
}

function openLightbox(image) {
  qs("#lightboxImage").src = image.src;
  qs("#lightboxImage").alt = image.alt;
  qs("#lightbox").hidden = false;
}

function closeLightbox() {
  qs("#lightbox").hidden = true;
}

renderAddonCards();
renderTestimonials();
showStep(0);
qs("#year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.target.classList.toggle("visible", entry.isIntersecting)),
  { threshold: 0.12 }
);
qsa(".reveal").forEach((element) => observer.observe(element));

window.addEventListener("scroll", () => {
  siteHeader.classList.toggle("shrunk", window.scrollY > 70);
  backTop.classList.toggle("visible", window.scrollY > 500);
});

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    siteNav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
});

qsa("[data-package-focus]").forEach((button) => {
  button.addEventListener("click", () => {
    qsa("[data-package-focus]").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    qsa("[data-package-card]").forEach((card) => card.classList.toggle("dimmed", card.dataset.packageCard !== button.dataset.packageFocus));
  });
});

qsa("[data-package-pick]").forEach((link) => {
  link.addEventListener("click", () => {
    const value = link.dataset.packagePick;
    setTimeout(() => {
      const input = qsa('input[name="package"]').find((radio) => radio.value === value);
      if (input) input.checked = true;
      renderReview();
    }, 120);
  });
});

qsa(".gallery-item").forEach((button) => {
  button.addEventListener("click", () => openLightbox(button.querySelector("img")));
});

qs("#closeLightbox").addEventListener("click", closeLightbox);
qs("#lightbox").addEventListener("click", (event) => {
  if (event.target.id === "lightbox") closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

qsa(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    qsa(".faq-item").forEach((faq) => {
      if (faq !== item) faq.classList.remove("open");
    });
    item.classList.toggle("open");
  });
});

qsa("[data-slide]").forEach((button) => {
  button.addEventListener("click", () => changeTestimonial(button.dataset.slide === "next" ? 1 : -1));
});
setInterval(() => changeTestimonial(1), 6500);

backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

nextStep.addEventListener("click", () => {
  if (stepIsValid()) showStep(currentStep + 1);
});
prevStep.addEventListener("click", () => showStep(currentStep - 1));
bookingForm.addEventListener("change", renderReview);
bookingForm.addEventListener("input", renderReview);

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!stepIsValid()) return;

  const booking = bookingPayload();
  const bookings = getBookings();
  bookings.unshift(booking);
  saveBookings(bookings);

  // Future Twilio integration:
  // Send SMS notification to G&S Event Co. partners when a booking request is submitted.

  bookingForm.reset();
  bookingMessage.textContent = "Your booking request has been saved. G&S Event Co. will follow up soon.";
  updateAddonCardStates();
  showStep(0);
});
