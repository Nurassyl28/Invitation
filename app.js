const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");
const filters = Array.from(document.querySelectorAll(".filter"));
const cards = Array.from(document.querySelectorAll(".template-card"));
const details = Array.from(document.querySelectorAll(".faq-list details"));
const templateSearch = document.querySelector("[data-template-search]");
const searchableTemplates = Array.from(document.querySelectorAll("[data-template-card]"));
const previewInputs = Array.from(document.querySelectorAll("[data-preview-target]"));

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    mobileNav.hidden = expanded;
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
    });
  });
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filters.forEach((item) => item.classList.toggle("is-active", item === button));

    cards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(/\s+/);
      const visible = filter === "all" || tags.includes(filter);
      card.style.display = visible ? "" : "none";
    });
  });
});

details.forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    details.forEach((item) => {
      if (item !== detail) item.removeAttribute("open");
    });
  });
});

if (templateSearch && searchableTemplates.length) {
  templateSearch.addEventListener("input", () => {
    const query = templateSearch.value.trim().toLowerCase();

    searchableTemplates.forEach((card) => {
      const haystack = (card.dataset.search || card.textContent || "").toLowerCase();
      card.hidden = query.length > 0 && !haystack.includes(query);
    });
  });
}

previewInputs.forEach((input) => {
  const target = document.getElementById(input.dataset.previewTarget);

  if (!target) return;

  const syncPreview = () => {
    target.textContent = input.value || input.placeholder || "";
  };

  input.addEventListener("input", syncPreview);
  input.addEventListener("change", syncPreview);
  syncPreview();
});
