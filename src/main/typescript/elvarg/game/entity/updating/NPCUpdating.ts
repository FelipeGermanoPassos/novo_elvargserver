<<<<<<< HEAD
package com.elvarg.game.entity.updating;

import com.elvarg.game.World;
import * as World from '../../../game/Worlds';
import com.elvarg.game.entity.impl.Mobile;
import * as Mobile from '../../entity/impl/Mobile';
import com.elvarg.game.entity.impl.npc.NPC;
import * as NPC from '../../entity/impl/npc/NPC';
import com.elvarg.game.entity.impl.player.Player;
import * as Player from '../../entity/impl/player/Player';
import com.elvarg.game.model.Flag;
import * as Flag from '../../model/Flag';
import com.elvarg.game.model.Location;
import * as Location from '../../model/Location';
import com.elvarg.game.model.UpdateFlag;
import * as UpdateFlag from '../../model/UpdateFlag';
import com.elvarg.game.model.areas.AreaManager;
import * as AreaManager from '../../model/areas/AreaManager';
import com.elvarg.net.packet.ByteOrder;

import com.elvarg.net.packet.PacketBuilder;
import com.elvarg.net.packet.PacketType;
import com.elvarg.net.packet.PacketBuilder.AccessType;
import com.elvarg.net.packet.ValueType;

import java.util.Iterator;

/**
 * Represents a player's npc updating task, which loops through all local
 * npcs and updates their masks according to their current attributes.
 *
 * @author Relex lawl
 */

public class NPCUpdating {

    /**
     * Handles the actual npc updating for the associated player.
     *
     * @return The NPCUpdating instance.
     */
    public static update(player: Player ): void {
        PacketBuilder update = new PacketBuilder();
        PacketBuilder packet = new PacketBuilder(65, PacketType.VARIABLE_SHORT);
        packet.initializeAccess(AccessType.BIT);
        packet.putBits(8, player.getLocalNpcs().size());
        for (Iterator<NPC> npcIterator = player.getLocalNpcs().iterator(); npcIterator.hasNext(); ) {
            npc: NPC = npcIterator.next();
            if (World.getNpcs().get(npc.getIndex()) != null 
                    && npc.isVisible() 
                    && player.getLocation().isViewableFrom(npc.getLocation()) 
                    && !npc.isNeedsPlacement()
                    && npc.getPrivateArea() == player.getPrivateArea()) {
                updateMovement(npc, packet);
                if (npc.getUpdateFlag().isUpdateRequired()) {
                    appendUpdates(npc, update);
=======
<<<<<<< Updated upstream
=======
import World from '../../Worlds'
import Mobile from '../impl/Mobile'
import NPC from '../impl/npc/NPC'
import Player from '../impl/player/Player'
import Flag from '../../model/Flag'
import Location from '../../model/Location'
import UpdateFlag from '../../model/Update'
import AreaManager from '../../model/areas/AreaManager'


export class NPCUpdating {
    public static update(player: Player): void {
        let update = new PacketBuilder();
        let packet = new PacketBuilder(65, PacketType.VARIABLE_SHORT);
        packet.initializeAccess(AccessType.BIT);
        packet.putBits(8, player.getLocalNpcs().size());
        for (let npcIterator of player.getLocalNpcs()) {
            let npc = npcIterator;
            if (World.getNpcs().get(npc.getIndex()) != null
                && npc.isVisible()
                && player.getLocation().isViewableFrom(npc.getLocation())
                && !npc.isNeedsPlacement()
                && npc.getPrivateArea() == player.getPrivateArea()) {
                NPCUpdating.updateMovement(npc, packet);
                if (npc.getUpdateFlag().isUpdateRequired()) {
                    NPCUpdating.appendUpdates(npc, update);
>>>>>>> 7052ca7d0e28eadf12625750f1d5d94c3ea0d2aa
                }
            } else {
                npcIterator.remove();
                packet.putBits(1, 1);
                packet.putBits(2, 3);
            }
        }
<<<<<<< HEAD
        for (NPC npc : World.getNpcs()) {
            if (player.getLocalNpcs().size() >= 79) //Originally 255
                break;
            if (npc == null || player.getLocalNpcs().contains(npc) || !npc.isVisible() || npc.isNeedsPlacement()
                    || npc.getPrivateArea() != player.getPrivateArea())
=======
        for (let npc of World.getNpcs()) {
            if (player.getLocalNpcs().size() >= 79) //Originally 255
                break;
            if (npc == null || player.getLocalNpcs().contains(npc) || !npc.isVisible() || npc.isNeedsPlacement()
                || npc.getPrivateArea() != player.getPrivateArea())
>>>>>>> 7052ca7d0e28eadf12625750f1d5d94c3ea0d2aa
                continue;
            if (npc.getLocation().isViewableFrom(player.getLocation())) {
                player.getLocalNpcs().add(npc);
                addNPC(player, npc, packet);
                if (npc.getUpdateFlag().isUpdateRequired()) {
                    appendUpdates(npc, update);
                }
            }
        }
        if (update.buffer().writerIndex() > 0) {
            packet.putBits(14, 16383);

            packet.initializeAccess(AccessType.BYTE);
            packet.writeBuffer(update.buffer());
        } else {
            packet.initializeAccess(AccessType.BYTE);
        }
        player.getSession().write(packet);
    }
<<<<<<< HEAD

    /**
     * Adds an npc to the associated player's client.
     *
     * @param npc     The npc to add.
     * @param builder The packet builder to write information on.
     * @return The NPCUpdating instance.
     */
    private static addNPC(player:Player ,npc: NPC , builder: PacketBuilder): void {
=======
    private static addNPC(player: Player, npc: NPC, builder: PacketBuilder) {
>>>>>>> 7052ca7d0e28eadf12625750f1d5d94c3ea0d2aa
        builder.putBits(14, npc.getIndex());
        builder.putBits(5, npc.getLocation().getY() - player.getLocation().getY());
        builder.putBits(5, npc.getLocation().getX() - player.getLocation().getX());
        builder.putBits(1, 0);
        builder.putBits(14, npc.getId());
        builder.putBits(1, npc.getUpdateFlag().isUpdateRequired() ? 1 : 0);
    }

<<<<<<< HEAD
    /**
     * Updates the npc's movement queue.
     *
     * @param npc     The npc who's movement is updated.
     * @param builder The packet builder to write information on.
     * @return The NPCUpdating instance.
     */
    private static updateMovement(npc:NPC ,out: PacketBuilder ): void {
=======
    private static updateMovement(npc: NPC, out: PacketBuilder) {
>>>>>>> 7052ca7d0e28eadf12625750f1d5d94c3ea0d2aa
        if (npc.getRunningDirection().getId() == -1) {
            if (npc.getWalkingDirection().getId() == -1) {
                if (npc.getUpdateFlag().isUpdateRequired()) {
                    out.putBits(1, 1);
                    out.putBits(2, 0);
                } else {
                    out.putBits(1, 0);
                }
            } else {
                out.putBits(1, 1);
                out.putBits(2, 1);
                out.putBits(3, npc.getWalkingDirection().getId());
                out.putBits(1, npc.getUpdateFlag().isUpdateRequired() ? 1 : 0);
            }
        } else {
            out.putBits(1, 1);
            out.putBits(2, 2);
            out.putBits(3, npc.getWalkingDirection().getId());
            out.putBits(3, npc.getRunningDirection().getId());
            out.putBits(1, npc.getUpdateFlag().isUpdateRequired() ? 1 : 0);
        }
    }
<<<<<<< HEAD

    /**
     * Appends a mask update for {@code npc}.
     *
     * @param npc     The npc to update masks for.
     * @param builder The packet builder to write information on.
     * @return The NPCUpdating instance.
     */
    private static  appendUpdates(npc:NPC , block: PacketBuilder):void {
        int mask = 0;
        UpdateFlag flag = npc.getUpdateFlag();
=======
    private static appendUpdates(npc: NPC, block: PacketBuilder) {
        let mask = 0;
        let flag = npc.getUpdateFlag();
>>>>>>> 7052ca7d0e28eadf12625750f1d5d94c3ea0d2aa
        if (flag.flagged(Flag.ANIMATION) && npc.getAnimation() != null) {
            mask |= 0x10;
        }
        if (flag.flagged(Flag.GRAPHIC) && npc.getGraphic() != null) {
            mask |= 0x80;
        }
        if (flag.flagged(Flag.SINGLE_HIT)) {
            mask |= 0x8;
        }
        if (flag.flagged(Flag.ENTITY_INTERACTION)) {
            mask |= 0x20;
        }
        if (flag.flagged(Flag.FORCED_CHAT) && npc.getForcedChat() != null) {
            mask |= 0x1;
        }
        if (flag.flagged(Flag.DOUBLE_HIT)) {
            mask |= 0x40;
        }
        if (flag.flagged(Flag.APPEARANCE) && npc.getNpcTransformationId() != -1) {
            mask |= 0x2;
        }
        if (flag.flagged(Flag.FACE_POSITION) && npc.getPositionToFace() != null) {
            mask |= 0x4;
        }
        block.put(mask);
        if (flag.flagged(Flag.ANIMATION) && npc.getAnimation() != null) {
            updateAnimation(block, npc);
        }
        if (flag.flagged(Flag.GRAPHIC) && npc.getGraphic() != null) {
            updateGraphics(block, npc);
        }
        if (flag.flagged(Flag.SINGLE_HIT)) {
            updateSingleHit(block, npc);
        }
        if (flag.flagged(Flag.ENTITY_INTERACTION)) {
<<<<<<< HEAD
            Mobile entity = npc.getInteractingMobile();
=======
            let entity = npc.getInteractingMobile();
>>>>>>> 7052ca7d0e28eadf12625750f1d5d94c3ea0d2aa
            block.putShort(entity == null ? -1 : entity.getIndex() + (entity instanceof Player ? 32768 : 0));
        }
        if (flag.flagged(Flag.FORCED_CHAT) && npc.getForcedChat() != null) {
            block.putString(npc.getForcedChat());
        }
        if (flag.flagged(Flag.DOUBLE_HIT)) {
            updateDoubleHit(block, npc);
        }
        if (flag.flagged(Flag.APPEARANCE)) {
<<<<<<< HEAD
            boolean transform = npc.getNpcTransformationId() != -1;
=======
            let transform = npc.getNpcTransformationId() != -1;
>>>>>>> 7052ca7d0e28eadf12625750f1d5d94c3ea0d2aa

            //Changes the npc's headicon.
            block.put(npc.getHeadIcon());

            //Should we transform the npc into anotehr npc?
            block.put(transform ? 1 : 0);

            //Transforms the npc into another npc.
            if (transform) {
                block.putShort(npc.getNpcTransformationId(), ValueType.A, ByteOrder.LITTLE);
            }
        }
<<<<<<< HEAD
        if (flag.flagged(Flag.FACE_POSITION) && npc.getPositionToFace() != null) {
            final Location position = npc.getPositionToFace();
=======
        if (npc.getUpdateFlag().flagged(Flag.FACE_POSITION) && npc.getPositionToFace() != null) {
            const position = npc.getPositionToFace();
>>>>>>> 7052ca7d0e28eadf12625750f1d5d94c3ea0d2aa
            block.putShort(position.getX() * 2 + 1, ByteOrder.LITTLE);
            block.putShort(position.getY() * 2 + 1, ByteOrder.LITTLE);
        }
    }
<<<<<<< HEAD

    /**
     * Updates {@code npc}'s current animation and displays it for all local players.
     *
     * @param builder The packet builder to write information on.
     * @param npc     The npc to update animation for.
     * @return The NPCUpdating instance.
     */
    private static void updateAnimation(PacketBuilder builder, NPC npc) {
=======
    private static updateAnimation(builder: PacketBuilder, npc: NPC) {
>>>>>>> 7052ca7d0e28eadf12625750f1d5d94c3ea0d2aa
        builder.putShort(npc.getAnimation().getId(), ByteOrder.LITTLE);
        builder.put(npc.getAnimation().getDelay());
    }

    /**
     * Updates {@code npc}'s current graphics and displays it for all local players.
     *
     * @param builder The packet builder to write information on.
     * @param npc     The npc to update graphics for.
     * @return The NPCUpdating instance.
     */
<<<<<<< HEAD
    private static void updateGraphics(PacketBuilder builder, NPC npc) {
        builder.putShort(npc.getGraphic().getId());
        builder.putInt(((npc.getGraphic().getHeight().ordinal() * 50) << 16) + (npc.getGraphic().getDelay() & 0xffff));
    }

    /**
     * Updates the npc's single hit.
     *
     * @param builder The packet builder to write information on.
     * @param npc     The npc to update the single hit for.
     * @return The NPCUpdating instance.
     */
    private static void updateSingleHit(PacketBuilder builder, NPC npc) {
=======
    private static updateGraphics(builder: PacketBuilder, npc: NPC) {
        builder.putShort(npc.getGraphic().getId());
        builder.putInt(((npc.getGraphic().getHeight().ordinal() * 50) << 16) + (npc.getGraphic().getDelay() & 0xffff));
    }
    private static updateSingleHit(builder: PacketBuilder, npc: NPC) {
>>>>>>> 7052ca7d0e28eadf12625750f1d5d94c3ea0d2aa
        builder.putShort(npc.getPrimaryHit().getDamage());
        builder.put(npc.getPrimaryHit().getHitmask().ordinal());
        builder.putShort(npc.getHitpoints());
        builder.putShort(npc.getDefinition().getHitpoints());
<<<<<<< HEAD

    }

    /**
     * Updates the npc's double hit.
     *
     * @param builder The packet builder to write information on.
     * @param npc     The npc to update the double hit for.
     * @return The NPCUpdating instance.
     */
    private static void updateDoubleHit(PacketBuilder builder, NPC npc) {
=======
    }

    private static updateDoubleHit(builder: PacketBuilder, npc: NPC) {
>>>>>>> 7052ca7d0e28eadf12625750f1d5d94c3ea0d2aa
        builder.putShort(npc.getSecondaryHit().getDamage());
        builder.put(npc.getSecondaryHit().getHitmask().ordinal());
        builder.putShort(npc.getHitpoints());
        builder.putShort(npc.getDefinition().getHitpoints());
    }
}
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
>>>>>>> 7052ca7d0e28eadf12625750f1d5d94c3ea0d2aa
