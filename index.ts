import { getVec2, getNonZeroIntegerUnitVectors } from "./helper";

const rowLength:number = 4;

export enum EGridElement {
    Empty,
    PlayerA,
    PlayerB
}


export class Vec3{
    public x:number;
    public y:number;
    public z:number;
    
    constructor(x:number,y:number,z:number){
        this.x = x;
        this.y = y;
        this.z = z;
        
    }

    public add(v:Vec3){
        this.x+=v.x
        this.y+=v.y
        this.z+=v.z
        return this
    }
    public invert(){
        this.x*=-1
        this.y*=-1
        this.z*=-1
        return this
    }
    public clone(){
        return new Vec3(this.x,this.y,this.z)
    }
    public compare(v:Vec3){
        return (v.x == this.x && v.y==this.y && v.z==this.z)
    }

}

export class Vec2{
    public x:number;
    public y:number;
    
    constructor(x:number,y:number){
        this.x = x;
        this.y = y;
        
    }
}

export type Grid = Array<Array<Array<EGridElement>>>

export function generate3DArray(size:Vec3):Grid{
    var grid:Grid = []
    for (let x = 0; x < size.x; x++) {
        var vslice = []
        for (let y = 0; y < size.y; y++) {
            var hcolumn = []
            for (let z = 0; z < size.z; z++) {
                hcolumn.push(EGridElement.Empty)
            }
            vslice.push(hcolumn)
        }
        grid.push(vslice)
    }
    return grid
}



export class Field {
    
    public size:Vec3
    public grid:Grid
    public winner:EGridElement = EGridElement.Empty

    constructor(size:Vec3){
        this.size = size
        this.grid = generate3DArray(size);
    }

    public get(p:Vec3){
        try {
            return this.grid[p.x][p.y][p.z]
        } catch (e) {
            //console.log(`Unable to read from x:${p.x} y:${p.y} z:${p.z}`);
            return undefined
        }
    }
    public set(p:Vec3,e:EGridElement){
        try {
            this.grid[p.x][p.y][p.z] = e
        } catch (e) {
            console.log(`Unable to write to x:${p.x} y:${p.y} z:${p.z}`);
            
        }
    }


    public place(position:Vec2,player:EGridElement):boolean {
        var cursor = new Vec3(position.x,position.y,0)
        while (cursor.z < this.size.z) {
            if (this.get(cursor) == EGridElement.Empty){
                this.set(cursor,player)
                if (this.findRow(cursor)) {
                    this.winner = player
                }
                return true
            }
            cursor.z++;
        }
        return false
    }

    public doManualTurn(player:EGridElement){
        var position:Vec2 = new Vec2(0,0)
        while(1){
            console.log("Enter a Position.");
            position = getVec2()
            position.x -= 1
            position.y -= 1
            if (position.x >= 0 && position.x < this.size.x && position.y >= 0 && position.y < this.size.y){
                if (this.place(position,player)) {
                    break
                } else {
                    console.log("This column is already filled up. Try again.");
                }
            } else {
                console.log("This position is not in the valid range. Try again.");
            }
        }

    }

    public doMinimaxTurn(player:EGridElement){
        
    }

    public log(){
        var out:string = ""
        for (let z = 0; z < this.size.z; z++) {
            var outl = `Layer: ${z}\n`
            var ipf = false
            for (let y = 0; y < this.size.y; y++) {
                for (let x = 0; x < this.size.x; x++) {
                    var c = " "
                    if (this.grid[x][y][z] == EGridElement.PlayerA) c = "A"
                    if (this.grid[x][y][z] == EGridElement.PlayerB) c = "B"
                    if (c != " ") ipf = true
                    outl += c
                }
                outl += "\n"
            }
            if (ipf) out += outl
        }
        console.log(out);
        
    }

    public findRow(n:Vec3):boolean{
        var directions = getNonZeroIntegerUnitVectors()
        var player = this.get(n)
        var lens:Array<[Vec3,number]> = []
        for (const d of directions) {
            var cursor = n.clone()
            var len = 0
            while (this.get(cursor) == player){
                cursor.add(d)
                len++
            }
            len -= 1
            lens.push([d,len])
        }
        
        var lentotals = []
        while (lens.length != 0){
            var e = lens.pop()
            if (!e) {
                console.error("sdasdsa")
                return false
            }
            var fkey = e[0].clone().invert()
            var f = null;
            
            f = lens.find((e,i) => {
                if (e[0].compare(fkey)){
                    lens = lens.splice(i)
                    return true
                }
                return 
            })
            if (!f) {
                continue
            }
            
            var lentotal = f[1] + e[1] + 1
            if (lentotal >= rowLength) return true
            lentotals.push(lentotal)
        }
        

        return false
    }

    private win() {
        var ch = "?"
        if(this.winner == EGridElement.PlayerA) ch = "A";
        if(this.winner == EGridElement.PlayerB) ch = "B";
        console.log(`SPIELER ${ch} HAT GEWONNEN!`)
        process.exit(0)
    }

    public loop() {
        while (1){
            console.clear()
            this.log()
            this.doManualTurn(EGridElement.PlayerA)
            if (this.winner != EGridElement.Empty) return this.win()
            console.clear()
            this.log()
            this.doManualTurn(EGridElement.PlayerB)
            if (this.winner != EGridElement.Empty) return this.win()
        }
    }
    
}

export function runGame(){
    var gf = new Field(new Vec3(4,4,4))
    gf.loop()
}

runGame()