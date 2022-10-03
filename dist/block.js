import * as canvas from "./canvasHandler.js";
export const BLOCK_SIZE = 3;
export class MapBlock {
    constructor(pos_x, pos_y) {
        this.position = { x: pos_x, y: pos_y };
        MapBlock.addBlock(this);
        this.drawSelf();
    }
    getDrawPosition() {
        return { x: BLOCK_SIZE * this.position.x,
            y: BLOCK_SIZE * this.position.y };
    }
    static updateBlocks() {
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].update();
        }
        AccidentalLifeBlock.accidentalLifeBlocksUpdate();
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].afterUpdate();
        }
    }
    static haveBlock(pos_x, pos_y) {
        return (pos_x in this.blocks_hash && pos_y in this.blocks_hash[pos_x]);
    }
    static addBlock(block) {
        if (!(block.position.x in this.blocks_hash)) {
            this.blocks_hash[block.position.x] = {};
        }
        this.blocks_hash[block.position.x][block.position.y] = block;
        this.blocks.push(block);
    }
}
MapBlock.blocks_hash = {};
MapBlock.blocks = [];
export class NormalLifeBlock extends MapBlock {
    constructor() {
        super(...arguments);
        this.life = false;
        this.next_life = false;
    }
    getLife() {
        return this.life;
    }
    setLife(life) {
        if (this.life != life) {
            this.life = life;
            this.drawSelf();
        }
    }
    deadColor() { return "#002200"; }
    lifeColor() { return "#99FF99"; }
    drawSelf() {
        canvas.CTX2D.fillStyle = (this.life) ? this.lifeColor() : this.deadColor();
        var drawPos = this.getDrawPosition();
        canvas.CTX2D.fillRect(drawPos.x, drawPos.y, BLOCK_SIZE, BLOCK_SIZE);
    }
    setNextLife(life) {
        this.next_life = life;
    }
    getAroundLife() {
        var sum = 0;
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                var pos = { x: this.position.x + dx, y: this.position.y + dy };
                if (!MapBlock.haveBlock(pos.x, pos.y) || (dx == 0 && dy == 0)) {
                    continue;
                }
                if (MapBlock.blocks_hash[pos.x][pos.y].getLife()) {
                    sum += 1;
                }
            }
        }
        return sum;
    }
    lifeMode() {
        var aroundLife = this.getAroundLife();
        this.next_life = (aroundLife >= 2 && aroundLife <= 3);
    }
    deadMode() {
        var aroundLife = this.getAroundLife();
        this.next_life = (aroundLife == 3);
    }
    update() {
        if (this.life)
            this.lifeMode();
        else
            this.deadMode();
    }
    afterUpdate() {
        this.setLife(this.next_life);
    }
}
export class AccidentalLifeBlock extends NormalLifeBlock {
    constructor(pos_x, pos_y) {
        super(pos_x, pos_y);
        AccidentalLifeBlock.accidentalLifeBlocks.push(this);
    }
    static accidentalLifeBlocksUpdate() {
        var random_rate = 0.025;
        if (Math.random() > random_rate)
            return;
        if (AccidentalLifeBlock.accidentalLifeBlocks.length <= 0)
            return;
        var getBlock = AccidentalLifeBlock.accidentalLifeBlocks[Math.floor(Math.random() * AccidentalLifeBlock.accidentalLifeBlocks.length)];
        const spawn_range = 3;
        for (var x = getBlock.position.x - spawn_range; x <= getBlock.position.x + spawn_range; x++) {
            for (var y = getBlock.position.y - spawn_range; y <= getBlock.position.y + spawn_range; y++) {
                if (Math.random() > 0.5)
                    continue;
                if (!MapBlock.haveBlock(x, y))
                    continue;
                MapBlock.blocks_hash[x][y].setNextLife(true);
            }
        }
    }
    deadColor() { return "#113311"; }
}
AccidentalLifeBlock.accidentalLifeBlocks = [];
export class LifeSourceBlock extends MapBlock {
    drawSelf() {
        canvas.CTX2D.fillStyle = "#00FF00";
        var drawPos = this.getDrawPosition();
        canvas.CTX2D.fillRect(drawPos.x, drawPos.y, BLOCK_SIZE, BLOCK_SIZE);
    }
    getLife() {
        return (Math.random() < 0.5555);
    }
    setNextLife(life) { }
    update() { }
    afterUpdate() { }
}
