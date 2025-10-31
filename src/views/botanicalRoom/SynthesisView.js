class SynthesisSlot {
    constructor(x, y, w, h) {
        this.bounds = { x, y, w, h };
        this.item = null;
    }

    draw() {
        const u = VM.u(), v = VM.v();
        const b = this.bounds;

        push();
        fill(60, 60, 60, 220);
        stroke(255);
        rect(b.x * u, b.y * v, b.w * u, b.h * v);
        pop();

        if (this.item) {
            this.item.sprite.setSize(1, 1);
            this.item.sprite.setPos(b.x + 0.25, b.y + 0.25);
            this.item.sprite.draw();
        }
    }

    isMouseIn(mx, my) {
        const b = this.bounds;
        return mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h;
    }

    setItem(item) {
        this.item = item;
    }

    removeItem() {
        const temp = this.item;
        this.item = null;
        return temp;
    }
}


class SynthesisView extends View {
        constructor() {
            super(0, 0, 0, '');
            this.background = SM.get("MetalWall");
            this.background.setSize(16, 9);

            this.slots = [
                new SynthesisSlot(4, 6, 1.5, 1.5),
                new SynthesisSlot(7, 6, 1.5, 1.5),
                new SynthesisSlot(10, 6, 1.5, 1.5)
            ];

            this.outputSlot = new SynthesisSlot(7, 3.5, 2, 2);

            this.confirmButton = { x: 5.5, y: 8, w: 2, h: 0.8 };
            this.cancelButton = { x: 8.5, y: 8, w: 2, h: 0.8 };

            this.draggingItem = null;
            this.dragOffset = { x: 0, y: 0 };
            
            this.alarmOverlay = new AlarmOverlay(() => GS.is('BotanicalQuarantine'));
        }

        update(dt) {
            const m = VM.mouse();
            if (this.draggingItem) {
                this.draggingItem.sprite.setPos(m.x - this.dragOffset.x, m.y - this.dragOffset.y);
            }
        }

        handleInventoryDrop(item, p) {
        for (const slot of this.slots) {
            if (!slot.item && slot.isMouseIn(p.x, p.y)) {
                slot.setItem(item);
                this.updateOutputPreview();
                return true;
            }
        }
        return false;
    }


    draw() {
        if (this.background) 
        {
            this.background.draw();
        } 
        else 
        {
            push();
            background(30);
            fill(255);
            text("Missing background sprite", 1 * VM.u(), 1 * VM.v());
            pop();
        }
        this.slots.forEach(slot => slot.draw());
        this.outputSlot.draw();
        this.drawButton(this.confirmButton, "Confirm");
        this.drawButton(this.cancelButton, "Cancel");

        if (this.draggingItem) {
            this.draggingItem.sprite.draw();
        }
    }

    drawButton(btn, label) {
        const u = VM.u(), v = VM.v();
        push();
        fill(40, 80, 145, 240);
        stroke(255);
        rect(btn.x * u, btn.y * v, btn.w * u, btn.h * v);
        fill(255);
        textAlign(CENTER, CENTER);
        textFont(terminusFont);
        textSize(0.3 * v);
        text(label, (btn.x + btn.w / 2) * u, (btn.y + btn.h / 2) * v);
        pop();
    }

    mousePressed(p) {
        const m = p ?? VM.mouse();

        for (const slot of this.slots) {
            if (slot.item && slot.isMouseIn(m.x, m.y)) {
                this.draggingItem = slot.removeItem();
                this.dragOffset = { x: m.x - slot.bounds.x, y: m.y - slot.bounds.y };
                return;
            }
        }

        if (this.inBounds(m, this.confirmButton)) this.confirmSynthesis();
        if (this.inBounds(m, this.cancelButton)) this.cancelSynthesis();
    }

    mouseReleased(p) {
        const m = p ?? VM.mouse();

        if (this.draggingItem) {
            for (const slot of this.slots) {
                if (!slot.item && slot.isMouseIn(m.x, m.y)) {
                    slot.setItem(this.draggingItem);
                    this.draggingItem = null;
                    this.updateOutputPreview();
                    return;
                }
            }

            IM.addItem(this.draggingItem);
            this.draggingItem = null;
        }
    }

    inBounds(m, b) {
        return m.x >= b.x && m.x <= b.x + b.w && m.y >= b.y && m.y <= b.y + b.h;
    }

    updateOutputPreview() {
        const names = this.slots.map(s => s.item?.name).filter(Boolean).sort().join("+");
        if (names === "Chionodoxa siehei+GOAT Plant+SomeOtherItem") {
            this.outputSlot.setItem(new InventoryItem("Oxygenator Serum", "oxygenatorIcon"));
        } else {
            this.outputSlot.setItem(null);
        }
    }

    confirmSynthesis() {
        if (this.outputSlot.item) {
            IM.addItem(this.outputSlot.item);
            this.slots.forEach(s => s.setItem(null));
            this.outputSlot.setItem(null);
        }
    }

    cancelSynthesis() {
        this.slots.forEach(s => {
            if (s.item) IM.addItem(s.item);
            s.setItem(null);
        });
        this.outputSlot.setItem(null);
    }

    onEnter() {
        R.add(this.alarmOverlay, 100)
    }

    onExit() {
        R.remove(this.alarmOverlay)
    }
}