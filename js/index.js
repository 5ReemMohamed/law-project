/* ---------------------- NAVBAR SCROLL & ACTIVE LINKS ---------------------- */
const nav = document.querySelector(".custom-navbar");
const navbarLinks = document.querySelectorAll(".navbar-nav .nav-link");
const navbarCollapse = document.getElementById("mainNav");
const toggleButton = document.querySelector(".navbar-toggler");
const sections = document.querySelectorAll("section[id]");

if (nav && navbarLinks.length) {
  const isLargeScreen = () => window.innerWidth >= 992;

  const updateActiveLink = () => {
    const scrollPos = window.scrollY;

    if (scrollPos < 50) {
      navbarLinks.forEach(link => link.classList.remove("active"));
      const homeLink = document.querySelector('.navbar-nav .nav-link[href="#"]');
      if (homeLink) homeLink.classList.add("active");
      return;
    }

    let activeSet = false;
    sections.forEach(section => {
      if (
        scrollPos + nav.offsetHeight >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        const id = section.getAttribute("id");
        navbarLinks.forEach(link => link.classList.remove("active"));
        const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add("active");
        activeSet = true;
      }
    });

    if (!activeSet) {
      navbarLinks.forEach(link => link.classList.remove("active"));
      const homeLink = document.querySelector('.navbar-nav .nav-link[href="#"]');
      if (homeLink) homeLink.classList.add("active");
    }
  };

  const updateNavbarBackground = () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  };

  const updateNavbar = () => {
    updateNavbarBackground();
    updateActiveLink();
  };

  document.addEventListener("scroll", updateNavbar);
  window.addEventListener("resize", () => {
    updateNavbar();
    if (isLargeScreen()) navbarCollapse.style.backgroundColor = "";
  });

  navbarLinks.forEach(link => {
    link.addEventListener("click", function () {
      navbarLinks.forEach(l => l.classList.remove("active"));
      this.classList.add("active");
      if (!isLargeScreen() && navbarCollapse) {
        new bootstrap.Collapse(navbarCollapse).hide();
      }
    });
  });

  function handleResize() {
    if (isLargeScreen()) {
      navbarCollapse.classList.remove("navbar-dark-bg");
      nav.classList.remove("scrolled");
    }
  }

  if (toggleButton && navbarCollapse) {
    toggleButton.addEventListener("click", () => {
      const isShown = navbarCollapse.classList.contains("show");
      navbarCollapse.classList.toggle("navbar-dark-bg", !isShown);
      if (isLargeScreen() && window.scrollY < 50 && isShown) {
        nav.classList.remove("scrolled");
      }
    });

    window.addEventListener("resize", handleResize);
  }

  updateNavbar();
}

/* ---------------------- SCROLL TO TOP BUTTON ---------------------- */
const scrollBtn = document.querySelector(".scroll-top");

if (scrollBtn) {
  window.addEventListener("scroll", () => {
    scrollBtn.classList.toggle("show", window.scrollY > 300);
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------------------- AOS INIT ---------------------- */
AOS.init({
  duration: 400,   // faster animation
  offset: 50,      // trigger earlier
});
/* ---------------------- TRANSLATE BUTTON & FORM ---------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("translateBtn");
  if (!btn) return;

  let currentLang = localStorage.getItem("lang") || "en";
  setLanguage(currentLang);

  btn.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "ar" : "en";
    setLanguage(currentLang);
    localStorage.setItem("lang", currentLang);
  });

  function setLanguage(lang) {
    // Update all elements with data attributes (handles text & placeholders)
    document.querySelectorAll("[data-en]").forEach((el) => {
      const translatedText = el.getAttribute(`data-${lang}`);
      if (!translatedText) return;

      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = translatedText;
      } else {
        el.textContent = translatedText;
      }
    });

    // Update page direction
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", lang === "ar");

    // Update button label
    btn.textContent = lang === "ar" ? "EN" : "AR";

    // Adjust text alignment for main tags
    document.querySelectorAll("section, h1, h2, h3, p, button, a, li, label, input, textarea").forEach((el) => {
      el.style.textAlign = lang === "ar" ? "right" : "left";
    });
  }

  /* ---------------------- FORM VALIDATION ---------------------- */
  const form = document.querySelector("form");
  if (!form) return;

  const inputs = {
    name: form.querySelector('input[data-en="Your Name"]'),
    email: form.querySelector('input[data-en="Email Address"]'),
    phone: form.querySelector('input[data-en="Phone Number"]'),
    subject: form.querySelector('input[data-en="Subject"]'),
    message: form.querySelector('textarea[data-en="Message"]')
  };

  const regex = {
    name: /^[A-Za-z\s]{3,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?\d{8,15}$/,
    subject: /^.{3,}$/,
    message: /.+/,
  };

  function showError(input, message) {
    removeError(input);
    const error = document.createElement("p");
    error.className = "error-message text-danger mt-1";
    error.style.fontSize = "0.9rem";
    error.textContent = message;
    input.insertAdjacentElement("afterend", error);
  }

  function removeError(input) {
    const nextEl = input.nextElementSibling;
    if (nextEl && nextEl.classList.contains("error-message")) nextEl.remove();
  }

  Object.keys(inputs).forEach((key) => {
    const input = inputs[key];
    if (!input) return;

    input.addEventListener("input", () => {
      const value = input.value.trim();
      if (value === "") {
        showError(input, `${capitalize(key)} cannot be empty.`);
      } else if (!regex[key].test(value)) {
        showError(input, getErrorMessage(key));
      } else {
        removeError(input);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    Object.keys(inputs).forEach((key) => {
      const input = inputs[key];
      if (!input) return;
      const value = input.value.trim();
      removeError(input);

      if (value === "") {
        showError(input, `${capitalize(key)} cannot be empty.`);
        valid = false;
      } else if (!regex[key].test(value)) {
        showError(input, getErrorMessage(key));
        valid = false;
      }
    });

    if (valid) {
      const name = encodeURIComponent(inputs.name.value.trim());
      const email = encodeURIComponent(inputs.email.value.trim());
      const phone = encodeURIComponent(inputs.phone.value.trim());
      const subject = encodeURIComponent(inputs.subject.value.trim());
      const message = encodeURIComponent(inputs.message.value.trim());

      const whatsappURL = `https://wa.me/962798934091?text=New%20Message%20From%20Website%0A%0A👤%20Name:%20${name}%0A📧%20Email:%20${email}%0A📞%20Phone:%20${phone}%0A📌%20Subject:%20${subject}%0A💬%20Message:%20${message}`;
      window.open(whatsappURL, "_blank");
      form.reset();

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Your message was sent successfully via WhatsApp.",
        confirmButtonColor: "#000",
      });
    }
  });

  function getErrorMessage(key) {
    switch (key) {
      case "name":
        return "Enter a valid name (at least 3 letters).";
      case "email":
        return "Enter a valid email address.";
      case "phone":
        return "Enter a valid phone number.";
      case "subject":
        return "Subject must be at least 3 characters.";
      case "message":
        return "Message cannot be empty.";
      default:
        return `Invalid ${key}.`;
    }
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

});
