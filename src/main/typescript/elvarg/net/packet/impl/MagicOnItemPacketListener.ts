import { EffectSpell } from '../../content/combat/magic/EffectSpells';
import { Animation, Graphic, GraphicHeight, Skill } from '../../model/';
import { Player } from '../../entity/impl/player';
import { Packet } from '../../net/packet';
import { PacketConstants } from '../PacketConstants';

export class MagicOnItemPacketListener {

    public execute(player: Player, packet: Packet) {
        switch (packet.getOpcode()) {
            case PacketConstants.MAGIC_ON_ITEM_OPCODE:
                let slot = packet.readShort();
                let itemId = packet.readShortA();
                let childId = packet.readShort();
                let spellId = packet.readShortA();
                if (!player.getClickDelay().elapsed(1300)) return;
                if (slot < 0 || slot >= player.getInventory().capacity()) return;
                if (player.getInventory().getItems()[slot].getId() != itemId) return;
                let spell = EffectSpell.forSpellId(spellId);
                if (!spell.isPresent()) {
                    return;
                }
                let item = player.getInventory().getItems()[slot];
                switch (spell.get()) {
                    case EffectSpell.LOW_ALCHEMY:
                    case EffectSpell.HIGH_ALCHEMY:
                        if (!item.getDefinition().isTradeable() || !item.getDefinition().isSellable() || item.getId() == 995
                                || item.getDefinition().getHighAlchValue() <= 0 || item.getDefinition().getLowAlchValue() <= 0) {
                            player.getPacketSender().sendMessage("This spell can not be cast on this item.");
                            return;
                        }
                        if (!spell.get().getSpell().canCast(player, true)) {
                            return;
                        }
                        player.getInventory().delete(itemId, 1);
                        player.performAnimation(new Animation(712));
                        if (spell.get() == EffectSpell.LOW_ALCHEMY) {
                            player.getInventory().add(995, item.getDefinition().getLowAlchValue());
                        } else {
                            player.getInventory().add(995, item.getDefinition().getHighAlchValue());
                        }
                        player.performGraphic(new Graphic(112, GraphicHeight.HIGH));
                        player.getSkillManager().addExperience(Skill.MAGIC, spell.get().getSpell().baseExperience());
                        player.getPacketSender().sendTab(6);
                        break;
                    default:
                        break;
                }
        }
    }
}
