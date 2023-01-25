export class Mobile extends Entities {
    private index: number;
    private lastKnownRegion: Location;
    private timers = new TimerRepository();
    private combat = new Combat(this);
    private movementQueue = new MovementQueue(this);
    private forcedChat: string;
    private walkingDirection: Direction = Direction.NONE;
    private runningDirection: Direction = Direction.NONE;
    private lastCombat = new Stopwatch();
    private updateFlag = new UpdateFlag();
    private positionToFace: Location;
    private animation: Animation;
    private graphic: Graphic;
    private following: Mobile;
    
    Copy code
    private attributes = new Map<Object, Object>();
    
    public getAttribute(name: Object) {
        return this.attributes.get(name);
    }
    setAttribute(name: any, object: any) {
        this.attributes.set(name, object);
    }
    /*
     * Fields
     */
    interactingMobile: any;
    combatFollowing: any;
    npcTransformationId = -1;
    poisonDamage: number;
    prayerActive = new Array<boolean>(30);
    curseActive = new Array<boolean>(20);
    resetMovementQueue = false;
    needsPlacement = false;
    untargetable = false;
    hasVengeance = false;
    specialPercentage = 100;
    specialActivated = false;
    recoveringSpecialAttack = false;
    isTeleporting = false;
    primaryHit: any;
    secondaryHit: any;

    private registred: boolean

    constructor(position: Location) {
        super(position);
    }

    abstract onAdd(): void;

    abstract onRemove(): void;

    
    
    
    
    