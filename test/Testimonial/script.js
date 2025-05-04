document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const form = document.querySelector("#testimonialForm");
  const modal = document.getElementById("reviewModal");
  const writeReviewButton = document.getElementById("writeReviewButton");
  const closeButton = document.querySelector(".close-button");
  const submittedReviewsContainer = document.getElementById("submitted-reviews");
  const sortSelect = document.getElementById("sortBy");

  // Load reviews on page load
  loadSavedReviews();

  // Event Listeners
  sortSelect.addEventListener('change', sortReviews);
  writeReviewButton.addEventListener("click", () => modal.style.display = "flex");
  closeButton.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => e.target === modal && (modal.style.display = "none"));
  
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const review = {
      testimonialText: form.testimonial.value,
      name: form.name.value,
      rating: Number(form.rating.value),
      timestamp: new Date().toISOString()
    };
    
    saveReview(review);
    form.reset();
    modal.style.display = "none";
  });

  // Functions
  function loadSavedReviews() {
    const savedReviews = JSON.parse(localStorage.getItem('customerReviews')) || [];
    
    // Add timestamp to old reviews if missing
    const needsUpdate = savedReviews.some(review => !review.timestamp);
    if (needsUpdate) {
      savedReviews.forEach(review => {
        if (!review.timestamp) {
          review.timestamp = new Date().toISOString();
        }
      });
      localStorage.setItem('customerReviews', JSON.stringify(savedReviews));
    }
    
    sortReviews(); // Initial sort
  }

  function displayReviews(reviews) {
    submittedReviewsContainer.innerHTML = '';
    
    if (reviews.length === 0) {
      submittedReviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to submit one!</p>';
      return;
    }
    
    reviews.forEach(review => {
      submittedReviewsContainer.appendChild(createReviewCard(review));
    });
  }

  function sortReviews() {
    const savedReviews = JSON.parse(localStorage.getItem('customerReviews')) || [];
    const sortBy = sortSelect.value;
    
    let sortedReviews = [...savedReviews];
    
    switch(sortBy) {
      case 'newest':
        sortedReviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'oldest':
        sortedReviews.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case 'rating-high':
        sortedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-low':
        sortedReviews.sort((a, b) => a.rating - b.rating);
        break;
    }
    
    displayReviews(sortedReviews);
  }

  function createReviewCard(review) {
    const card = document.createElement("div");
    card.className = "testimonial-card";
    card.innerHTML = `
      <div class="testimonial-content">
        <p>"${review.testimonialText}"</p>
        <h4>- ${review.name}</h4>
        <p>${'⭐'.repeat(review.rating)}</p>
      </div>
    `;
    return card;
  }

  function saveReview(review) {
    const savedReviews = JSON.parse(localStorage.getItem('customerReviews')) || [];
    savedReviews.push(review);
    localStorage.setItem('customerReviews', JSON.stringify(savedReviews));
    sortReviews();
  }
});