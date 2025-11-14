class ReactorStartupModel {
    constructor(maxRounds = 5) {
        this.colors = [
            { name: 'red', x: 8, y: 3.25 },
            { name: 'blue', x: 10.75, y: 5 },
            { name: 'green', x: 8, y: 6.75 },
            { name: 'yellow', x: 5.25, y: 5 },
        ];
        this.maxRounds = maxRounds;
        this.round = 1;
        this.resetState();
    }

    resetState() {
        this.sequence = [];
        this.playerInput = [];
        this.locked = true;
        this.step = 0;
        this.activeColor = null;
        this.meltdown = false;
        this.completed = false;
    }

    startSequence(length = 4) {
        this.resetState();
        this.sequenceLength = length;
        this.sequence = Array.from({length}, () => random(this.colors).name);
        this.flashDuration = Math.max(0.1, 0.4 - (this.round - 1) * 0.12);
        this.locked = true;
        this.step = 0;
        return this.sequence;
    }

    flashNext() {
        if (this.step >= this.sequence.length) {
            this.locked = false;
            this.activeColor = null;
            this.step = 0;
            // for controller
            return { finishedFlashing: true };
        }
        const colorName = this.sequence[this.step];
        this.activeColor = colorName;
        this.step++;
        // for controller
        return { flashing: colorName };
    }

    handleInput(colorName) {
        if (this.locked || this.meltdown || this.completed) return { ignored: true };

        this.playerInput.push(colorName);
        const expected = this.sequence[this.playerInput.length - 1];
        if (colorName !== expected) {
            this.meltdown = true;
            // for controller
            return { meltdown: true };
        }

        if (this.playerInput.length === this.sequence.length) {
            return this.checkSolved();
        }
        return { correct: true };
    }

    checkSolved() {
        this.round++;
        if (this.round > this.maxRounds) {
            this.completed = true;
            this.locked = true;
            return { completed: true };
        }
        return { roundComplete: true };
    }
}
