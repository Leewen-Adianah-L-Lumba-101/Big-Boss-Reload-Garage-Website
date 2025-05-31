
  document.addEventListener("DOMContentLoaded", function () {
  const viewBtn = document.getElementById("view-location");
  if (viewBtn) {
    viewBtn.addEventListener("click", function () {
      console.log("Button clicked. Navigating to Google Maps.");
      window.location.href = "https://maps.app.goo.gl/pifiz9AGy5vHHQWt7";
    });
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const viewBtn = document.getElementById("view-location");
  if (viewBtn) {
    viewBtn.addEventListener("click", function () {
      console.log('Button clicked. Will navigate to Map Tab.');
      window.location.href = 'Navigation.html';
    
    
    });
  }
});