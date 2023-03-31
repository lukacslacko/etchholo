"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Holo.ts start");
var DXF_1 = require("./DXF");
console.log("Holo.ts loaded");
var dxf = new DXF_1.DXF();
var holo = document.getElementById("holo");
holo.appendChild(dxf.previewCanvas(100, 100));
holo.appendChild(dxf.downloadLink("test.dxf"));
console.log("Holo.ts done");
//# sourceMappingURL=Holo.js.map