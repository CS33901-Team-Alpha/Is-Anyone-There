export class ReactorView {
    constructor(model){
        this.model = model; 

        this.colorInfo = [
            { name: 'red', x: 8,  y: 3.25, col: color(255, 0, 0) },
            { name: 'blue', x: 10.75, y: 5, col: color(0, 128, 255) },
            { name: 'green', x: 8,  y: 6.75, col: color(0, 255, 100) },
            { name: 'yellow', x: 5.25, y: 5, col: color(255, 255, 0) },
        ]; 

        // this.background = SM.get("westWallReactor");
        this.background.setSize(16,9);
    }

    draw(){
        if(this.background) this.background.draw(); 
        else background(10)

        const u = VM.u(); 
        const v = VM.v(); 

        fill(0, 0, 0, 180); // Red, Green, Blue
        rect(1*u, 1*v, 14*u, 7*v);

        for(const zone of this.colorInfo){
            const active = this.model.activeColor === zone.name;
            const pulse = active ? 1.2 : 1.0;
            fill(active ? lerpColor(zone.col, color(255), 0.4) : zone.col);
            ellipse(zone.x * u, zone.y * v, 1.8 * u * pulse, 1.8 * v * pulse);
            fill(0);
            text(zone.name.toUpperCase(), zone.x * u, zone.y * v);
        }
    }
}; 