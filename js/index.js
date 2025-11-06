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
        if (!isLargeScreen()) new bootstrap.Collapse(navbarCollapse).hide();
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
    if (!navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.add("navbar-dark-bg");
    } else {
      navbarCollapse.classList.remove("navbar-dark-bg");
      if (isLargeScreen() && window.scrollY < 50) {
        nav.classList.remove("scrolled");
      }
    }
  });

  window.addEventListener("resize", handleResize);
}


    updateNavbar();
  }
const scrollBtn = document.querySelector(".scroll-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
  /* ---------------------- AOS INIT ---------------------- */
  
    AOS.init({
      duration: 1000,
      once: false,
      offset: 100
    });
  

  document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const inputs = {
    name: document.querySelector('input[placeholder="Your Name"]'),
    email: document.querySelector('input[placeholder="Email Address"]'),
    phone: document.querySelector('input[placeholder="Phone Number"]'),
    subject: document.querySelector('input[placeholder="Subject"]'),
    message: document.querySelector('textarea[placeholder="Message"]')
  };

  const regex = {
    name: /^[A-Za-z\s]{3,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?\d{8,15}$/,
    subject: /^.{3,}$/,
    message: /.+/
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
    if (nextEl && nextEl.classList.contains("error-message")) {
      nextEl.remove();
    }
  }

  Object.keys(inputs).forEach((key) => {
    inputs[key].addEventListener("input", () => {
      const value = inputs[key].value.trim();
      if (value === "") {
        showError(inputs[key], `${key.charAt(0).toUpperCase() + key.slice(1)} cannot be empty.`);
      } else if (!regex[key].test(value)) {
        let customMessage = "";
        switch (key) {
          case "name":
            customMessage = "Enter a valid name (at least 3 letters).";
            break;
          case "email":
            customMessage = "Enter a valid email address.";
            break;
          case "phone":
            customMessage = "Enter a valid phone number.";
            break;
          case "subject":
            customMessage = "Subject must be at least 3 characters.";
            break;
          case "message":
            customMessage = "Message cannot be empty.";
            break;
        }
        showError(inputs[key], customMessage);
      } else {
        removeError(inputs[key]);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    Object.keys(inputs).forEach((key) => {
      const input = inputs[key];
      const value = input.value.trim();

      removeError(input);

      if (value === "") {
        showError(input, `${key.charAt(0).toUpperCase() + key.slice(1)} cannot be empty.`);
        valid = false;
      } else if (!regex[key].test(value)) {
        showError(input, `Invalid ${key}.`);
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
        confirmButtonColor: "#000"
      });
    }
  });
});