console.log("Holo.ts start")

import {DXF} from "./DXF";

console.log("Holo.ts loaded")

let dxf = new DXF();
let holo = document.getElementById("holo");
holo.appendChild(dxf.previewCanvas(100, 100));
holo.appendChild(dxf.downloadLink("test.dxf"));

console.log("Holo.ts done")
