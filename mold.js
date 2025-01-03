class Mold {
  constructor() {
    // Mold properties
    this.x = random(width / 2 - 20, width / 2 + 20);
    this.y = random(height / 2 - 20, height / 2 + 20);
    this.r = 0.5;  // Radius for display purposes

    // Random initial heading and movement properties
    this.heading = random(360);
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);
    this.rotAngle = 45;  // Angle for rotation

    // Sensor properties
    this.rSensorPos = createVector(0, 0);
    this.lSensorPos = createVector(0, 0);
    this.fSensorPos = createVector(0, 0);
    this.sensorAngle = 45;
    this.sensorDist = 10;

    // New flag to track when to apply abstract shape behavior
    this.isHovering = false;  // Tracks hover state
  }

  update() {
    // Update velocity based on heading
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);

    // Repel mold from mouse if it's close
    let mouseDist = dist(this.x, this.y, mouseX, mouseY);
    if (mouseDist < 100) {
      let angleToMouse = atan2(mouseY - this.y, mouseX - this.x);
      this.heading = angleToMouse + 180;
      this.vx *= map(mouseDist, 0, 100, 2, 0);  // Move faster closer to mouse
      this.vy *= map(mouseDist, 0, 100, 2, 0);
    }

    // Check if in a no-go zone, including hovered project areas
    for (let zone of noGoZones) {
      if (this.x > zone.x && this.x < zone.x + zone.w &&
          this.y > zone.y && this.y < zone.y + zone.h) {
        let angleToZone = atan2(zone.y + zone.h / 2 - this.y, zone.x + zone.w / 2 - this.x);
        this.heading = angleToZone + 180;  // Move away from the zone
        this.vx = cos(this.heading);
        this.vy = sin(this.heading);

        // If hovering over a project, apply abstract shape behavior
        if (this.isHovering) {
          this.heading += random(5, 15);  // Apply randomness to create abstract shapes
        }
        break;  // Exit loop once repelled
      }
    }

    // Wrap-around movement on canvas
    this.x = (this.x + this.vx + width) % width;
    this.y = (this.y + this.vy + height) % height;

    // Update sensor positions
    this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle);
    this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle);
    this.getSensorPos(this.fSensorPos, this.heading);

    // Sensor-based directional adjustments
    let index, l, r, f;
    index = 4 * (d * floor(this.rSensorPos.y)) * (d * width) + 4 * (d * floor(this.rSensorPos.x));
    r = pixels[index];
    index = 4 * (d * floor(this.lSensorPos.y)) * (d * width) + 4 * (d * floor(this.lSensorPos.x));
    l = pixels[index];
    index = 4 * (d * floor(this.fSensorPos.y)) * (d * width) + 4 * (d * floor(this.fSensorPos.x));
    f = pixels[index];

    // Direction adjustments based on sensor data
    if (f > l && f > r) {
      this.heading += 0;
    } else if (f < l && f < r) {
      this.heading += random(1) < 0.5 ? this.rotAngle : -this.rotAngle;
    } else if (l > r) {
      this.heading -= this.rotAngle;
    } else if (r > l) {
      this.heading += this.rotAngle;
    }
  }

  display() {
    noStroke();

    // Calculate the distance from the center of the canvas
    let distFromCenter = dist(this.x, this.y, width / 2, height / 2);
    
    // Make the transparency more dramatic by mapping to a sharper alpha transition
    let alphaValue = map(distFromCenter, 0, width / 3, 255, 0);
    
    // Set the fill color with the dramatic alpha value
    fill(255, alphaValue);
    
    // Display the mold
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  getSensorPos(sensor, angle) {
    sensor.x = (this.x + this.sensorDist * cos(angle) + width) % width;
    sensor.y = (this.y + this.sensorDist * sin(angle) + height) % height;
  }

  // Method to trigger hover state for abstract shapes
  setHovering(isHovering) {
    this.isHovering = isHovering;
  }
}
