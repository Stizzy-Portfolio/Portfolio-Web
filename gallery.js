const galleryItems = Array.from(document.querySelectorAll(".series-gallery .work-item")).map((item) => {
  const image = item.querySelector("img");
  const title = item.querySelector(".work-title")?.textContent?.trim() || image.alt || "Untitled";

  return {
    image,
    title,
    src: image.getAttribute("src"),
    alt: image.getAttribute("alt") || title,
  };
});

let activeIndex = 0;

if (galleryItems.length > 0) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Artwork preview");
  lightbox.innerHTML = `
    <button class="lightbox-button lightbox-close" type="button" aria-label="Close preview">&times;</button>
    <div class="lightbox-panel">
      <button class="lightbox-button lightbox-prev" type="button" aria-label="Previous artwork">&#8249;</button>
      <div class="lightbox-frame">
        <img class="lightbox-image" src="" alt="">
      </div>
      <button class="lightbox-button lightbox-next" type="button" aria-label="Next artwork">&#8250;</button>
      <p class="lightbox-title"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxTitle = lightbox.querySelector(".lightbox-title");
const closeButton = lightbox.querySelector(".lightbox-close");
const previousButton = lightbox.querySelector(".lightbox-prev");
const nextButton = lightbox.querySelector(".lightbox-next");

function showArtwork(index) {
  activeIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeIndex];

  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxTitle.textContent = item.title;
}

function openLightbox(index) {
  showArtwork(index);
  lightbox.classList.add("is-open");
  document.body.style.overflow = "hidden";
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  document.body.style.overflow = "";
}

function showPrevious() {
  showArtwork(activeIndex - 1);
}

function showNext() {
  showArtwork(activeIndex + 1);
}

galleryItems.forEach((item, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", `Open ${item.title}`);

  item.image.parentNode.insertBefore(button, item.image);
  button.appendChild(item.image);
  button.addEventListener("click", () => openLightbox(index));
});

closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", showPrevious);
nextButton.addEventListener("click", showNext);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showPrevious();
  }

  if (event.key === "ArrowRight") {
    showNext();
  }
});
}
