(function () {
  "use strict";

  var STORAGE_KEY = "littleLuxeBookings";
  var ADMIN_PASSWORD = "admin123";

  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.querySelector(".nav-menu");
  var bookingForm = document.getElementById("booking-form");
  var formStatus = document.getElementById("form-status");
  var adminLogin = document.getElementById("admin-login");
  var adminPassword = document.getElementById("admin-password");
  var adminMessage = document.getElementById("admin-message");
  var adminContent = document.getElementById("admin-content");
  var bookingList = document.getElementById("booking-list");
  var exportButton = document.getElementById("export-bookings");
  var clearButton = document.getElementById("clear-bookings");
  var year = document.getElementById("current-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navMenu.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navMenu.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        closeMobileMenu();
      }
    });
  }

  document.querySelectorAll("[data-package-link]").forEach(function (link) {
    link.addEventListener("click", function () {
      var packageSelect = document.getElementById("packageSelection");
      if (packageSelect) {
        packageSelect.value = link.getAttribute("data-package-link");
      }
    });
  });

  function closeMobileMenu() {
    if (!navToggle || !navMenu) {
      return;
    }

    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  var revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  function getBookings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    var digits = value.replace(/\D/g, "");
    return digits.length === 10 || (digits.length === 11 && digits.charAt(0) === "1");
  }

  function setFieldError(field, message) {
    var row = field.closest(".form-row");
    var error = row ? row.querySelector(".error-message") : null;

    if (row) {
      row.classList.toggle("has-error", Boolean(message));
    }

    field.setAttribute("aria-invalid", message ? "true" : "false");

    if (error) {
      error.textContent = message || "";
    }
  }

  function validateForm(form) {
    var isValid = true;
    var fields = Array.prototype.slice.call(form.querySelectorAll("input, select, textarea"));

    fields.forEach(function (field) {
      var value = field.value.trim();
      var message = "";

      if (field.hasAttribute("required") && !value) {
        message = "This field is required.";
      } else if (field.name === "email" && !isValidEmail(value)) {
        message = "Enter a valid email address.";
      } else if (field.name === "phone" && !isValidPhone(value)) {
        message = "Enter a valid 10-digit phone number.";
      }

      setFieldError(field, message);

      if (message) {
        isValid = false;
      }
    });

    return isValid;
  }

  function buildBooking(form) {
    var data = new FormData(form);

    return {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      parentName: String(data.get("parentName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      eventDate: String(data.get("eventDate") || "").trim(),
      eventTime: String(data.get("eventTime") || "").trim(),
      eventAddress: String(data.get("eventAddress") || "").trim(),
      packageSelection: String(data.get("packageSelection") || "").trim(),
      setupType: String(data.get("setupType") || "").trim(),
      childrenCount: String(data.get("childrenCount") || "").trim(),
      eventNotes: String(data.get("eventNotes") || "").trim()
    };
  }

  if (bookingForm) {
    bookingForm.addEventListener("input", function (event) {
      var field = event.target;
      if (field.matches("input, select, textarea")) {
        setFieldError(field, "");
      }
    });

    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validateForm(bookingForm)) {
        showFormStatus("Please review the highlighted fields.", false);
        return;
      }

      var booking = buildBooking(bookingForm);
      var bookings = getBookings();
      bookings.unshift(booking);
      saveBookings(bookings);

      // Future integration:
      // Send SMS notification to business owners
      // using Twilio API when booking is received.

      // Future integration:
      // Send email confirmation to the customer and
      // email notification to the business inbox.

      // Future integration:
      // Replace localStorage with a Supabase backend table
      // for secure, multi-device booking management.

      showFormStatus("Booking request received. We will follow up soon.", true);
      bookingForm.reset();
      renderBookings();
    });
  }

  function showFormStatus(message, success) {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;
    formStatus.classList.add("visible");
    formStatus.style.background = success ? "rgba(141, 154, 138, 0.16)" : "rgba(165, 75, 66, 0.12)";
  }

  if (adminLogin) {
    adminLogin.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!adminPassword || adminPassword.value !== ADMIN_PASSWORD) {
        adminMessage.textContent = "Incorrect password.";
        return;
      }

      adminMessage.textContent = "Admin preview unlocked.";
      adminLogin.hidden = true;
      adminContent.hidden = false;
      renderBookings();
    });
  }

  if (exportButton) {
    exportButton.addEventListener("click", function () {
      var bookings = getBookings();
      var blob = new Blob([JSON.stringify(bookings, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");

      link.href = url;
      link.download = "little-luxe-bookings.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      if (!confirm("Clear all locally stored bookings?")) {
        return;
      }

      saveBookings([]);
      renderBookings();
    });
  }

  function renderBookings() {
    if (!bookingList || !adminContent || adminContent.hidden) {
      return;
    }

    var bookings = getBookings();

    if (!bookings.length) {
      bookingList.innerHTML = '<p class="empty-state">No submitted bookings yet.</p>';
      return;
    }

    bookingList.innerHTML = bookings.map(function (booking) {
      return [
        '<article class="booking-record">',
        '<h3>' + escapeHtml(booking.parentName) + '</h3>',
        '<dl>',
        detail("Date Submitted", formatDateTime(booking.submittedAt)),
        detail("Contact", escapeHtml(booking.email) + "<br>" + escapeHtml(booking.phone)),
        detail("Package", escapeHtml(booking.packageSelection)),
        detail("Event Date", escapeHtml(booking.eventDate) + " at " + escapeHtml(booking.eventTime)),
        detail("Setup", escapeHtml(booking.setupType)),
        detail("Children", escapeHtml(booking.childrenCount)),
        detail("Address", escapeHtml(booking.eventAddress)),
        detail("Notes", escapeHtml(booking.eventNotes)),
        '</dl>',
        '</article>'
      ].join("");
    }).join("");
  }

  function detail(label, value) {
    return "<div><dt>" + label + "</dt><dd>" + value + "</dd></div>";
  }

  function formatDateTime(value) {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }).format(new Date(value));
    } catch (error) {
      return value;
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
