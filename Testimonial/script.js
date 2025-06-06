// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDazc4JvdeMAWaF2eJcRhYscJMCEAw768E",
  authDomain: "bigbossgarage-3bd3e.firebaseapp.com",
  databaseURL: "https://bigbossgarage-3bd3e-default-rtdb.firebaseio.com",
  projectId: "bigbossgarage-3bd3e",
  storageBucket: "bigbossgarage-3bd3e.appspot.com",
  messagingSenderId: "556796373996",
  appId: "1:556796373996:web:0cab987d84da8448e7aec9",
  measurementId: "G-FSMRV64R9C"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
// Photo upload storage commented out
// const storage = firebase.storage();

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const form = document.getElementById("testimonialForm");
  const modal = document.getElementById("reviewModal");
  const writeReviewButton = document.getElementById("writeReviewButton");
  const closeButton = document.querySelector(".close-button");
  const submittedReviewsContainer = document.getElementById("submitted-reviews");
  const sortSelect = document.getElementById("sortBy");
  // Photo upload elements commented out
  // const reviewPhotoInput = document.getElementById("reviewPhoto");
  // const photoPreview = document.getElementById("photoPreview");
  // const previewImage = document.getElementById("previewImage");
  // const removePhotoButton = document.getElementById("removePhoto");
  // const progressDiv = document.getElementById("uploadProgress");
  // const progressBar = document.getElementById("uploadProgressBar");
  // const percentSpan = document.getElementById("progressPercent");

  // Initialize modal state
  modal.style.display = "none";
  // progressDiv.style.display = "none"; // Photo upload related

  // Load reviews on page load
  loadSavedReviews();

  // Event Listeners
  writeReviewButton.addEventListener("click", function() {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  closeButton.addEventListener("click", closeModal);
  
  window.addEventListener("click", function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  sortSelect.addEventListener('change', function() {
    sortReviews();
  });
  
  // Photo upload event listeners commented out
  // reviewPhotoInput.addEventListener('change', handlePhotoUpload);
  // removePhotoButton.addEventListener('click', removePhoto);
  
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    submitReview();
  });

  // Functions
  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  function loadSavedReviews() {
    database.ref('reviews').on('value', (snapshot) => {
      const reviews = [];
      snapshot.forEach((childSnapshot) => {
        reviews.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      sortReviews(reviews);
    }, (error) => {
      console.error("Error loading reviews:", error);
      showError("Error loading reviews. Please refresh.");
    });
  }

  function sortReviews(reviewsArray) {
    if (!reviewsArray) {
      database.ref('reviews').once('value').then((snapshot) => {
        const reviews = [];
        snapshot.forEach((childSnapshot) => {
          reviews.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        performSort(reviews);
      });
      return;
    }
    
    performSort(reviewsArray);
  }

  function performSort(reviews) {
    const sortBy = sortSelect.value;
    let sortedReviews = [...reviews];
    
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
    
    renderReviews(sortedReviews);
  }

  function renderReviews(reviews) {
    submittedReviewsContainer.innerHTML = '';
    
    if (!reviews || reviews.length === 0) {
      submittedReviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to submit one!</p>';
      return;
    }
    
    reviews.forEach(review => {
      submittedReviewsContainer.appendChild(createReviewCard(review));
    });
  }

  function createReviewCard(review) {
    const card = document.createElement("div");
    card.className = "testimonial-card";
    
    // Photo display commented out
    // let photoHTML = '';
    // if (review.photoUrl) {
    //   photoHTML = `<div class="review-photo"><img src="${review.photoUrl}" alt="Review photo" loading="lazy"></div>`;
    // }
    
    card.innerHTML = `
      <div class="testimonial-content">
        ${/* photoHTML */ ''}
        <p>"${review.testimonialText}"</p>
        <h4>- ${review.name}</h4>
        <p>${'⭐'.repeat(review.rating)}</p>
      </div>
    `;
    return card;
  }

  async function submitReview() {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    
    const review = {
      testimonialText: form.testimonial.value,
      name: form.name.value,
      rating: Number(form.rating.value),
      timestamp: new Date().toISOString()
    };
    
    try {
      // Photo upload commented out
      // const photoFile = reviewPhotoInput.files[0];
      // if (photoFile) {
      //   review.photoUrl = await uploadPhoto(photoFile);
      // }
      
      await saveReview(review);
      form.reset();
      closeModal();
      // removePhoto(); // Photo upload related
      
    } catch (error) {
      console.error("Submission error:", error);
      showError(error.message || "Failed to submit review. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
      // progressDiv.style.display = 'none'; // Photo upload related
    }
  }

  // Photo upload functions commented out
  /*
  function uploadPhoto(file) {
    return new Promise((resolve, reject) => {
      progressDiv.style.display = 'block';
      progressBar.value = 0;
      percentSpan.textContent = '0';

      const storageRef = storage.ref();
      const filename = `review_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const fileRef = storageRef.child(`review_photos/${filename}`);
      
      const uploadTask = fileRef.put(file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressBar.value = progress;
          percentSpan.textContent = Math.round(progress);
        },
        (error) => {
          progressDiv.style.display = 'none';
          console.error('Upload error:', error);
          reject(new Error('Photo upload failed. Please try again.'));
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            progressDiv.style.display = 'none';
            resolve(downloadURL);
          }).catch((error) => {
            progressDiv.style.display = 'none';
            console.error('URL retrieval error:', error);
            reject(new Error('Failed to get image URL.'));
          });
        }
      );
    });
  }
  */

  function saveReview(review) {
    return new Promise((resolve, reject) => {
      database.ref('reviews').push(review)
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }

  // Photo upload handlers commented out
  /*
  function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImage.src = e.target.result;
        photoPreview.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    }
  }

  function removePhoto() {
    reviewPhotoInput.value = '';
    photoPreview.style.display = 'none';
    previewImage.src = '#';
  }
  */

  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    submittedReviewsContainer.prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }
});