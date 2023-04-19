console.log("Holo.ts start");
import { DXF, DXFModule } from "./DXF.js";
console.log("Holo.ts loaded");
function arc(img, x, y, r, start_degrees, end_degrees, pieces) {
    for (let i = 0; i < pieces; i++) {
        let start = start_degrees + i * (end_degrees - start_degrees) / pieces;
        let end = start_degrees + (i + 1) * (end_degrees - start_degrees) / pieces;
        let x1 = x + r * Math.cos(start / 180 * Math.PI);
        let y1 = y + r * Math.sin(start / 180 * Math.PI);
        let x2 = x + r * Math.cos(end / 180 * Math.PI);
        let y2 = y + r * Math.sin(end / 180 * Math.PI);
        console.log("line ", x1, y1, x2, y2);
        img.line(x1, y1, x2, y2);
    }
}
class Point3d {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    rotate(phi_degrees, theta_degrees) {
        let phi = phi_degrees / 180 * Math.PI;
        let theta = theta_degrees / 180 * Math.PI;
        let x = this.x * Math.cos(phi) - this.y * Math.sin(phi);
        let y = this.x * Math.sin(phi) + this.y * Math.cos(phi);
        let z = this.z;
        let x2 = x * Math.cos(theta) - z * Math.sin(theta);
        let y2 = y;
        let z2 = x * Math.sin(theta) + z * Math.cos(theta);
        return new Point3d(x2, y2, z2);
    }
}
class Cube {
    constructor(x, y, z, size) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.size = size;
    }
    draw(img, phi, theta, pieces) {
        let p1 = new Point3d(this.x, this.y, this.z).rotate(phi, theta);
        let p2 = new Point3d(this.x + this.size, this.y, this.z).rotate(phi, theta);
        let p3 = new Point3d(this.x + this.size, this.y + this.size, this.z).rotate(phi, theta);
        let p4 = new Point3d(this.x, this.y + this.size, this.z).rotate(phi, theta);
        let p5 = new Point3d(this.x, this.y, this.z + this.size).rotate(phi, theta);
        let p6 = new Point3d(this.x + this.size, this.y, this.z + this.size).rotate(phi, theta);
        let p7 = new Point3d(this.x + this.size, this.y + this.size, this.z + this.size).rotate(phi, theta);
        let p8 = new Point3d(this.x, this.y + this.size, this.z + this.size).rotate(phi, theta);
        line3d(img, p1, p2, pieces);
        line3d(img, p2, p3, pieces);
        line3d(img, p3, p4, pieces);
        line3d(img, p4, p1, pieces);
        line3d(img, p5, p6, pieces);
        line3d(img, p6, p7, pieces);
        line3d(img, p7, p8, pieces);
        line3d(img, p8, p5, pieces);
        line3d(img, p1, p5, pieces);
        line3d(img, p2, p6, pieces);
        line3d(img, p3, p7, pieces);
        line3d(img, p4, p8, pieces);
    }
}
function point3d(img, p, span, pieces) {
    let r = p.z;
    arc(img, p.x, p.y, r, -90 - span, -90 + span, pieces);
}
function line3d(img, p1, p2, pieces, arc_span = 30, arc_pieces = 60) {
    for (let i = 0; i < pieces; i++) {
        let x = p1.x + i * (p2.x - p1.x) / pieces;
        let y = p1.y + i * (p2.y - p1.y) / pieces;
        let z = p1.z + i * (p2.z - p1.z) / pieces;
        point3d(img, new Point3d(x, y, z), arc_span, arc_pieces);
    }
}
function circle(img, x, y, r, z, pieces, arc_span, arc_pieces) {
    for (let a = 0; a < 360; a += 360 / pieces) {
        point3d(img, new Point3d(x + r * Math.cos(a / 180 * Math.PI), y + r * Math.sin(a / 180 * Math.PI), z), arc_span, arc_pieces);
    }
}
let img = new DXFModule();
// let cube = new Cube(0, 0, 120, 100);
// cube.draw(img, 45, 30, 10);
circle(img, 200, 200, 20, 80, 45, 30, 30);
let dxf = new DXF();
dxf.add(img);
let holo = document.getElementById("holo");
holo.appendChild(dxf.previewCanvas(600, 600));
// line break
holo.appendChild(document.createElement("br"));
holo.appendChild(dxf.downloadLink("test.dxf"));
console.log("Holo.ts done");
//# sourceMappingURL=Holo.js.map