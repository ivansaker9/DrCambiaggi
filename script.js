const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const sectionLinks = Array.from(document.querySelectorAll(".nav-links a"));

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

sectionLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".accordion-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".accordion-item");
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const serviceCards = document.querySelectorAll(".service-card");
const modal = document.querySelector(".service-modal");
const modalTitle = modal.querySelector("#service-modal-title");
const modalCounter = modal.querySelector(".service-modal-counter");
const modalClose = modal.querySelector(".service-modal-close");
const carouselTrack = modal.querySelector(".carousel-track");
const prevButton = modal.querySelector(".carousel-control.prev");
const nextButton = modal.querySelector(".carousel-control.next");
const thumbs = modal.querySelector(".service-gallery-thumbs");
let currentSlide = 0;
let currentSlides = [];

const openModal = (title, images) => {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  modalTitle.textContent = title;
  currentSlides = images;
  currentSlide = 0;
  renderCarousel();
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  carouselTrack.innerHTML = "";
  thumbs.innerHTML = "";
};

const renderCarousel = () => {
  carouselTrack.innerHTML = "";
  thumbs.innerHTML = "";

  currentSlides.forEach((src, index) => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide" + (index === currentSlide ? " is-active" : "");
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${modalTitle.textContent} ${index + 1}`;
    slide.appendChild(img);
    carouselTrack.appendChild(slide);

    const thumbButton = document.createElement("button");
    thumbButton.type = "button";
    thumbButton.className = index === currentSlide ? "is-active" : "";
    const thumbImg = document.createElement("img");
    thumbImg.src = src;
    thumbImg.alt = `Miniatura ${index + 1}`;
    thumbButton.appendChild(thumbImg);
    thumbButton.addEventListener("click", () => {
      currentSlide = index;
      renderCarousel();
    });
    thumbs.appendChild(thumbButton);
  });

  prevButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === currentSlides.length - 1;
  modalCounter.textContent = `${currentSlide + 1} / ${currentSlides.length}`;
};

prevButton.addEventListener("click", () => {
  if (currentSlide > 0) {
    currentSlide -= 1;
    renderCarousel();
  }
});

nextButton.addEventListener("click", () => {
  if (currentSlide < currentSlides.length - 1) {
    currentSlide += 1;
    renderCarousel();
  }
});

modalClose.addEventListener("click", closeModal);
modal.querySelector(".service-modal-backdrop").addEventListener("click", closeModal);
modal.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

serviceCards.forEach((card) => {
  const toggle = card.querySelector(".service-card-toggle");
  const galleryData = card.dataset.gallery
    ? card.dataset.gallery
        .split(",")
        .map((image) => `images/especialidades/${image.trim()}`)
    : [];
  const title = card.querySelector("h3").textContent;

  const setOpen = (open) => {
    card.classList.toggle("is-open", open);
    card.setAttribute("aria-expanded", String(open));
    if (toggle) toggle.textContent = open ? "−" : "+";
  };

  const openGallery = () => {
    if (galleryData.length) {
      openModal(title, galleryData);
    }
  };

  card.addEventListener("click", openGallery);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGallery();
    }
  });
});

const sectionsById = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveLink = (id) => {
  sectionLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });
};

if ("IntersectionObserver" in window) {
  const visibleSections = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      const active = Array.from(visibleSections.entries()).sort((a, b) => b[1] - a[1])[0];
      if (active) {
        setActiveLink(active[0]);
      }
    },
    {
      rootMargin: "-22% 0px -55% 0px",
      threshold: [0.12, 0.25, 0.45, 0.65],
    }
  );

  sectionsById.forEach((section) => observer.observe(section));
} else {
  window.addEventListener("scroll", () => {
    let current = null;
    sectionsById.forEach((section) => {
      if (section.getBoundingClientRect().top <= 120) {
        current = section;
      }
    });
    if (current) {
      setActiveLink(current.id);
    }
  });
}
