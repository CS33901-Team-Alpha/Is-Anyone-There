export class TerminalView { 
    render({input, history, maxLines}){
        const u = VM.u(); 
        const v = VM.v(); 

        push();

        // monitor background / frame
        const screenSprite = SM.get("screen");
        if (screenSprite && screenSprite.src) {
        image(screenSprite.src, 2 * u, 1 * v, 12 * u, 7 * v);
        } else {
        fill(0);
        stroke(128);
        strokeWeight(2);
        rect(2 * u, 1 * v, 12 * u, 7 * v, 10);
        }

        // header bar
        noStroke();
        fill(60);
        rect(2 * u, 1 * v, 12 * u, 0.8 * v, 10);

        // header text w/ glow
        textAlign(LEFT, CENTER);
        textSize(0.45 * v);

        fill(0, 255, 0, 150);
        text("Terminal", 2.3 * u + 1, 1.4 * v + 1);

        fill(0, 255, 0);
        text("Terminal", 2.3 * u, 1.4 * v);

        // scanlines
        stroke(0, 0, 0, 30);
        strokeWeight(1);
        for (let i = 0; i < 7 * v; i += 4) {
        line(2 * u, 1 * v + i, 14 * u, 1 * v + i);
        }
        noStroke();

        // terminal log
        const left = 2.3 * u;
        const top = 1.9 * v;
        const lineH = 0.6 * v;

        textAlign(LEFT, TOP);
        textSize(0.4 * v);

        const startIndex = Math.max(0, history.length - maxLines);
        let y = top;

        for (let i = startIndex; i < history.length; i++) {
        const lineText = "> " + history[i];

        // glow
        fill(0, 255, 0, 100);
        text(lineText, left + 1, y + 1);

        // body
        fill(0, 255, 0);
        text(lineText, left, y);

        y += lineH;
        }

        // input row + blinking cursor
        const cursor = frameCount % 60 < 30 ? "_" : " ";
        const inputLine = "> " + this.input + cursor;


        fill(0, 255, 0, 100);
        text(inputLine, left + 1, y + 1);

        fill(0, 255, 0);
        text(inputLine, left, y);

        pop();

    }
}