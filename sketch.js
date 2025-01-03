let molds = [];  
let num = 4000;
let d;
let noGoZones = [];  // Define no-go zones array

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  d = pixelDensity();

  // Create molds
  for (let i = 0; i < num; i++) {
    molds[i] = new Mold();
  }

  // Step 1: Add hover effect for project items
  const projectItems = document.querySelectorAll('.project-item');
  projectItems.forEach(item => {
    item.addEventListener('mouseenter', (e) => {
      // When hovering, update the noGoZones to reflect the project's position
      const rect = item.getBoundingClientRect();
      noGoZones.push({
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height
      });
    });

    item.addEventListener('mouseleave', () => {
      // When hover ends, reset the lines back to normal behavior
      noGoZones = noGoZones.filter(zone => !isWithinProjectZone(zone));
    });
  });
}

// Function to check if the zone is within the project area
function isWithinProjectZone(zone) {
  return zone.x >= 0 && zone.y >= 0 && zone.w >= 0 && zone.h >= 0;
}

function draw() {
  background(0, 6);
  loadPixels();

  // Update and display all molds
  for (let i = 0; i < num; i++) {
    molds[i].update();
    molds[i].display();
  }
}