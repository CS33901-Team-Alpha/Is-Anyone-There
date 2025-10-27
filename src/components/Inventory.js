class InventoryItem {
    constructor(name, spriteName) {
        this.name = name;
        this.spriteName = spriteName;
        this.sprite = SM.get(spriteName);
        this.count = 1;
    }

    increment() {
        this.count += 1;
    }

    getSprite() {
        return this.sprite;
    }
}

class InventoryManager {
    constructor(baseZIndex = 900) {

        this.maxSlots = 9; // or however many slots you want visible
        
        this.items = Array(this.maxSlots).fill(null);

        this.baseZIndex = baseZIndex;

        this.baseY = -3; // Start hidden above screen
        this.visibleY = 0.5; // Slide to this Y when visible
        this.hiddenY = -2.6;

        this.innerSpriteScale = 1; // scale relative to slot size

        this.slotSize = 1.2;           // size of each slot box
        this.spriteSize = 1.2;         // size of the item sprite inside
        this.innerSpriteScale = 1.0;   // keep full spriteSize for now
        this.margin = 0.1;

        const slotAreaWidth = this.maxSlots * (this.slotSize + this.margin) - this.margin;
        const barPadding = 0.3;
        this.barWidth = slotAreaWidth + barPadding * 2;
        this.barHeight = this.slotSize + barPadding * 2;
        this.startX = (16 - this.barWidth) / 2;
        this.barPadding = barPadding;

        const totalWidth = this.maxSlots * (this.spriteSize + this.margin) - this.margin;

        this.hoverZoneWidth = 2;

        this.hoverZone = {
            x: this.startX + this.barWidth / 2 - this.hoverZoneWidth / 2,
            y: 0.5,
            width: this.hoverZoneWidth,
            height: 0.5
            };

        this.draggingItem = null;
        this.dragOffset = { x: 0, y: 0 };

    }

    addItem(newItem) {
    const existing = this.items.find(i => i?.name === newItem.name);
    if (existing) {
        existing.increment();
        return;
    }

    const emptyIndex = this.items.findIndex(i => i === null);
    if (emptyIndex !== -1) {
        this.items[emptyIndex] = newItem;
    } else {
        console.warn("Inventory full, cannot add:", newItem.name);
    }
}


    update(dt) {
        const m = VM.mouse();

        // Use the bar's *visible* Y position for hover detection
        const barLeft   = this.startX;
        const barRight  = this.startX + this.barWidth;
        const barTop    = this.visibleY;
        const barBottom = this.visibleY + this.barHeight;

        const hovering = (
            m.x >= barLeft &&
            m.x <= barRight &&
            m.y >= barTop &&
            m.y <= barBottom
        );

        const targetY = hovering ? this.visibleY : this.hiddenY;
        this.baseY += (targetY - this.baseY) * 0.2;
    }

    mousePressed(p) {
        const m = p ?? VM.mouse();
        const u = VM.u(), v = VM.v();

        for (let i = 0; i < this.maxSlots; i++) {
            const x = this.startX + this.barPadding + i * (this.slotSize + this.margin);
            const y = this.baseY + this.barPadding;

            const inBounds = (
                m.x >= x &&
                m.x <= x + this.slotSize &&
                m.y >= y &&
                m.y <= y + this.slotSize
            );

            if (inBounds && this.items[i]) {
                this.draggingItem = this.items[i];
                this.dragOffset.x = m.x - x;
                this.dragOffset.y = m.y - y;
                this.items[i] = null; // remove from slot
                break;
            }
        }
    }

    reinsertItem(item) {
    const emptyIndex = this.items.findIndex(i => i === null);
    if (emptyIndex !== -1) {
        this.items[emptyIndex] = item;
    } else {
        console.warn("Inventory full, cannot reinsert:", item.name);
    }
}

    mouseReleased(p) {
        if (this.draggingItem) {
        const emptyIndex = this.items.findIndex(i => i === null);
        if (emptyIndex !== -1) {
            this.items[emptyIndex] = this.draggingItem;
        } else {
            console.warn("Inventory full, item dropped:", this.draggingItem.name);
        }
        this.draggingItem = null;
        }
    }

    handleDrop(p) {
    if (this.draggingItem) {
        const activeView = WORLD.getCurrentView?.();
        const accepted = activeView?.handleInventoryDrop?.(this.draggingItem, p);

        if (!accepted) {
            this.reinsertItem(this.draggingItem);
        }

        this.draggingItem = null;
    }
}


        draw() {
            const u = VM.u(), v = VM.v();
            const totalWidth = this.maxSlots * (this.spriteSize + this.margin) - this.margin;
            const slotAreaWidth = this.maxSlots * (this.slotSize + this.margin) - this.margin;
            const barPadding = 0.3; // padding around the slot area
            const barWidth = slotAreaWidth + barPadding * 2;
            const barHeight = this.slotSize + barPadding * 2;
            const startX = this.startX;

            // Draw inventory background bar
            push();
            fill(10, 10, 10, 220); // darker background
            stroke(255);
            strokeWeight(2);
            rect(startX * u, this.baseY * v, barWidth * u, barHeight * v);
            pop();

            push();
            fill(255, 255, 0, 200);
            stroke(0);
            strokeWeight(2);
            triangle(
            this.hoverZone.x * u, this.hoverZone.y * v,
            (this.hoverZone.x + this.hoverZone.width) * u, this.hoverZone.y * v,
            (this.hoverZone.x + this.hoverZone.width / 2) * u, (this.hoverZone.y + 0.3) * v
            );
            pop();



            // Draw each slot
            for (let i = 0; i < this.maxSlots; i++) {
            const x = startX + this.barPadding + i * (this.slotSize + this.margin);
            const y = this.baseY + this.barPadding;

            // Draw slot box
            const bgSprite = SM.get("inventorySlotBackground");
            if (bgSprite) {
                bgSprite.setSize(this.slotSize, this.slotSize);
                bgSprite.setPos(x, y);
                bgSprite.draw();
            } else {
                push();
                fill(60, 60, 60, 220);
                stroke(255);
                strokeWeight(2);
                rect(x * u, y * v, this.slotSize * u, this.slotSize * v);
                pop();
            }

            // Draw item if present
            const item = this.items[i];
            if (item) {
                const offset = (this.slotSize - this.spriteSize) / 2;
                item.sprite.setSize(this.spriteSize, this.spriteSize);
                item.sprite.setPos(x + offset, y + offset);
                item.sprite.draw();

                if (item.count > 1) {
                    push();
                    fill(255);
                    stroke(0);
                    strokeWeight(2);
                    textAlign(RIGHT, BOTTOM);
                    textFont(terminusFont);
                    textSize(0.4 * v);
                    text(`${item.count}`, (x + this.slotSize) * u - 4, (y + this.slotSize) * v - 4);
                    pop();
                }
            }
        }

        if (this.draggingItem) {
            const m = VM.mouse();
            this.draggingItem.sprite.setSize(this.spriteSize, this.spriteSize);
            this.draggingItem.sprite.setPos(m.x - this.dragOffset.x, m.y - this.dragOffset.y);
            this.draggingItem.sprite.draw();
        }
    }
}