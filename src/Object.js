// Base class for all objects
class BaseObject {
    constructor(baseImage, animations = [[]], bounds = {x:0, y:0, w:0, h:0}) {
        this.baseImage = baseImage; // p5.Image or string path
        this.animations = animations; // Array of arrays of p5.Image
        this.bounds = bounds; // {x, y, w, h}
    }

    draw() {
        // Draw the base image at bounds.x, bounds.y
        if (this.baseImage) {
            image(this.baseImage, this.bounds.x, this.bounds.y);
        }
    }

    isInside(x, y) {
        // Check if (x, y) is inside bounds
        return (
            x >= this.bounds.x &&
            x <= this.bounds.x + this.bounds.w &&
            y >= this.bounds.y &&
            y <= this.bounds.y + this.bounds.h
        );
    }
}

// Event class to hold a callback/lambda
class Event {
    constructor(callback) {
        this.callback = callback; // Function to execute
    }
    trigger(...args) {
        if (this.callback) this.callback(...args);
    }
}

// AnimatedObject extends BaseObject, adds animation logic
class AnimatedObject extends BaseObject {
    constructor(baseImage, animations, bounds) {
        super(baseImage, animations, bounds);
        this.currentAnim = 0;
        this.currentFrame = 0;
        this.frameDelay = 5; // frames to wait before switching
        this.frameCount = 0;
    }

    update() {
        // Advance animation
        if (this.animations[this.currentAnim].length > 0) {
            this.frameCount++;
            if (this.frameCount >= this.frameDelay) {
                this.currentFrame = (this.currentFrame + 1) % this.animations[this.currentAnim].length;
                this.frameCount = 0;
            }
        }
    }

    draw() {
        // Draw current animation frame or base image
        if (this.animations[this.currentAnim].length > 0) {
            image(this.animations[this.currentAnim][this.currentFrame], this.bounds.x, this.bounds.y);
        } else {
            super.draw();
        }
    }
}

// Interactable object with event support
class InteractableObject extends AnimatedObject {
    constructor(baseImage, animations, bounds) {
        super(baseImage, animations, bounds);
        this.events = {};
    }

    on(eventName, callback) {
        this.events[eventName] = new Event(callback);
    }

    trigger(eventName, ...args) {
        if (this.events[eventName]) {
            this.events[eventName].trigger(...args);
        }
    }
}

// Wall class to hold objects on a wall
class Wall {
    constructor(name, backgroundImage = null, bounds = {x: 0, y: 0, w: 0, h: 0}) {
        this.name = name;
        this.backgroundImage = backgroundImage;
        this.bounds = bounds;
        this.objects = []; // Array of InteractableObjects on this wall
    }

    addObject(obj) {
        this.objects.push(obj);
    }

    removeObject(obj) {
        const index = this.objects.indexOf(obj);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
    }

    update() {
        // Update all objects on this wall
        for (let obj of this.objects) {
            obj.update();
        }
    }

    draw() {
        // Draw wall background (darker gray)
        fill(80, 80, 85);
        noStroke();
        rect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h * 0.7); // Wall is top 70%
        
        // Draw floor/ground (light gray)
        fill(180, 180, 185);
        rect(this.bounds.x, this.bounds.y + this.bounds.h * 0.7, this.bounds.w, this.bounds.h * 0.3); // Floor is bottom 30%
        
        // Draw background image if exists (on top of colored background)
        if (this.backgroundImage) {
            image(this.backgroundImage, this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
        }

        // Draw all objects on this wall
        for (let obj of this.objects) {
            obj.draw();
        }
    }

    handleClick(x, y) {
        // Check if click is within wall bounds first
        if (x >= this.bounds.x && x <= this.bounds.x + this.bounds.w &&
            y >= this.bounds.y && y <= this.bounds.y + this.bounds.h) {
            
            // Check objects on this wall
            for (let obj of this.objects) {
                if (obj.isInside(x, y)) {
                    obj.trigger('click');
                    return true; // Click was handled
                }
            }
        }
        return false; // Click not handled
    }
}

// Room class with 4 walls
class Room {
    constructor() {
        this.walls = {
            north: new Wall('North Wall'),
            east: new Wall('East Wall'), 
            south: new Wall('South Wall'),
            west: new Wall('West Wall')
        };
        this.currentWall = 'north'; // Which wall we're currently viewing
    }

    setWallBounds(wallName, bounds) {
        if (this.walls[wallName]) {
            this.walls[wallName].bounds = bounds;
        }
    }

    setWallBackground(wallName, backgroundImage) {
        if (this.walls[wallName]) {
            this.walls[wallName].backgroundImage = backgroundImage;
        }
    }

    addObjectToWall(wallName, obj) {
        if (this.walls[wallName]) {
            this.walls[wallName].addObject(obj);
        }
    }

    removeObjectFromWall(wallName, obj) {
        if (this.walls[wallName]) {
            this.walls[wallName].removeObject(obj);
        }
    }

    switchToWall(wallName) {
        if (this.walls[wallName]) {
            this.currentWall = wallName;
            console.log(`Switched to ${wallName} wall`);
        }
    }

    getCurrentWall() {
        return this.walls[this.currentWall];
    }

    update() {
        // Update current wall
        this.getCurrentWall().update();
    }

    draw() {
        // Draw current wall
        this.getCurrentWall().draw();
        
        // Draw wall indicator with better styling
        fill(255, 255, 255, 200);
        noStroke();
        rect(10, 10, 200, 35);
        
        fill(40);
        textAlign(LEFT);
        textSize(16);
        text(`Current Wall: ${this.currentWall.toUpperCase()}`, 20, 32);
    }

    handleClick(x, y) {
        return this.getCurrentWall().handleClick(x, y);
    }

    // Navigation methods
    rotateClockwise() {
        const order = ['north', 'east', 'south', 'west'];
        const current = order.indexOf(this.currentWall);
        const next = (current + 1) % 4;
        this.switchToWall(order[next]);
    }

    rotateCounterClockwise() {
        const order = ['north', 'east', 'south', 'west'];
        const current = order.indexOf(this.currentWall);
        const next = (current - 1 + 4) % 4;
        this.switchToWall(order[next]);
    }
}