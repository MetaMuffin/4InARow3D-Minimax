import { Vec2, Vec3 } from ".";

const prompt = require("prompt-sync")()



export function getVec2():Vec2 {
    while(1){
        try {
            var xi = prompt("X: ")
            if (xi == "exit") process.exit(0)
            var x = parseInt(xi)
            var yi = prompt("Y: ")
            if (yi == "exit") process.exit(0)
            var y = parseInt(yi)
            return new Vec2(x,y)
        } catch(e){
            console.log(e);
        }
    }
    return new Vec2(0,0)
}



export function getNonZeroIntegerUnitVectors():Array<Vec3> {
    var f = []
    for(var x of [-1,0,1]) for(var y of [-1,0,1]) for(var z of [-1,0,1]) if (!(x == 0 && y == 0 && z == 0)) f.push(new Vec3(x,y,z)) 
    return f
}
