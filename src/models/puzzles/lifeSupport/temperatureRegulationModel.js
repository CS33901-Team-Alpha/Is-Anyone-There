export class ThermalNodeModel {
    constructor(label, temp = 50, x = 0, y = 0, min = 0, max = 100){
        this.temp = temp; 
        this.radius = 0.5; 
        this.min = min; 
        this.max = max; 
        this.x = x; 
        this.y = y; 
    }

    // set new position for node -> for dragging 
    setPosition(x, y) { this.x = x; this.y = y; }

    // adjusting the temperature based off of the value
    adjust(delta) {
        this.temp += delta; 
        this.temp = Math.min(this.max, Math.max(this.min, this.temp + delta)); // has to be bet. 0 - 100
    }

    // mapping the y position to a temp. value 
    updateTempFromPosition(minY, maxY) {
        this.y = Math.min(maxY, Math.max(minY, this.y)); // limit the movement to the slider
        this.temp = this.min + (this.max - this.min) * ((this.y - minY) / (maxY - minY));
    }
    
    // temp. has reached extreme limit (either 0 or 100)
    isOverflow() {
        return this.temp <= this.min || this.temp >= this.max;
    }
}; 

export class TemperaturePuzzleModel {
    constructor(){
        this.nodes = {
            A: new ThermalNode("A", 50, 6.5, 5),
            B: new ThermalNode("B", 50, 8, 5),
            C: new ThermalNode("C", 50, 9.5, 5)
        };

        this.target = { A: Math.round(random(1, 99)), B: Math.round(random(1, 99)), C: Math.round(random(1, 99))};

        // slider's vertical limits 
        this.minY = 4;
        this.maxY = 6;
    }

    checkSolved() {
        return Object.keys(this.target).every(
            k => Math.round(this.nodes[k].temp) === this.target[k]
        );
    }

        // checking if the node has hit the min. or max. temp. 
    checkOverflow() {
        return Object.values(this.nodes).some(n => n.isOverflow());
    }

}