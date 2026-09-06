// mobile-nav
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");
const toggleIcon = navToggle.querySelector("i");

navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('active');
    
    if (isOpen) {
        toggleIcon.classList.replace('fa-bars', 'fa-xmark');
    } else {
        toggleIcon.classList.replace('fa-xmark', 'fa-bars');
    }
});

// mobile-nav
// Active Link
const activeLink = document.querySelectorAll('.r-klan-header  .text ul li a')

  activeLink.forEach(link => {
    if (link.href === window.location.href) link.classList.add('active');
});
// Active Link
// Hero Slider
const wrapper = document.querySelector('.slider-wrapper');
const container = document.querySelector('.slider-container');
let slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

// 1. Create clones for infinite structural looping
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

// 2. Insert the clones at the ends of the slider track
wrapper.appendChild(firstClone);
wrapper.insertBefore(lastClone, slides[0]);

// 3. Re-evaluate the slides list array with clones included
slides = document.querySelectorAll('.slide');

let currentIndex = 1; // Start at index 1 since index 0 is now the prepended clone
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let autoSlideInterval;
let isHovered = false; // Tracks if the mouse is currently hovering over the slider

// Shift default position to point directly to the first original slide
wrapper.style.transform = `translateX(${-container.offsetWidth}px)`;

// Start the 4-second autoplay loop timer
function startAutoSlide() {
  stopAutoSlide(); 
  // Only start the rotation if the user is not actively hovering with their mouse
  if (!isHovered) {
    autoSlideInterval = setInterval(() => {
      currentIndex++;
      wrapper.style.transition = 'transform 0.5s ease-in-out';
      showSlide(currentIndex);
    }, 4000); 
  }
}

// Stop the autoplay timer
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Update visible slide position and dot states
function showSlide(index) {
  currentTranslate = index * -container.offsetWidth;
  prevTranslate = currentTranslate;
  
  wrapper.style.transform = `translateX(${currentTranslate}px)`;
  
  // Calculate active indicator dot index dynamically based on cloning offsets
  let dotIndex = index - 1;
  if (index === slides.length - 1) dotIndex = 0;
  if (index === 0) dotIndex = dots.length - 1;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === dotIndex);
  });
}

// Invisible alignment corrections run immediately after layout slide animation completes
wrapper.addEventListener('transitionend', () => {
  if (currentIndex === slides.length - 1) {
    wrapper.style.transition = 'none'; // Turn off transition animations for instant reset teleport
    currentIndex = 1;
    showSlide(currentIndex);
  }
  if (currentIndex === 0) {
    wrapper.style.transition = 'none';
    currentIndex = slides.length - 2;
    showSlide(currentIndex);
  }
});

// Expose navigation to HTML inline onclick attributes
window.currentSlide = function(index) {
  currentIndex = index + 1; // Offset matching the prepended slide clone entry
  wrapper.style.transition = 'transform 0.5s ease-in-out';
  showSlide(currentIndex);
  startAutoSlide(); // Reset tracking interval countdown timer
}

// --- Mouse Over / Hover Detection Functionality ---
container.addEventListener('mouseenter', () => {
  isHovered = true;
  stopAutoSlide(); // Instantly turn off auto-rotation when mouse enters
});

container.addEventListener('mouseleave', () => {
  isHovered = false;
  startAutoSlide(); // Turn auto-rotation back on when mouse leaves
});

// --- Mouse Drag and Mobile Touch Mechanics ---
container.addEventListener('mousedown', dragStart);
container.addEventListener('mouseup', dragEnd);
container.addEventListener('mouseleave', dragEnd);
container.addEventListener('mousemove', dragAction);

container.addEventListener('touchstart', dragStart);
container.addEventListener('touchend', dragEnd);
container.addEventListener('touchmove', dragAction);

function getPosX(event) {
  return event.type.includes('mouse') ? event.clientX : event.touches.clientX;
}

function dragStart(event) {
  isDragging = true;
  startX = getPosX(event);
  stopAutoSlide(); // Double insurance to pause timer while dragging
  wrapper.style.transition = 'none'; 
}

function dragAction(event) {
  if (!isDragging) return;
  const currentX = getPosX(event);
  const diff = currentX - startX;
  currentTranslate = (currentIndex * -container.offsetWidth) + diff;
  wrapper.style.transform = `translateX(${currentTranslate}px)`;
}

function dragEnd() {
  if (!isDragging) return;
  isDragging = false;
  wrapper.style.transition = 'transform 0.5s ease-in-out';

  const actualTranslate = currentIndex * -container.offsetWidth;
  const movedBy = currentTranslate - actualTranslate;

  // Swipe threshold evaluation margin (Requires 100 pixels shift to turn slide)
  if (movedBy < -100) {
    currentIndex += 1;
  } else if (movedBy > 100) {
    currentIndex -= 1;
  }

  showSlide(currentIndex);
  startAutoSlide(); // Attempt to resume rotation
}

// Keep slide alignments uniform during window resizing profiles
window.addEventListener('resize', () => {
  wrapper.style.transition = 'none';
  showSlide(currentIndex);
});

// Initialize configurations on load
startAutoSlide();
// Hero Slider

const revContainer = document.querySelector('.rev-slider-box');
const revTrack = document.getElementById('revTrack');
const revPrevBtn = document.getElementById('revPrevBtn');
const revNextBtn = document.getElementById('revNextBtn');

let revOriginalCards = Array.from(revTrack.children);
const revOriginalCount = revOriginalCards.length;

let revVisibleCards = getRevVisibleCardsCount();
let revCurrentIndex = revVisibleCards; 
let revIsTransitioning = false;
let revAutoTimer = null;
const REV_INTERVAL = 4000;

// Drag / Swipe State Variables
let revIsDragging = false;
let revStartX = 0;
let revCurrentTranslate = 0;
let revPrevTranslate = 0;
const REV_DRAG_THRESHOLD = 50;

// 1. Inject duplicate elements at both ends to create infinite structural zones
revOriginalCards.forEach(card => {
  const clone = card.cloneNode(true);
  clone.classList.add('rev-card-clone');
  revTrack.appendChild(clone);
});

for (let i = revOriginalCount - 1; i >= 0; i--) {
  const clone = revOriginalCards[i].cloneNode(true);
  clone.classList.add('rev-card-clone');
  revTrack.insertBefore(clone, revTrack.firstChild);
}

// 2. Identify display viewport bounds
function getRevVisibleCardsCount() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 992) return 2;
  return 3;
}

function getRevCardWidthAndGap() {
  const cards = revTrack.children;
  if (cards.length === 0) return { cardWidth: 0, gap: 24 };
  const cardWidth = cards[0].getBoundingClientRect().width;
  return { cardWidth, gap: 24 };
}

function moveRevSlider(animate = true) {
  if (revIsDragging) return;
  
  const { cardWidth, gap } = getRevCardWidthAndGap();
  const offset = revCurrentIndex * (cardWidth + gap);

  if (animate) {
    revTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
  } else {
    revTrack.style.transition = 'none';
  }
  
  revCurrentTranslate = -offset;
  revPrevTranslate = revCurrentTranslate;
  revTrack.style.transform = `translateX(${revCurrentTranslate}px)`;
}

// 3. Handle seamless wrapping at loop boundaries
revTrack.addEventListener('transitionend', () => {
  revIsTransitioning = false;
  
  if (revCurrentIndex >= revOriginalCount + revVisibleCards) {
    revTrack.style.transition = 'none';
    revCurrentIndex = revCurrentIndex - revOriginalCount;
    moveRevSlider(false);
  } else if (revCurrentIndex < revVisibleCards) {
    revTrack.style.transition = 'none';
    revCurrentIndex = revCurrentIndex + revOriginalCount;
    moveRevSlider(false);
  }
});

// 4. Directional control triggers
function handleRevNext() {
  if (revIsTransitioning || revIsDragging) return;
  revIsTransitioning = true;
  revCurrentIndex++;
  moveRevSlider(true);
}

function handleRevPrev() {
  if (revIsTransitioning || revIsDragging) return;
  revIsTransitioning = true;
  revCurrentIndex--;
  moveRevSlider(true);
}

revNextBtn.addEventListener('click', handleRevNext);
revPrevBtn.addEventListener('click', handleRevPrev);

// 5. Rotation Engine Functions
function startRevAutoRotate() {
  if (revAutoTimer) return;
  revAutoTimer = setInterval(handleRevNext, REV_INTERVAL);
}

function stopRevAutoRotate() {
  clearInterval(revAutoTimer);
  revAutoTimer = null;
}

revContainer.addEventListener('mouseenter', stopRevAutoRotate);
revContainer.addEventListener('mouseleave', () => {
  if (!revIsDragging) startRevAutoRotate();
});

// 6. Mouse Dragging & Pointer Event Logic
function revDragStart(e) {
  if (revIsTransitioning) return;
  revIsDragging = true;
  stopRevAutoRotate();
  
  revStartX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  revTrack.style.transition = 'none';
  revContainer.classList.add('rev-is-grabbing');
}

function revDragMove(e) {
  if (!revIsDragging) return;
  
  const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  const currentXDiff = currentX - revStartX;
  
  revCurrentTranslate = revPrevTranslate + currentXDiff;
  revTrack.style.transform = `translateX(${revCurrentTranslate}px)`;
  
  e.preventDefault();
}

function revDragEnd() {
  if (!revIsDragging) return;
  revIsDragging = false;
  revContainer.classList.remove('rev-is-grabbing');
  
  const movedBy = revCurrentTranslate - revPrevTranslate;
  
  if (movedBy < -REV_DRAG_THRESHOLD) {
    revCurrentIndex++;
  } else if (movedBy > REV_DRAG_THRESHOLD) {
    revCurrentIndex--;
  }
  
  moveRevSlider(true);
  startRevAutoRotate();
}

revTrack.addEventListener('mousedown', revDragStart);
window.addEventListener('mousemove', revDragMove);
window.addEventListener('mouseup', revDragEnd);

revTrack.addEventListener('touchstart', revDragStart, { passive: true });
window.addEventListener('touchmove', revDragMove, { passive: false });
window.addEventListener('touchend', revDragEnd);

window.addEventListener('resize', () => {
  revVisibleCards = getRevVisibleCardsCount();
  moveRevSlider(false);
});

// 7. Component Launch
setTimeout(() => {
  moveRevSlider(false);
  startRevAutoRotate();
}, 50);