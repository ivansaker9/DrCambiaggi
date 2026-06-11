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
