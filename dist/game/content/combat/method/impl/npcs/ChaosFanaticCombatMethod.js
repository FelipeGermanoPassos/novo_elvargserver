"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChaosFanaticCombatMethod = void 0;
var CombatMethod_1 = require("../../CombatMethod");
var Graphic_1 = require("../../../../../model/Graphic");
var GraphicHeight_1 = require("../../../../../model/GraphicHeight");
var Location_1 = require("../../../../../model/Location");
var Projectile_1 = require("../../../../../model/Projectile");
var CombatType_1 = require("../../../CombatType");
var HitDamage_1 = require("../../../hit/HitDamage");
var HitMask_1 = require("../../../hit/HitMask");
var PendingHit_1 = require("../../../hit/PendingHit");
var Animation_1 = require("../../../../../model/Animation");
var Task_1 = require("../../../../../task/Task");
var TaskManager_1 = require("../../../../../task/TaskManager");
var Misc_1 = require("../../../../../../util/Misc");
var TimerKey_1 = require("../../../../../../util/timers/TimerKey");
var ChaosElementalCombatMethod_1 = require("./ChaosElementalCombatMethod");
var ChaosTask = /** @class */ (function (_super) {
    __extends(ChaosTask, _super);
    function ChaosTask(n1, execFunc, target, b) {
        var _this = _super.call(this, n1, target, b) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    ChaosTask.prototype.execute = function () {
        this.execFunc();
        this.stop();
    };
    return ChaosTask;
}(Task_1.Task));
var Attack;
(function (Attack) {
    Attack[Attack["SPECIAL_ATTACK"] = 0] = "SPECIAL_ATTACK";
    Attack[Attack["DEFAULT_MAGIC_ATTACK"] = 1] = "DEFAULT_MAGIC_ATTACK";
})(Attack || (Attack = {}));
var ChaosFanaticCombatMethod = exports.ChaosFanaticCombatMethod = /** @class */ (function (_super) {
    __extends(ChaosFanaticCombatMethod, _super);
    function ChaosFanaticCombatMethod() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.attack = Attack.DEFAULT_MAGIC_ATTACK;
        return _this;
    }
    ChaosFanaticCombatMethod.prototype.hits = function (character, target) {
        if (this.attack == Attack.SPECIAL_ATTACK) {
            return null;
        }
        return [new PendingHit_1.PendingHit(character, target, this, 2)];
    };
    ChaosFanaticCombatMethod.prototype.start = function (character, target) {
        var e_1, _a;
        if (!character.isNpc() || !target.isPlayer())
            return;
        character.performAnimation(ChaosFanaticCombatMethod.MAGIC_ATTACK_ANIM);
        this.attack = Attack.DEFAULT_MAGIC_ATTACK;
        if (Misc_1.Misc.getRandom(9) < 3) {
            this.attack = Attack.SPECIAL_ATTACK;
        }
        character.forceChat(ChaosFanaticCombatMethod.QUOTES[Misc_1.Misc.getRandom(ChaosFanaticCombatMethod.QUOTES.length - 1)]);
        if (this.attack == Attack.DEFAULT_MAGIC_ATTACK) {
            var projectile2 = Projectile_1.Projectile.createProjectile(character, target, 554, 62, 80, 31, 43);
            projectile2.sendProjectile();
            if (Misc_1.Misc.getRandom(1) == 0) {
                TaskManager_1.TaskManager.submit(new ChaosTask(3, function () { target.performGraphic(ChaosFanaticCombatMethod.ATTACK_END_GFX); }, target, false));
            }
        }
        else if (this.attack == Attack.SPECIAL_ATTACK) {
            var targetPos = target.getLocation();
            var attackPositions_2 = new Array();
            attackPositions_2.push(targetPos);
            for (var i = 0; i < 3; i++) {
                attackPositions_2.push(new Location_1.Location((targetPos.getX() - 1) + Misc_1.Misc.getRandom(3), (targetPos.getY() - 1) + Misc_1.Misc.getRandom(3)));
            }
            try {
                for (var attackPositions_1 = __values(attackPositions_2), attackPositions_1_1 = attackPositions_1.next(); !attackPositions_1_1.done; attackPositions_1_1 = attackPositions_1.next()) {
                    var pos = attackPositions_1_1.value;
                    new Projectile_1.Projectile(character.getLocation(), pos, null, 551, 40, 80, 31, 43, character.getPrivateArea())
                        .sendProjectile();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (attackPositions_1_1 && !attackPositions_1_1.done && (_a = attackPositions_1.return)) _a.call(attackPositions_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            TaskManager_1.TaskManager.submit(new ChaosTask(4, function () {
                var e_2, _a, e_3, _b;
                try {
                    for (var attackPositions_3 = __values(attackPositions_2), attackPositions_3_1 = attackPositions_3.next(); !attackPositions_3_1.done; attackPositions_3_1 = attackPositions_3.next()) {
                        var pos = attackPositions_3_1.value;
                        target.getAsPlayer().getPacketSender().sendGlobalGraphic(ChaosFanaticCombatMethod.EXPLOSION_END_GFX, pos);
                        try {
                            for (var _c = (e_3 = void 0, __values(character.getAsNpc().getPlayersWithinDistance(10))), _d = _c.next(); !_d.done; _d = _c.next()) {
                                var player = _d.value;
                                if (player.getLocation().equals(pos)) {
                                    player.getCombat().getHitQueue()
                                        .addPendingDamage([new HitDamage_1.HitDamage(Misc_1.Misc.getRandom(25), HitMask_1.HitMask.RED)]);
                                }
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (attackPositions_3_1 && !attackPositions_3_1.done && (_a = attackPositions_3.return)) _a.call(attackPositions_3);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                ChaosFanaticCombatMethod.finished(character, target);
            }));
            character.getTimers().registers(TimerKey_1.TimerKey.COMBAT_ATTACK, 5);
        }
    };
    ChaosFanaticCombatMethod.attackDistance = function (character) {
        return 8;
    };
    ChaosFanaticCombatMethod.finished = function (character, target) {
        if (Misc_1.Misc.getRandom(10) == 1) {
            if (target.isPlayer()) {
                ChaosElementalCombatMethod_1.ChaosElementalCombatMethod.disarmAttack(target.getAsPlayer());
            }
        }
    };
    ChaosFanaticCombatMethod.prototype.type = function () {
        return CombatType_1.CombatType.MAGIC;
    };
    ChaosFanaticCombatMethod.QUOTES = ["Burn!", "WEUGH!", "Develish Oxen Roll!",
        "All your wilderness are belong to them!", "AhehHeheuhHhahueHuUEehEahAH",
        "I shall call him squidgy and he shall be my squidgy!",];
    ChaosFanaticCombatMethod.ATTACK_END_GFX = new Graphic_1.Graphic(305, GraphicHeight_1.GraphicHeight.HIGH);
    ChaosFanaticCombatMethod.EXPLOSION_END_GFX = new Graphic_1.Graphic(157, GraphicHeight_1.GraphicHeight.MIDDLE);
    ChaosFanaticCombatMethod.MAGIC_ATTACK_ANIM = new Animation_1.Animation(811);
    return ChaosFanaticCombatMethod;
}(CombatMethod_1.CombatMethod));
//# sourceMappingURL=ChaosFanaticCombatMethod.js.map