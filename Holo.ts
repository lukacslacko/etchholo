console.log("Holo.ts start")

import { DXF, DXFModule } from "./DXF.js";

console.log("Holo.ts loaded")

function arc(img: DXFModule, x: number, y: number, r: number, start_degrees: number, end_degrees: number, pieces: number): void {
    for (let i = 0; i < pieces; i++) {
        let start = start_degrees + i * (end_degrees - start_degrees) / pieces;
        let end = start_degrees + (i + 1) * (end_degrees - start_degrees) / pieces;
        let x1 = x + r * Math.cos(start / 180 * Math.PI);
        let y1 = y + r * Math.sin(start / 180 * Math.PI);
        let x2 = x + r * Math.cos(end / 180 * Math.PI);
        let y2 = y + r * Math.sin(end / 180 * Math.PI);
        img.line(x1, y1, x2, y2);
    }
}

class Point3d {
    constructor(public x: number, public y: number, public z: number) {}

    rotate(phi_degrees: number, theta_degrees: number): Point3d {
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
    constructor(public x: number, public y: number, public z: number, public size: number) {}

    draw(img: DXFModule, phi: number, theta: number, pieces: number): void {
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

function point3d(img: DXFModule, p: Point3d, pieces: number): void {
    let r = p.z;
    arc(img, p.x, p.y, r, -135, -45, pieces);
}

function line3d(img: DXFModule, p1: Point3d, p2: Point3d, pieces: number): void {
    for (let i = 0; i < pieces; i++) {
        let x = p1.x + i * (p2.x - p1.x) / pieces;
        let y = p1.y + i * (p2.y - p1.y) / pieces;
        let z = p1.z + i * (p2.z - p1.z) / pieces;
        point3d(img, new Point3d(x, y, z), pieces);
    }
}

let img = new DXFModule();
let cube = new Cube(0, 0, 120, 100);
cube.draw(img, 45, 30, 10);

let dxf = new DXF();
dxf.add(img.shift(300,300));
let holo = document.getElementById("holo");
holo.appendChild(dxf.previewCanvas(600, 600));
// line break
holo.appendChild(document.createElement("br"));
holo.appendChild(dxf.downloadLink("test.dxf"));

console.log("Holo.ts done")
