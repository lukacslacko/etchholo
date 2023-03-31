export class DXF {
    constructor() {
        this.lines = new Array();
        this.dxfLines = new Array();
        this.lines.push("0", "SECTION", "2", "ENTITIES");
    }
    add(piece) {
        for (let line of piece.lines) {
            this.dxfLines.push(line);
            this.line(line.x1, line.y1, line.x2, line.y2);
        }
    }
    line(x1, y1, x2, y2) {
        this.lines.push("0", "LINE", "8", "Polygon", "10", "" + x1, "20", "" + (-y1), "11", "" + x2, "21", "" + (-y2));
    }
    content() {
        this.lines.push("0", "ENDSEC", "0", "EOF");
        return this.lines.join("\r\n");
    }
    downloadLink(filename) {
        let result = document.createElement("a");
        result.innerHTML = filename;
        result.setAttribute("download", filename);
        result.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(this.content()));
        return result;
    }
    previewCanvas(width, height) {
        let result = document.createElement("canvas");
        result.setAttribute("width", "" + width);
        result.setAttribute("height", "" + height);
        let ctx = result.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height - 1);
        ctx.lineTo(width - 1, height - 1);
        ctx.lineTo(width - 1, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
        for (let line of this.dxfLines) {
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
        }
        return result;
    }
}
class DXFLine {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}
export class DXFModule {
    constructor() {
        this.lines = new Array();
        this.minX = 0;
        this.minY = 0;
        this.maxX = 0;
        this.maxY = 0;
    }
    line(x1, y1, x2, y2) {
        this.lines.push(new DXFLine(x1, y1, x2, y2));
        this.minX = Math.min(this.minX, x1, x2);
        this.maxX = Math.max(this.maxX, x1, x2);
        this.minY = Math.min(this.minY, y1, y2);
        this.maxY = Math.max(this.maxY, y1, y2);
    }
    shift(x, y) {
        let result = new DXFModule();
        for (let line of this.lines) {
            result.line(x + line.x1, y + line.y1, x + line.x2, y + line.y2);
        }
        return result;
    }
}
//# sourceMappingURL=DXF.js.map