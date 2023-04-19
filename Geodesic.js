// Manual code: "class Vector3d"
class Vector3d {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(v) {
        return new Vector3d(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        return new Vector3d(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    scale(s) {
        return new Vector3d(this.x * s, this.y * s, this.z * s);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    cross(v) {
        return new Vector3d(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
    length() {
        return Math.sqrt(this.dot(this));
    }
    normalize() {
        return this.scale(1 / this.length());
    }
    distance(v) {
        return this.sub(v).length();
    }
}
// Manual code: "class RootedVector"
class RootedVector {
    constructor(root, vector) {
        this.root = root;
        this.vector = vector;
    }
}
class ZeroOfFunction {
    constructor(f) {
        this.f = f;
    }
    closestPoint(p) {
        let origValue = this.f(p);
        let direction = this.normal(p).scale(-origValue);
        let distance = 0;
        let step = 1;
        while (step > 0.0001) {
            let newValue = this.f(p.add(direction.scale(distance + step)));
            while (newValue * origValue > 0 && distance + step < 100) {
                distance += step;
                newValue = this.f(p.add(direction.scale(distance + step)));
            }
            step /= 2;
        }
        return p.add(direction.scale(distance));
    }
    normal(p) {
        let h = 0.0001;
        let dx = this.f(p.add(new Vector3d(h, 0, 0))) - this.f(p.add(new Vector3d(-h, 0, 0)));
        let dy = this.f(p.add(new Vector3d(0, h, 0))) - this.f(p.add(new Vector3d(0, -h, 0)));
        let dz = this.f(p.add(new Vector3d(0, 0, h))) - this.f(p.add(new Vector3d(0, 0, -h)));
        return new Vector3d(dx, dy, dz).normalize();
    }
}
class Ellipsoid extends ZeroOfFunction {
    constructor(center, radii) {
        super((p) => {
            let q = p.sub(center);
            return ((q.x / radii.x) * (q.x / radii.x) +
                (q.y / radii.y) * (q.y / radii.y) +
                (q.z / radii.z) * (q.z / radii.z) - 1);
        });
        this.center = center;
        this.radii = radii;
    }
}
class Torus extends ZeroOfFunction {
    constructor(large_r, small_r) {
        super((p) => {
            let x = Math.sqrt(p.x * p.x + p.y * p.y) - large_r;
            return x * x + p.z * p.z - small_r * small_r;
        });
        this.large_r = large_r;
        this.small_r = small_r;
    }
}
class Paraboloid extends ZeroOfFunction {
    constructor(a, b) {
        super((p) => {
            return p.x * p.x / a + p.y * p.y / b - p.z;
        });
        this.a = a;
        this.b = b;
    }
}
class Hyperboloid extends ZeroOfFunction {
    constructor(a, b) {
        super((p) => {
            return p.x * p.x / a - p.y * p.y / b - p.z;
        });
        this.a = a;
        this.b = b;
    }
}
class Cone extends ZeroOfFunction {
    constructor(a, b) {
        super((p) => {
            return p.x * p.x / a + p.y * p.y / a - p.z * b;
        });
        this.a = a;
        this.b = b;
    }
}
class Cylinder extends ZeroOfFunction {
    constructor(a, b) {
        super((p) => {
            return p.x * p.x / a + p.y * p.y / a - b * b;
        });
        this.a = a;
        this.b = b;
    }
}
class Geodesic {
    constructor(surface) {
        this.surface = surface;
    }
    nextPointAndDirection(pointAndDirection, stepSize) {
        let nextPoint = pointAndDirection.root.add(pointAndDirection.vector.scale(stepSize));
        let closestPoint = this.surface.closestPoint(nextPoint);
        let nextDirection = closestPoint.sub(pointAndDirection.root).normalize();
        return new RootedVector(closestPoint, nextDirection);
    }
    geodesic(startPoint, startDirection, stepSize, length) {
        startPoint = this.surface.closestPoint(startPoint);
        let points = [];
        let pointAndDirection = new RootedVector(startPoint, startDirection);
        for (let i = 0; i < length / stepSize; i++) {
            pointAndDirection = this.nextPointAndDirection(pointAndDirection, stepSize);
            points.push(pointAndDirection.root);
            // console.log(JSON.stringify(pointAndDirection));
        }
        return points;
    }
}
class SurfacePlotter {
    constructor(surface) {
        this.surface = surface;
    }
    plot(canvas, center, stepSize, length, numCurves, zoom) {
        let context = canvas.getContext("2d");
        let width = canvas.width / zoom;
        let height = canvas.height / zoom;
        let geodesic = new Geodesic(this.surface);
        let shiftX = width / 2;
        let shiftY = height / 2;
        for (let i = 0; i < numCurves; i++) {
            let angle = i * 0.05 * Math.PI / numCurves + Math.PI * 0.75;
            let direction = new Vector3d(Math.cos(angle), Math.sin(angle), 0);
            let points = geodesic.geodesic(center, direction, stepSize, length);
            context.beginPath();
            let colorAngle = Math.PI * i / numCurves;
            let red = Math.cos(colorAngle);
            let green = Math.cos(colorAngle + 2 * Math.PI / 3);
            let blue = Math.cos(colorAngle + 4 * Math.PI / 3);
            red *= red;
            green *= green;
            blue *= blue;
            red = Math.floor(255 * red);
            green = Math.floor(255 * green);
            blue = Math.floor(255 * blue);
            context.strokeStyle = "rgb(" + red + "," + green + "," + blue + ")";
            context.moveTo((points[0].x + shiftX) * zoom, (points[0].y + shiftY) * zoom);
            for (let i = 1; i < points.length; i++) {
                context.lineTo((points[i].x + shiftX) * zoom, (points[i].y + shiftY) * zoom);
            }
            context.stroke();
        }
    }
}
/*
let sphere = new Ellipsoid(new Vector3d(1, 0, 0), new Vector3d(1, 1, 1));
let p = new Vector3d(0, 0, 1);
let g = new Geodesic(sphere);
console.log(sphere.closestPoint(p));
console.log(g.geodesic(p, new Vector3d(1, 0, 0), 0.01, 0.02));
*/
let canvas = document.getElementById("canvas");
let surfacePlotter = new SurfacePlotter(new Torus(1.5, 1));
surfacePlotter.plot(canvas, new Vector3d(1, 0, 1.1), 0.01, 18, 40, 100);
//# sourceMappingURL=Geodesic.js.map