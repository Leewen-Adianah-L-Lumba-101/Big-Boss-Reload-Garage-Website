// Select DOM elements
const container = document.querySelector(".testimonial-container");
const form = document.querySelector("#testimonialForm");
const modal = document.getElementById("reviewModal");
const writeReviewButton = document.getElementById("writeReviewButton");
const closeButton = document.querySelector(".close-button");

// Open the pop-up modal
writeReviewButton.addEventListener("click", () => {
  modal.style.display = "flex"; // Make the modal visible
});

// Close the modal when the "X" button is clicked
closeButton.addEventListener("click", () => {
  modal.style.display = "none"; // Hide the modal
});

// Close the modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Add form submit functionality
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get the input values
  const testimonialText = document.querySelector("textarea[name='testimonial']").value;
  const name = document.querySelector("input[name='name']").value;
  const rating = document.querySelector("#rating").value;

  // Create a new testimonial card
  const newTestimonial = document.createElement("div");
  newTestimonial.classList.add("testimonial-card");
  newTestimonial.innerHTML = `
    <div class="testimonial-content">
      <p>"${testimonialText}"</p>
      <h4>- ${name}</h4>
      <p>${'⭐'.repeat(rating)}</p>
    </div>
  `;

  // Append the new card to the container
  container.appendChild(newTestimonial);

  // Reset the form
  form.reset();

  // Close the modal
  modal.style.display = "none"; // Hide the modal after submitting
});