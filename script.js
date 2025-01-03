const text = "Connection is everything";
let currentIndex = 0;
let currentText = "";
let isCanvasStarted = false;
const loadingText = document.getElementById("loading-text");
let typing = true;

window.onload = typeText;  // Start typing when page loads

function typeText() {
  if (typing) {
    // Type the text
    if (currentIndex < text.length) {
      currentText += text[currentIndex];
      loadingText.textContent = currentText;
      currentIndex++;
      setTimeout(typeText, 5);  // Adjust typing speed here
    } else {
      typing = false;  // Switch to deleting after the text is typed
      setTimeout(typeText, 50);  // Delay before starting to delete
    }
  } else {
    // Delete the text
    if (currentText.length > 0) {
      currentText = currentText.slice(0, -1);  // Remove the last character
      loadingText.textContent = currentText;
      setTimeout(typeText, 0.5);  // Adjust delete speed here
    } else {
      // After the text is fully deleted, call the next step (fusion or canvas)
      startCanvasAndFade();
    }
  }
}

function startCanvasAndFade() {
  // Fade out the loading screen
  document.getElementById("loading-screen").style.opacity = 0;

  // Wait for the fade-out transition to finish, then hide the loading screen
  setTimeout(() => {
    document.getElementById("loading-screen").style.display = "none";  // Hide loading screen
    
    // Start the canvas rendering
    startCanvas();
  }, 1);  // Matches the fade-out transition time (1s)
}

function startCanvas() {
  if (!isCanvasStarted) {
    isCanvasStarted = true;

    // Create the canvas and append it to the canvas container
    let canvas = createCanvas(windowWidth, windowHeight);
    document.getElementById("canvas-container").appendChild(canvas.elt);

    // Hide the canvas initially by setting it to display:none
    document.getElementById("canvas-container").style.display = "block";

    // Immediately show the canvas once it's ready (no flash of white)
    setTimeout(() => {
      document.getElementById("canvas-container").style.opacity = 1;  // Fade in canvas

      // Change the background color after the canvas fade-in
      document.body.style.backgroundColor = "#f0f0f0";  // Set the desired background color here
      fadeInContent();  // Fade in the main content after the canvas is ready
    }, 100);  // Small delay before starting fade-in
  }
}

function fadeInContent() {
  // Fade in the rest of the page content
  document.getElementById("main-content").style.display = "block";
  setTimeout(() => {
    document.getElementById("main-content").style.opacity = 1;
  }, 100);
}

// Show the project carousel
function showProjectCarousel() {
  const carousel = document.getElementById('projects-carousel');
  carousel.style.display = 'flex';
}

// Hide the project carousel
function hideProjectCarousel() {
  const carousel = document.getElementById('projects-carousel');
  carousel.style.display = 'none';
}

// Optional: Add swipe gestures for mobile users
let startX;
const carouselWrapper = document.querySelector('.carousel-wrapper');

carouselWrapper.addEventListener('touchstart', (event) => {
  startX = event.touches[0].clientX;
});

carouselWrapper.addEventListener('touchmove', (event) => {
  const deltaX = startX - event.touches[0].clientX;
  carouselWrapper.scrollLeft += deltaX;
  startX = event.touches[0].clientX;
});

function showProjects() {
  const projectsListContainer = document.getElementById('projects-list');
  const projectsCarousel = document.getElementById('projects-carousel');

  if (window.innerWidth <= 768) { 
    // Mobile view: Show carousel
    projectsCarousel.style.display = 'flex';
    projectsListContainer.style.display = 'none';
  } else {
    // Desktop view: Show project list
    projectsListContainer.classList.toggle('active');
    projectsCarousel.style.display = 'none';
  }
}



let lineEffectActive = false; // Initialize the flag for the canvas effect

// Show the project list when the "Portfolio" link is clicked
function showProjects() {
  const projects = [
    { title: "Chelsea Richards Architects", link: "#project1" },
    { title: "DMCA strike Checker", link: "#project2" },
    { title: "PULSE", link: "#project3" },
    { title: "Stoke Manor Farm Antiques", link: "#project4" }
  ];

  const projectsListContainer = document.getElementById('projects-list');
  
  // Clear any existing projects in the list
  projectsListContainer.innerHTML = '';
  
  // Create the list of project titles
  projects.forEach(project => {
    const projectItem = document.createElement('div');
    projectItem.classList.add('project-item');
    projectItem.innerHTML = `<a href="${project.link}" onclick="showProjectSection('${project.link}')">${project.title}</a>`;
    projectsListContainer.appendChild(projectItem);
  });
  
  // Toggle visibility and add no-go zone
  projectsListContainer.classList.toggle('active');
  
  // Update the no-go zone with a wider area for better line avoidance
  if (projectsListContainer.classList.contains('active')) {
    noGoZones.push({
      x: width - (projectsListContainer.offsetWidth), // Add buffer for extra space
      y: 0,
      w: projectsListContainer.offsetWidth,  // Buffer width
      h: height
    });
  } else {
    noGoZones.pop();
  }
}

// Hide the project list and sections when any other navigation link is clicked
function hideProjects() {
  const projectsListContainer = document.getElementById('projects-list');
  const projectSections = document.querySelectorAll('.project-section');
  
  projectsListContainer.classList.remove('active');
  projectSections.forEach(section => section.style.display = 'none');
  
  // Remove the no-go zone
  noGoZones = noGoZones.filter(zone => zone !== noGoZones[noGoZones.length - 1]);
}

// Show the contact section when 'Contact' link is clicked
function showContact() {
  const contactSection = document.getElementById('contact-section');
  contactSection.classList.toggle('active'); // Toggle the 'active' class to show/hide

  // Trigger canvas effect (set a flag that the canvas lines should react)
  lineEffectActive = contactSection.classList.contains('active');

}

// Hide the contact section when any navigation link is clicked
function hideContact() {
  const contactSection = document.getElementById('contact-section');
  contactSection.classList.remove('active'); // Remove 'active' class to hide the section
  
  // Reset canvas effect (stop lines from reacting)
  lineEffectActive = false;

}

// Get the elements for Info Section
const infoLink = document.getElementById('info-link');
const infoSection = document.getElementById('info-section');

// Add event listener to toggle the Info section visibility
infoLink.addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default link behavior
  infoSection.style.display = (infoSection.style.display === 'none' || infoSection.style.display === '') ? 'block' : 'none';
});

// Add event listeners to all navigation links to hide the contact section and projects list
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', function(event) {
    // Hide the contact section if visible
    hideContact();

    // Hide the project list if it's visible
    hideProjects();

    // Optionally, toggle any other sections here
  });
});

// Add event listener for 'Contact' link click to show/hide the contact section
document.querySelector('a[href="#contact"]').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default link behavior
  showContact(); // Show or hide the contact section when clicked
});

