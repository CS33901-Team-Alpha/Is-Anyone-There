class OxygenPressureModel {
    constructor() {
        this.influenceMatrixLayouts = [
        [
            [ +0.2,  0.0, +0.1,  0.0 ],  // KEY: AAACCCDCA
            [  0.0, +0.1, -0.1, +0.1 ],
            [  0.0, +0.1,  0.0, +0.2 ],
            [  0.0, +0.2, +0.1,  0.0 ],
        ],
        [
            [ +0.1, +0.3,  0.0, +0.2 ],  // KEY: ADCBBA
            [ +0.2,  0.0, +0.2, +0.1 ],
            [  0.0, +0.1,  0.0, +0.3 ],
            [ +0.1, +0.3, +0.1,  0.0 ],
        ], 
        [
            [ +0.2, +0.1, +0.2,  0.0 ],  // KEY: DCCBA
            [  0.0, +0.1, +0.2, +0.2 ],
            [ +0.1, +0.3, +0.2, +0.1 ],
            [ +0.3,  0.0, +0.1, +0.3 ],
        ],
        [
            [ +0.3, +0.1, +0.1, +0.3 ],  // KEY: BDDAC
            [  0.0, +0.3, +0.1, +0.3 ],
            [ +0.5, +0.4, +0.3, +0.2 ],
            [ +0.1,  0.0, +0.2,  0.0 ],
        ],
        [
            [ +0.2, +0.1,  0.0, +0.1 ],  // KEY: DDACBBBC
            [ +0.1, +0.1, +0.1, +0.2 ],
            [ +0.1, +0.1, +0.1,  0.0 ],
            [  0.0, +0.1, +0.2, +0.1 ],
        ],
        ];

        this.pressureLayouts = [
            [0.2, 0.4, 0.5, 0.2],
            [0.3, 0.0, 0.5, 0.1],
            [0.3, 0.2, 0.1, 0.3],
            [0.0, 0.2, 0.1, 0.2],
            [0.3, 0.2, 0.1, 0.1]
        ];

        this.seed = int(random(0,5))
        this.influenceMatrix = this.influenceMatrixLayouts[this.seed];
        this.startingPressures = this.pressureLayouts[this.seed];

        this.pressures = [...this.startingPressures];

        this.targetPressure = 1.0;
        this.solved = false;
    }

    reset() {
        this.pressures = [...this.startingPressures];
        this.solved = false;
    }

    changePressure(index) {
        if (this.solved) return;

        const influence = this.influenceMatrix[index];

        const valid = this.bars.every((bar, i) => {
        const next = bar.pressure + influence[i];
        return next >= 0 && next <= 1;
        });

        if (!valid) return;

        for (let i = 0; i < this.bars.length; i++) {
            const delta = influence[i];
            const bar = this.bars[i];
            bar.pressure = Math.min(1, Math.max(0, bar.pressure + delta));
        }
        
        if (this.checkWin()) {
            this.solved = true;
        }
    }

    checkWin() {
        return this.bars.every(b => b.pressure >= this.targetPressure - 0.00001);
    }
}