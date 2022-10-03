import * as block from "./block.js";
import * as canvas from "./canvasHandler.js";
import * as basic from "./basic.js";
canvas.canvasFitWindow();
const MapSize = {
    x: Math.floor(canvas.CANVAS.width / block.BLOCK_SIZE),
    y: Math.floor(canvas.CANVAS.height / block.BLOCK_SIZE),
};
const MapCenter = {
    x: Math.floor(MapSize.x / 2), y: Math.floor(MapSize.y / 2),
};
const MapPoint1 = {
    x: Math.floor(MapSize.x * 2 / 7), y: Math.floor(MapSize.y / 2),
};
const MapPoint2 = {
    x: Math.floor(MapSize.x * 5 / 7), y: Math.floor(MapSize.y / 2),
};
var range = MapSize.x / 2;
for (var x = 0; x < MapSize.x; x++) {
    for (var y = 0; y < MapSize.y; y++) {
        var distance1 = basic.getPointDistance(x, y, MapPoint1.x, MapPoint1.y);
        var distance2 = basic.getPointDistance(x, y, MapPoint2.x, MapPoint2.y);
        if (x == 0 || y == 0 || x == MapSize.x - 1 || y == MapSize.y - 1) {
            new block.LifeSourceBlock(x, y);
        }
        else if (distance1 + distance2 <= range) {
            new block.AccidentalLifeBlock(x, y);
        }
        else {
            new block.NormalLifeBlock(x, y);
        }
    }
}
window.setInterval(() => {
    block.MapBlock.updateBlocks();
}, 100);
