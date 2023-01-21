class Woodcutting extends DefaultSkillable {
    // The GameObject to cut down.
    private treeObject: GameObject;
    // The treeObject as an enumerated type which contains information about it, such as required level.
    private tree: Tree;
    // The axe we're using to cut down the tree.
    private axe: Axe | undefined;

    constructor(treeObject: GameObject, tree: Tree) {
        super();
        this.treeObject = treeObject;
        this.tree = tree;
    }

    public start(player: Player) {
        player.getPacketSender().sendMessage("You swing your axe at the tree..");
        super.start(player);
    }

    public startAnimationLoop(player: Player) {
        const animLoop = new Task(4, player, true, () => {
            Sounds.sendSound(player, Sound.WOODCUTTING_CHOP);
            player.performAnimation(this.axe.getAnimation());
        });
        TaskManager.submit(animLoop);
        this.getTasks().add(animLoop);

        const soundLoop = new Task(2, player, false, () => {
            Sounds.sendSound(player, Sound.WOODCUTTING_CHOP);
        });
        TaskManager.submit(soundLoop);
        this.getTasks().add(soundLoop);
    }

    public onCycle(player: Player) {
        PetHandler.onSkill(player, Skill.WOODCUTTING);
    }

    public finishedCycle(player: Player) {
        //Add logs..
        player.getInventory().add(this.tree.getLogId(), 1);
        player.getPacketSender().sendMessage("You get some logs.");
        //Add exp..
        player.getSkillManager().addExperience(Skill.WOODCUTTING, this.tree.getXpReward());
        //The chance of getting a bird nest from a tree is 1/256 each time you would normally get a log, regardless of the type of tree.
        if (Misc.getRandom(NEST_DROP_CHANCE) == 1) {
            handleDropNest(player);
        }
        //Regular trees should always despawn.
        //Multi trees are random.
        if (!this.tree.isMulti() || Misc.getRandom(15) >= 2) {
            //Stop skilling...
            this.cancel(player);

            //Despawn object and respawn it after a short period of time...
            TaskManager.submit(new TimedObjectReplacementTask(this.treeObject, new GameObject(1343, this.treeObject.getLocation(), 10, 0, player.getPrivateArea()), this.tree.getRespawnTimer()));
        }
    }

    function cyclesRequired(player: Player): number {
    let cycles = tree.getCycles() + Misc.getRandom(4);
    cycles -= player.getSkillManager().getMaxLevel(Skill.WOODCUTTING) * 0.1;
    cycles -= cycles * axe.get().getSpeed();
    return Math.max(3, (int) cycles);
}

hasRequirements(player: Player): boolean {
    //Attempt to find an axe..
    axe = Optional.empty();
    for (let a of Axe.values()) {
        if (player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId() == a.getId()
            || player.getInventory().contains(a.getId())) {

            //If we have already found an axe,
            //don't select others that are worse or can't be used
            if (axe.isPresent()) {
                if (player.getSkillManager().getMaxLevel(Skill.WOODCUTTING) < a.getRequiredLevel()) {
                    continue;
                }
                if (a.getRequiredLevel() < axe.get().getRequiredLevel()) {
                    continue;
                }
            }

            axe = Optional.of(a);
        }
    }

    //Check if we found one..
    if (!axe.isPresent()) {
        player.getPacketSender().sendMessage("You don't have an axe which you can use.");
        return false;
    }

    //Check if we have the required level to cut down this {@code tree} using the {@link Axe} we found..
    if (player.getSkillManager().getCurrentLevel(Skill.WOODCUTTING) < axe.get().getRequiredLevel()) {
        player.getPacketSender().sendMessage("You don't have an axe which you have the required Woodcutting level to use.");
        return false;
    }

    //Check if we have the required level to cut down this {@code tree}..
    if (player.getSkillManager().getCurrentLevel(Skill.WOODCUTTING) < tree.getRequiredLevel()) {
        player.getPacketSender().sendMessage("You need a Woodcutting level of at least " + tree.getRequiredLevel() + " to cut this tree.");
        return false;
    }

    //Finally, check if the tree object remains there.
    //Another player may have cut it down already.
    if (!MapObjects.exists(treeObject)) {
        return false;
    }

    return super.hasRequirements(player);
}

    public loopRequirements(): boolean {
    return true;
}

        public allowFullInventory(): boolean {
    return false;
}
        
        public getTreeObject(): GameObject {
    return this.treeObject;
}

//TODO: Continuar daqui 
