const header = document.querySelector("[data-header]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const form = document.querySelector("[data-whatsapp-form]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const galleryItems = document.querySelectorAll("[data-lightbox-item]");
const tripOptions = document.querySelectorAll("[data-trip-option]");
const tripTitle = document.querySelector("[data-trip-title]");
const tripText = document.querySelector("[data-trip-text]");
const destinationInput = document.querySelector("[data-destination-input]");
const messageInput = document.querySelector("[data-message-input]");
const packageLinks = document.querySelectorAll("[data-package-link]");
const revealItems = document.querySelectorAll(".reveal-on-scroll");

const tripCopy = {
  "Descanso premium": "Hospedajes comodos, traslados claros y una agenda equilibrada para volver renovado.",
  "Aventura nacional": "Rutas dentro de Colombia, experiencias locales y soporte para viajar con mas confianza.",
  "Celebracion especial": "Un plan con detalles especiales para aniversarios, cumpleanos, luna de miel o viajes familiares."
};

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
};

const updateScrollProgress = () => {
  if (!scrollProgress) {
    return;
  }

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  scrollProgress.style.width = `${Math.min(progress, 100)}%`;
};

updateHeader();
updateScrollProgress();
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("scroll", updateScrollProgress, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = data.get("name")?.toString().trim();
  const service = data.get("service")?.toString().trim();
  const destination = data.get("destination")?.toString().trim() || "Aun no definido";
  const date = data.get("date")?.toString().trim() || "Por definir";
  const message = data.get("message")?.toString().trim() || "Estoy listo para avanzar con una propuesta formal. Por favor enviame opciones disponibles, valores, condiciones de reserva y recomendaciones para tomar la mejor decision.";

  const text = [
    "Hola Turismo Tropical, quiero avanzar con la planeacion de mi proximo viaje.",
    "",
    "Me interesa recibir una propuesta completa, bien organizada y lista para revisar con opciones de disponibilidad, presupuesto, condiciones de reserva y recomendaciones.",
    "",
    `Nombre: ${name}`,
    `Servicio de interes: ${service}`,
    `Destino o idea de viaje: ${destination}`,
    `Fecha aproximada: ${date}`,
    "",
    `Detalles importantes: ${message}`,
    "",
    "Quedo atento para continuar con la asesoria y definir la mejor opcion."
  ].join("\n");

  const whatsappUrl = `https://wa.me/573112159766?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

const fillTripIdea = (destination, message, force = false) => {
  if (destinationInput && (force || !destinationInput.value.trim())) {
    destinationInput.value = destination;
  }

  if (messageInput) {
    messageInput.value = message;
  }
};

tripOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const title = option.dataset.tripTitle;
    const destination = option.dataset.tripDestination;
    const message = option.dataset.tripMessage;

    tripOptions.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });

    option.classList.add("is-active");
    option.setAttribute("aria-selected", "true");

    if (tripTitle) {
      tripTitle.textContent = title;
    }

    if (tripText) {
      tripText.textContent = tripCopy[title] || message;
    }

    fillTripIdea(destination, message, true);
  });
});

packageLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const packageName = link.dataset.packageLink;
    fillTripIdea(packageName, `Me interesa avanzar con el plan ${packageName}. Quiero recibir una propuesta completa con opciones disponibles, valores, condiciones de reserva y recomendaciones para confirmar la mejor alternativa.`, true);
  });
});

const openLightbox = (item) => {
  const image = item.querySelector("img");
  const caption = item.querySelector("figcaption")?.textContent || image.alt;

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = caption;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-lightbox-open");
};

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-lightbox-open");
};

galleryItems.forEach((item) => {
  item.setAttribute("tabindex", "0");
  item.setAttribute("role", "button");
  item.setAttribute("aria-label", "Ver imagen en vista previa");

  item.addEventListener("click", () => openLightbox(item));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(item);
    }
  });
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.22 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
