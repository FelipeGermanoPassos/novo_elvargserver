export class ObjectDefinition extends ObjectIdentifiers {
    static OBELISK_IDS = [14829, 14830, 14827, 14828, 14826, 14831];
    static lowMemory: boolean;
    static stream: Buffer;
    static streamIndices: number[];
    static cacheIndex: number;
    static cache: ObjectDefinition[];
    static totalObjects: number;
    obstructsGround: boolean;
    ambientLighting: number;
    translateX: number;
    name: string;
    scaleZ: number;
    lightDiffusion: number;
    objectSizeX: number;
    translateY: number;
    minimapFunction: number;
    originalModelColors: number[];
    scaleX: number;
    varp: number;
    inverted: boolean;
    id: number;
    impenetrable: boolean;
    mapscene: number;
    childrenIDs: number[];
    supportItems: number;
    objectSizeY: number;
    contouredGround: boolean;
    occludes: boolean;
    removeClipping: boolean;
    solid: boolean;
    blockingMask: number;
    delayShading: boolean;
    scaleY: number;
    modelIds: number[];
    varbit: number;
    decorDisplacement: number;
    modelTypes: number[];
    description: string;
    isInteractive: boolean;
    castsShadow: boolean;
    animation: number;
    translateZ: number;
    modifiedModelColors: number[];
    interactions: string[];
    originalModelTexture: number[];
    modifiedModelTexture: number[];
    clipType: number = 2;
    
    constructor() {
        this.id = -1;
    }
    
    static dumpNames() {
        let writer = new BufferedWriter(new FileWriter("./Cache/object_names.txt"));
        for (let i = 0; i < totalObjects; i++) {
            let def = forId(i);
            let name = def == null ? "null" : def.name;
            writer.write("ID: " + i + ", name: " + name + "");
            writer.newLine();
        }
        writer.close();
    }
    isClippedDecoration(): boolean {
        return this.isInteractive || this.clipType == 1 || this.obstructsGround;
    }
    
    static forId(id: number): ObjectDefinition {
        if (id > streamIndices.length)
            id = streamIndices.length - 1;
        for (let index = 0; index < 20; index++)
            if (cache[index].id == id)
                return cache[index];

        if (id == 25913)
            id = 15552;

        if (id == 25916 || id == 25926)
            id = 15553;

        if (id == 25917)
            id = 15554;

        cacheIndex = (cacheIndex + 1) % 20;
        let objectDef = cache[cacheIndex];
        stream.offset = streamIndices[id];
        objectDef.id = id;
        objectDef.reset();
        objectDef.readValues(stream);
        if (objectDef.id > 14500) {
            if (objectDef.delayShading) {
                objectDef.delayShading = false;
            }
        }

        for (let obelisk of OBELISK_IDS) {
            if (id == obelisk) {
                objectDef.interactions = ["Activate", null, null, null, null];
            }
        }

        if (id == 29241) {
            objectDef.interactions = new Array(5);
            objectDef.interactions[0] = "Restore-stats";
        }
        if (id == 4150) {
            objectDef.name = "Bank portal";
        } else if (id == 4151) {
            objectDef.name = "Ditch portal";
        }

        if (id == 26756) {
            objectDef.name = "Information";
            objectDef.interactions = null;
        }

        if (id == 6552) {
            objectDef.interactions = ["Venerate", "Switch-normal", "Switch-ancient", "Switch-lunar", null];
            objectDef.name = "Magical altar";
        }

        if (id == 6552) {
            objectDef.interactions = ["Toggle-spells", null, null, null, null];
            objectDef.name = "Ancient altar";
        }

        if (id == 14911) {
            objectDef.interactions = ["Toggle-spells", null, null, null, null];
            objectDef.name = "Lunar altar";
        }
        if (id == 2164) {
            objectDef.isInteractive = true;
            objectDef.interactions = ["Fix", null, null, null, null];
            objectDef.name = "Trawler Net";
        }
        if (id == 1293) {
            objectDef.isInteractive = true;
            objectDef.interactions = ["Teleport", null, null, null, null];
            objectDef.name = "Spirit Tree";
        }

        if (id == 2452) {
            objectDef.isInteractive = true;
            objectDef.interactions = ["Go Through", null, null, null, null];
            objectDef.name = "Passage";
        }
        switch (id) {
            case 10638:
                objectDef.isInteractive = true;
                return objectDef;
        }

        return objectDef;
    }

    static init() {
        try {
            let dat = FileUtil.readFile(GameConstants.CLIPPING_DIRECTORY + "loc.dat");
            let idx = FileUtil.readFile(GameConstants.CLIPPING_DIRECTORY + "loc.idx");

            stream = new Buffer(dat);
            let idxBuffer525 = new Buffer(idx);

            let totalObjects525 = idxBuffer525.readUnsignedWord();
            streamIndices = new Array(totalObjects525);
            let i = 2;
            for (let j = 0; j < totalObjects525; j++) {
                streamIndices[j] = i;
                i += idxBuffer525.readUnsignedWord();
            }

            cache = new Array<ObjectDefinition>(20);
            for (let k = 0; k < 20; k++) {
                cache[k] = new ObjectDefinition();
            }

        } catch (e) {
            console.log(e);
        }
    }

    public  reset() {
        modelIds = null;
        modelTypes = null;
        name = null;
        description = null;
        modifiedModelColors = null;
        originalModelColors = null;
        modifiedModelTexture = null;
        originalModelTexture = null;
        objectSizeX = 1;
        objectSizeY = 1;
        solid = true;
        impenetrable = true;
        isInteractive = false;
        contouredGround = false;
        delayShading = false;
        occludes = false;
        animation = -1;
        decorDisplacement = 16;
        ambientLighting = 0;
        lightDiffusion = 0;
        interactions = null;
        minimapFunction = -1;
        mapscene = -1;
        inverted = false;
        castsShadow = true;
        scaleX = 128;
        scaleY = 128;
        scaleZ = 128;
        blockingMask = 0;
        translateX = 0;
        translateY = 0;
        translateZ = 0;
        obstructsGround = false;
        removeClipping = false;
        supportItems = -1;
        varbit = -1;
        varp = -1;
        childrenIDs = null;
    }

    function readValues(buffer: Buffer) {
        while(true) {
            let opcode: number = buffer.readUnsignedByte();
    
            if (opcode === 0) {
                break;
            } else if (opcode === 1) {
                let len: number = buffer.readUnsignedByte();
                if (len > 0) {
                    if (modelIds === null) {
                        modelTypes = new Array<number>(len);
                        modelIds = new Array<number>(len);
    
                        for (let i: number = 0; i < len; i++) {
                            modelIds[i] = buffer.readUShort();
                            modelTypes[i] = buffer.readUnsignedByte();
                        }
                    } else {
                        buffer.offset += len * 3;
                    }
                }
            } else if (opcode === 2) {
                name = buffer.readString();
            } else if (opcode === 5) {
                let len: number = buffer.readUnsignedByte();
                if (len > 0) {
                    if (modelIds === null) {
                        modelTypes = null;
                        modelIds = new Array<number>(len);
                        for (let i: number = 0; i < len; i++) {
                            modelIds[i] = buffer.readUShort();
                        }
                    } else {
                        buffer.offset += len * 2;
                    }
                }
            } else if (opcode === 14) {
                objectSizeX = buffer.readUnsignedByte();
            } else if (opcode === 15) {
                objectSizeY = buffer.readUnsignedByte();
            } else if (opcode === 17) {
                solid = false;
            } else if (opcode === 18) {
                impenetrable = false;
            } else if (opcode === 19) {
                isInteractive = (buffer.readUnsignedByte() === 1);
            } else if (opcode === 21) {
                contouredGround = true;
            } else if (opcode === 22) {
                delayShading = true;
            } else if (opcode === 23) {
                occludes = true;
            } else if (opcode === 24) {
                animation = buffer.readUShort();
                if (animation === 0xFFFF) {
                    animation = -1;
                }
            } else if (opcode === 27) {
                //clipType = 1;
            } else if (opcode === 28) {
                decorDisplacement = buffer.readUnsignedByte();
            } else if (opcode === 29) {
                ambientLighting = buffer.readSignedByte();
            } else if (opcode === 39) {
                lightDiffusion = buffer.readSignedByte() * 25;
            } else if (opcode >= 30 && opcode < 35) {
                if (interactions === null) {
                    interactions = new Array<string>(5);
                }
                interactions[opcode - 30] = buffer.readString();
                if (interactions[opcode - 30].toLowerCase() === "hidden") {
                    interactions[opcode - 30] = null;
                }
            } else if (opcode === 40) {
                let len: number = buffer.readUnsignedByte();
                modifiedModelColors = new Array<number>(len);
                originalModelColors = new Array<number>(len);
                for (let i: number = 0; i < len; i++) {
                    modifiedModelColors[i] = buffer.readUShort();
                    originalModelColors[i] = buffer.readUShort();
                }
            } else if (opcode === 41) {
                let len: number = buffer.readUnsignedByte();
                modifiedModelTexture = new Array<number>(len);
                originalModelTexture = new Array<number>(len);
                for (let i: number = 0; i < len; i++) {
                    modifiedModelTexture[i] = buffer.readUShort();
                    originalModelTexture[i] = buffer.readUShort();
                }
            } else if (opcode === 62) {
                inverted = true;
            } else if (opcode === 64) {
                castsShadow = false;
            } else if (opcode === 65) {
                scaleX = buffer.readUShort();
            } else if (opcode === 66) {
                scaleY = buffer.readUShort();
            } else if (opcode === 67) {
                scaleZ = buffer.readUShort();
            } else if (opcode === 68) {
                mapscene = buffer.readUShort();
            } else if (opcode === 69) {
                blockingMask = buffer.readUnsignedByte();
            } else if (opcode === 70) {
                translateX = buffer.readUShort();
            } else if (opcode === 71) {
                translateY = buffer.readUShort();
            } else if (opcode === 72) {
                translateZ = buffer.readUShort();
            } else if (opcode === 73) {
                obstructsGround = true;
            } else if (opcode === 74) {
                removeClipping = true;
            } else if (opcode === 75) {
                supportItems = buffer.readUnsignedByte();
            } else if (opcode === 78) {
                buffer.readUShort(); // ambient sound id
                buffer.readUnsignedByte();
            } else if (opcode === 79) {
                buffer.readUShort();
                buffer.readUShort();
                buffer.readUnsignedByte();
                let len: number = buffer.readUnsignedByte();

                for (let i: number = 0; i < len; i++) {
                    buffer.readUShort();
                }
            } else if (opcode === 81) {
                buffer.readUnsignedByte();
            } else if (opcode === 82) {
                minimapFunction = buffer.readUShort();

                if (minimapFunction === 0xFFFF) {
                    minimapFunction = -1;
                }
            } else if (opcode === 77 || opcode === 92) {
                varp = buffer.readUShort();

                if (varp === 0xFFFF) {
                    varp = -1;
                }

                varbit = buffer.readUShort();

                if (varbit === 0xFFFF) {
                    varbit = -1;
                }

                let value: number = -1;

                if (opcode === 92) {
                    value = buffer.readUShort();

                    if (value === 0xFFFF) {
                        value = -1;
                    }
                }

                let len: number = buffer.readUnsignedByte();

                childrenIDs = new Array<number>(len + 2);
                for (let i: number = 0; i <= len; ++i) {
                    childrenIDs[i] = buffer.readUShort();
                    if (childrenIDs[i] === 0xFFFF) {
                        childrenIDs[i] = -1;
                    }
                }
                childrenIDs[len + 1] = value;
            } else {
                console.log("invalid opcode: " + opcode);
            }
        }

        if (name !== null && name !== "null") {
            isInteractive = modelIds !== null && (modelTypes === null || modelTypes[0] === 10);
            if (interactions !== null)
                isInteractive = true;
        }

        if (removeClipping) {
            solid = false;
            impenetrable = false;
        }

        if (supportItems === -1) {
            supportItems = solid ? 1 : 0;
        }
    }

    public getName(): string {
        return name;
    }

    public getSizeX(): number {
        return objectSizeX;
    }

    public getSizeY(): number {
        return objectSizeY;
    }

    public hasActions(): boolean {
        return isInteractive;
    }
    
    public getSize(): number {
    	switch (id) {
    	case BARROWS_STAIRCASE_AHRIM:
    	case BARROWS_STAIRCASE_DHAROK:
    	case BARROWS_STAIRCASE_GUTHAN:
    	case BARROWS_STAIRCASE_KARIL:
    	case BARROWS_STAIRCASE_VERAC:
    		return 2;
    	case BARROWS_STAIRCASE_TORAG:
    		return 3;
    	}
    	    	
    	return (this.getSizeX() + this.getSizeY()) - 1;
    }      
}
