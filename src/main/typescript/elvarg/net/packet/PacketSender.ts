class PacketSender {
    private player: Player;
    constructor(player: Player) {
        this.player = player;
    }
    
    public sendDetails(): PacketSender {
        let out = new PacketBuilder(249);
        out.put(1, ValueType.A);
        out.putShort(this.player.getIndex());
        this.player.getSession().write(out);
        return this;
    }
    
    public sendMapRegion(): PacketSender {
        this.player.setAllowRegionChangePacket(true);
        this.player.setLastKnownRegion(this.player.getLocation().clone());
        let out = new PacketBuilder(73);
        out.putShort(this.player.getLocation().getRegionX() + 6, ValueType.A);
        out.putShort(this.player.getLocation().getRegionY() + 6);
        this.player.getSession().write(out);
        return this;
    }

    class PacketSender {
        private player: Player;
    
        constructor(player: Player) {
            this.player = player;
        }
    
        sendLogout(): this {
            const out = new PacketBuilder(109);
            this.player.getSession().write(out);
            return this;
        }
    
        sendRegionReload(): this {
            const out = new PacketBuilder(89);
            this.player.getSession().write(out);
            return this;
        }
    
        sendSystemUpdate(time: number): this {
            const out = new PacketBuilder(114);
            out.putShort(time, ByteOrder.LITTLE);
            this.player.getSession().write(out);
            return this;
        }
    
        sendTeleportInterface(menu: number): this {
            this.player.setTeleportInterfaceOpen(true);
            const out = new PacketBuilder(183);
            out.put(menu);
            this.player.getSession().write(out);
            return this;
        }
        sendCreationMenu(menu: CreationMenu): this {
            this.player.setCreationMenu(menu);
            this.sendString(31104, menu.getTitle());
            const out = new PacketBuilder(167);
            out.put(menu.getItems().length);
            for (const itemId of menu.getItems()) {
                out.putInt(itemId);
            }
            this.player.getSession().write(out);
            return this;
        }
    
        sendSpecialAttackState(active: boolean): this {
            const out = new PacketBuilder(186);
            out.put(active ? 1 : 0);
            this.player.getSession().write(out);
            return this;
        }
    
        sendSoundEffect(soundId: number, loopType: number, delay: number, volume: number): this {
            const out = new PacketBuilder(174);
            out.putShort(soundId)
                .put(loopType)
                .putShort(delay)
                .putShort(volume);
            this.player.getSession().write(out);
            return this;
        }
    
        sendSound(soundId: number, volume: number, delay: number): this {
            const out = new PacketBuilder(175);
            out.putShort(soundId, ValueType.A, ByteOrder.LITTLE).put(volume).putShort(delay);
            this.player.getSession().write(out);
            return this;
        }
    
        sendSong(id: number): this {
            const out = new PacketBuilder(74);
            out.putShort(id, ByteOrder.LITTLE);
            this.player.getSession().write(out);
            return this;
        }
        sendAutocastId(id: number): this {
            const out = new PacketBuilder(38);
            out.putShort(id);
            this.player.getSession().write(out);
            return this;
        }
    
        sendEnableNoclip(): this {
            const out = new PacketBuilder(250);
            this.player.getSession().write(out);
            return this;
        }
    
        sendURL(url: string): this {
            const out = new PacketBuilder(251, PacketType.VARIABLE);
            out.putString(url);
            this.player.getSession().write(out);
            return this;
        }
    
        sendMessage(message: string): this {
            if (this.player instanceof PlayerBot) {
                // Bots can't read their own messages, yet ;)
                (this.player as PlayerBot).getChatInteraction().receivedGameMessage(message);
                return this;
            }
    
            const out = new PacketBuilder(253, PacketType.VARIABLE);
            out.putString(message);
            this.player.getSession().write(out);
            return this;
        }

        sendSpecialMessage(name: string, type: number, message: string): this {
            const out = new PacketBuilder(252, PacketType.VARIABLE);
            out.put(type);
            out.putString(name);
            out.putString(message);
            this.player.getSession().write(out);
            return this;
        }
    
        sendPoisonType(type: number): this {
            this.player.getSession().write(new PacketBuilder(184).put(type));
            return this;
        }
    
        sendSkill(skill: Skill): this {
            const out = new PacketBuilder(134);
            out.put(skill);
            out.putInt(this.player.getSkillManager().getCurrentLevel(skill));
            out.putInt(this.player.getSkillManager().getMaxLevel(skill));
            out.putInt(this.player.getSkillManager().getExperience(skill));
            this.player.getSession().write(out);
            return this;
        }
    
        sendExpDrop(skill: Skill, exp: number): this {
            const out = new PacketBuilder(116);
            out.put(skill);
            out.putInt(exp);
            this.player.getSession().write(out);
            return this;
        }

        sendConfig(id: number, state: number): this {
            const out = new PacketBuilder(36);
            out.putShort(id, ByteOrder.LITTLE);
            out.put(state);
            this.player.getSession().write(out);
            return this;
        }
    
        sendToggle(id: number, state: number): this {
            const out = new PacketBuilder(87);
            out.putShort(id, ByteOrder.LITTLE);
            out.putInt(state, ByteOrder.MIDDLE);
            this.player.getSession().write(out);
            return this;
        }
    
        sendChatOptions(publicChat: number, privateChat: number, tradeChat: number): this {
            const out = new PacketBuilder(206);
            out.put(publicChat).put(privateChat).put(tradeChat);
            this.player.getSession().write(out);
            return this;
        }
    
        sendRunEnergy(): this {
            const out = new PacketBuilder(110);
            out.put(this.player.getRunEnergy());
            this.player.getSession().write(out);
            return this;
        }
    
        sendQuickPrayersState(activated: boolean): this {
            const out = new PacketBuilder(111);
            out.put(activated ? 1 : 0);
            this.player.getSession().write(out);
            return this;
        }

        updateSpecialAttackOrb(): this {
            const out = new PacketBuilder(137);
            out.put(this.player.getSpecialPercentage());
            this.player.getSession().write(out);
            return this;
        }
    
        sendDungeoneeringTabIcon(show: boolean): this {
            const out = new PacketBuilder(103);
            out.put(show ? 1 : 0);
            this.player.getSession().write(out);
            return this;
        }
    
        sendHeight(): this {
            this.player.getSession().write(new PacketBuilder(86).put(this.player.getLocation().getZ()));
            return this;
        }
    
        sendIronmanMode(ironmanMode: number): this {
            const out = new PacketBuilder(112);
            out.put(ironmanMode);
            this.player.getSession().write(out);
            return this;
        }
    
        sendShowClanChatOptions(show: boolean): this {
            const out = new PacketBuilder(115);
            out.put(show ? 1 : 0); // 0 = no right click options
            this.player.getSession().write(out);
            return this;
        }
    
        sendRunStatus(): this {
            const out = new PacketBuilder(113);
            out.put(this.player.isRunning() ? 1 : 0);
            this.player.getSession().write(out);
            return this;
        }
    
        sendWeight(weight: number): this {
            const out = new PacketBuilder(240);
            out.putShort(weight);
            this.player.getSession().write(out);
            return this;
        }

        commandFrame(i: number): this {
            const out = new PacketBuilder(28);
            out.put(i);
            this.player.getSession().write(out);
            return this;
        }
    
        sendInterface(id: number): this {
            if (this.player.isPlayerBot()) {
                return this;
            }
    
            const out = new PacketBuilder(97);
            out.putShort(id);
            this.player.getSession().write(out);
            this.player.setInterfaceId(id);
            return this;
        }
    
        sendWalkableInterface(interfaceId: number): this {
            this.player.setWalkableInterfaceId(interfaceId);
            const out = new PacketBuilder(208);
            out.putInt(interfaceId);
            this.player.getSession().write(out);
            return this;
        }
    
        sendInterfaceDisplayState(interfaceId: number, hide: boolean): this {
            const out = new PacketBuilder(171);
            out.put(hide ? 1 : 0);
            out.putInt(interfaceId);
            this.player.getSession().write(out);
            return this;
        }

        public sendPlayerHeadOnInterface(id: number): PacketSender {
            const out = new PacketBuilder(185);
            out.putShort(id, ValueType.A, ByteOrder.LITTLE);
            player.getSession().write(out);
            return this;
        }
        
        public sendNpcHeadOnInterface(id: number, interfaceId: number): PacketSender {
            const out = new PacketBuilder(75);
            out.putShort(id, ValueType.A, ByteOrder.LITTLE);
            out.putShort(interfaceId, ValueType.A, ByteOrder.LITTLE);
            player.getSession().write(out);
            return this;
        }
        
        public sendEnterAmountPrompt(title: string): PacketSender {
            const out = new PacketBuilder(27, PacketType.VARIABLE);
            out.putString(title);
            player.getSession().write(out);
            return this;
        }
        
        public sendEnterInputPrompt(title: string): PacketSender {
            const out = new PacketBuilder(187, PacketType.VARIABLE);
            out.putString(title);
            player.getSession().write(out);
            return this;
        }
        
        public sendInterfaceReset(): PacketSender {
            const out = new PacketBuilder(68);
            player.getSession().write(out);
            return this;
        }
        
        public sendExit(): PacketSender {
            const out = new PacketBuilder(62);
            player.getSession().write(out);
            return this;
        }

        public sendInterfaceComponentMoval(x: number, y: number, id: number): PacketSender {
            const out = new PacketBuilder(70);
            out.putShort(x);
            out.putShort(y);
            out.putShort(id, ByteOrder.LITTLE);
            player.getSession().write(out);
            return this;
        }
        

        public sendInterfaceAnimation(interfaceId: number, animationId: number) {
            const out = new PacketBuilder(200);
            out.putShort(interfaceId);
            out.putShort(animationId);
            player.getSession().write(out);
            return this;
        }
        
        public sendInterfaceModel(interfaceId: number, itemId: number, zoom: number) {
            const out = new PacketBuilder(246);
            out.putShort(interfaceId, ByteOrder.LITTLE);
            out.putShort(zoom).putShort(itemId);
            player.getSession().write(out);
            return this;
        }
        
        public sendWidgetModel(widget: number, model: number) {
            const out = new PacketBuilder(8);
            out.putShort(widget);
            out.putShort(model);
            player.getSession().write(out);
            return this;
        }
        
        public sendTabInterface(tabId: number, interfaceId: number) {
            const out = new PacketBuilder(71);
            out.putShort(interfaceId);
            out.put(tabId, ValueType.A);
            player.getSession().write(out);
            return this;
        }
        
        public sendTabs() {
            for (let tab = 0; tab < GameConstants.TAB_INTERFACES.length; tab++) {
                let interface_ = GameConstants.TAB_INTERFACES[tab];
        
                if (tab === 6) {
                    interface_ = player.getSpellbook().getInterfaceId();
                }
        
                this.sendTabInterface(tab, interface_);
            }
            return this;
        }

        public sendTab(id: number): PacketSender {
            let out = new PacketBuilder(106);
            out.put(id, ValueType.C);
            player.getSession().write(out);
            return this;
        }
    
        public sendFlashingSidebar(id: number): PacketSender {
            let out = new PacketBuilder(24);
            out.put(id, ValueType.S);
            player.getSession().write(out);
            return this;
        }
    
        public sendChatboxInterface(id: number): PacketSender {
            let out = new PacketBuilder(164);
            out.putShort(id, ByteOrder.LITTLE);
            player.getSession().write(out);
            return this;
        }
    
        public sendMapState(state: number): PacketSender {
            let out = new PacketBuilder(99);
            out.put(state);
            player.getSession().write(out);
            return this;
        }
    
        public sendCameraAngle(x: number, y: number, level: number, speed: number, angle: number): PacketSender {
            let out = new PacketBuilder(177);
            out.put(x / 64);
            out.put(y / 64);
            out.putShort(level);
            out.put(speed);
            out.put(angle);
            player.getSession().write(out);
            return this;
        }

        public sendCameraShake(verticalAmount: number, verticalSpeed: number, horizontalAmount: number, horizontalSpeed: number): PacketSender {
            const out = new PacketBuilder(35);
            out.put(verticalAmount);
            out.put(verticalSpeed);
            out.put(horizontalAmount);
            out.put(horizontalSpeed);
            player.getSession().write(out);
            return this;
          }
          
          public sendCameraSpin(x: number, y: number, z: number, speed: number, angle: number): PacketSender {
            const out = new PacketBuilder(166);
            out.put(x / 64);
            out.put(y / 64);
            out.putShort(z);
            out.put(speed);
            out.put(angle);
            player.getSession().write(out);
            return this;
          }
          
          public sendCameraNeutrality(): PacketSender {
            const out = new PacketBuilder(107);
            player.getSession().write(out);
            return this;
          }
        
          public sendInterfaceRemoval(): PacketSender {
            if (player.getStatus() === PlayerStatus.BANKING) {
                if (player.isSearchingBank()) {
                    Bank.exitSearch(player, false);
                }
            } else if (player.getStatus() === PlayerStatus.PRICE_CHECKING) {
                player.getPriceChecker().withdrawAll();
            } else if (player.getStatus() === PlayerStatus.TRADING) {
                player.getTrading().closeTrade();
            } else if (player.getStatus() === PlayerStatus.DUELING) {
                if (!player.getDueling().inDuel()) {
                    player.getDueling().closeDuel();
                }
            }
        
            player.setStatus(PlayerStatus.NONE);
            player.setEnteredAmountAction(null);
            player.setEnteredSyntaxAction(null);
            player.getDialogueManager().reset();
            player.setShop(null);
            player.setDestroyItem(-1);
            player.setInterfaceId(-1);
            player.setSearchingBank(false);
            player.setTeleportInterfaceOpen(false);
            player.getAppearance().setCanChangeAppearance(false);
            player.getSession().write(new PacketBuilder(219));
            return this;
        }
        
        public sendInterfaceScrollReset(interfaceId: number): PacketSender {
            let out = new PacketBuilder(9);
            out.putInt(interfaceId);
            player.getSession().write(out);
            return this;
        }
        
        public sendScrollbarHeight(interfaceId: number, scrollMax: number): PacketSender {
            let out = new PacketBuilder(10);
            out.putInt(interfaceId);
            out.putShort(scrollMax);
            player.getSession().write(out);
            return this;
        }

        public sendInterfaceSet(interfaceId: number, sidebarInterfaceId: number) {
            let out = new PacketBuilder(248);
            out.putShort(interfaceId, ValueType.A);
            out.putShort(sidebarInterfaceId);
            player.getSession().write(out);
            player.setInterfaceId(interfaceId);
            return this;
        }
    
    public sendItemContainer(container: ItemContainer, interfaceId: number) {
            let out = new PacketBuilder(53, PacketType.VARIABLE_SHORT);
    
            out.putInt(interfaceId);
            out.putShort(container.capacity());
            for (let item of container.getItems()) {
                if (item == null || item.getId() <= 0 || item.getAmount() <= 0 && !(container instanceof Bank)) {
                    out.putInt(-1);
                    continue;
                }
                out.putInt(item.getAmount());
                out.putShort(item.getId() + 1);
            }
    
            player.getSession().write(out);
            return this;
        }
    
    public sendCurrentBankTab(current_tab: number) {
            let out = new PacketBuilder(55);
            out.put(current_tab);
            player.getSession().write(out);
            return this;
        }
    
    public sendEffectTimer(delay: number, e: EffectTimer) {
        let out = new PacketBuilder(54);
        out.putShort(delay);
        out.putShort(e.getClientSprite());
        player.getSession().write(out);
        return this;
    }
    

            public sendInterfaceItems(interfaceId: number, items: Array<Item>) {
                if (player.isPlayerBot()) {
                    return this;
                }
            
                let out = new PacketBuilder(53, PacketType.VARIABLE_SHORT);
                out.putInt(interfaceId);
                out.putShort(items.length);
                for (let item of items) {
                    if (item == null) {
                        out.putInt(-1);
                        continue;
                    }
                    out.putInt(item.getAmount());
                    out.putShort(item.getId() + 1);
                }
                player.getSession().write(out);
                return this;
            }
            
            public sendItemOnInterface(interfaceId: number, item: number, amount: number) {
                let out = new PacketBuilder(53, PacketType.VARIABLE_SHORT);
                out.putInt(interfaceId);
                out.putShort(1);
                out.putInt(amount);
                out.putShort(item + 1);
                player.getSession().write(out);
                return this;
            }
            
            public sendItemOnInterface(frame: number, item: number, slot: number, amount: number) {
                let out = new PacketBuilder(34, PacketType.VARIABLE_SHORT);
                out.putShort(frame);
                out.put(slot);
                out.putInt(amount);
                out.putShort(item + 1);
                player.getSession().write(out);
                return this;
            }

            public clearItemOnInterface(frame: number): PacketSender {
                const out = new PacketBuilder(72);
                out.putShort(frame);
                player.getSession().write(out);
                return this;
            }
        
            public sendSmithingData(id: number, slot: number, interfaceId: number, amount: number): PacketSender {
                const out = new PacketBuilder(34, PacketType.VARIABLE_SHORT);
                out.putShort(interfaceId);
                out.put(slot);
                out.putInt(amount);
                out.putShort(id + 1);
                out.put(amount);
                player.getSession().write(out);
                return this;
            }
        
            public sendInteractionOption(option: string, slot: number, top: boolean): PacketSender {
                const out = new PacketBuilder(104, PacketType.VARIABLE);
                out.put(slot, ValueType.C);
                out.put(top ? 1 : 0, ValueType.A);
                out.putString(option);
                player.getSession().write(out);
                const interactingOption = PlayerInteractingOption.forName(option);
                if (option != null)
                    player.setPlayerInteractingOption(interactingOption);
                return this;
            }
        
            public sendString(id: number, string: string): PacketSender {
                if (!player.getFrameUpdater().shouldUpdate(string, id)) {
                    return this;
                }
                const out = new PacketBuilder(126, PacketType.VARIABLE_SHORT);
                out.putString(string);
                out.putInt(id);
                player.getSession().write(out);
                return this;
            }
        
            public clearInterfaceText(start: number, end: number): PacketSender {
                for (let i = start; i <= end; i++) {
                    player.getFrameUpdater().interfaceTextMap.remove(i);
                }
                const out = new PacketBuilder(105);
                out.putInt(start);
                out.putInt(end);
                player.getSession().write(out);
                return this;
            }

            
            public sendRights() {
                const out = new PacketBuilder(127);
                out.put(player.getRights().ordinal());
                out.put(player.getDonatorRights().ordinal());
                player.getSession().write(out);
                return this;
            }
            
            public sendPositionalHint(position: Location, tilePosition: number) {
                const out = new PacketBuilder(254);
                out.put(tilePosition);
                out.putShort(position.getX());
                out.putShort(position.getY());
                out.put(position.getZ());
                player.getSession().write(out);
                return this;
            }
            
            public sendEntityHint(mobile: Mobile) {
                let type = mobile instanceof Player ? 10 : 1;
                const out = new PacketBuilder(254);
                out.put(type);
                out.putShort(mobile.getIndex());
                out.putInt(0, ByteOrder.TRIPLE_INT);
                player.getSession().write(out);
                return this;
            }

            public sendEntityHintRemoval(playerHintRemoval: boolean): PacketSender {
                let type = playerHintRemoval ? 10 : 1;
                let out = new PacketBuilder(254);
                out.put(type).putShort(-1);
                out.putInt(0, ByteOrder.TRIPLE_INT);
                player.getSession().write(out);
                return this;
            }
            
            public sendMultiIcon(value: number): PacketSender {
                let out = new PacketBuilder(61);
                out.put(value);
                player.getSession().write(out);
                player.setMultiIcon(value);
                return this;
            }
            
            public sendPrivateMessage(target: Player, message: Uint8Array, size: number): PacketSender {
                if (player instanceof PlayerBot) {
                    (player as PlayerBot).getChatInteraction().receivedPrivateMessage(message, target);
                    return this;
                }
                let out = new PacketBuilder(196, PacketType.VARIABLE);
                out.putLong(target.getLongUsername());
                out.putInt(target.getRelations().getPrivateMessageId());
                out.put(target.getRights().ordinal());
                out.put(target.getDonatorRights().ordinal());
                out.putBytes(message, size);
                player.getSession().write(out);
                return this;
            }

            public sendFriendStatus(status: number) {
                const out = new PacketBuilder(221);
                out.put(status);
                this.player.getSession().write(out);
                return this;
            }
            
            public sendFriend(name: number, world: number) {
                world = world !== 0 ? world + 9 : world;
                const out = new PacketBuilder(50);
                out.putLong(name);
                out.put(world);
                this.player.getSession().write(out);
                return this;
            }
            
            public sendDeleteFriend(name: number) {
                const out = new PacketBuilder(51);
                out.putLong(name);
                this.player.getSession().write(out);
                return this;
            }
            
            public sendAddIgnore(name: number) {
                const out = new PacketBuilder(214);
                out.putLong(name);
                this.player.getSession().write(out);
                return this;
            }
            
            public sendDeleteIgnore(name: number) {
                const out = new PacketBuilder(215);
                out.putLong(name);
                this.player.getSession().write(out);
                return this;
            }
            
            public sendTotalExp(exp: number) {
                const out = new PacketBuilder(108);
                out.putLong(exp);
                this.player.getSession().write(out);
                return this;
            }

            public sendAnimationReset(): PacketSender {
                let out = new PacketBuilder(1);
                player.getSession().write(out);
                return this;
            }
                
            public sendGraphic(graphic: Graphic, position: Location): PacketSender {
                this.sendPosition(position);
                let out = new PacketBuilder(4);
                out.put(0);
                out.putShort(graphic.getId());
                out.put(position.getZ());
                out.putShort(graphic.getDelay());
                player.getSession().write(out);
                return this;
            }
            
            public sendGlobalGraphic(graphic: Graphic, position: Location): PacketSender {
                this.sendGraphic(graphic, position);
                for (let p of player.getLocalPlayers()) {
                    p.getPacketSender().sendGraphic(graphic, position);
                }
                return this;
            }
            
            public sendObject(object: GameObject): PacketSender {
                this.sendPosition(object.getLocation());
                let out = new PacketBuilder(151);
                out.put(object.getLocation().getZ(), ValueType.A);
                out.putShort(object.getId(), ByteOrder.LITTLE);
                out.put((object.getType() << 2) + (object.getFace() & 3), ValueType.S);
                player.getSession().write(out);
                return this;
            }
            
            public sendObjectRemoval(object: GameObject): PacketSender {
                if (!object) {
                    return this;
                }
            
                this.sendPosition(object.getLocation());
                let out = new PacketBuilder(101);
                out.put((object.getType() << 2) + (object.getFace() & 3), ValueType.C);
                out.put(object.getLocation().getZ());
                player.getSession().write(out);
                return this;
            }

            public sendAnimationReset(): PacketSender {
                let out = new PacketBuilder(1);
                this.player.getSession().write(out);
                return this;
                }
                
                public sendGraphic(graphic: Graphic, position: Location): PacketSender {
                this.sendPosition(position);
                let out = new PacketBuilder(4);
                out.put(0);
                out.putShort(graphic.getId());
                out.put(position.getZ());
                out.putShort(graphic.getDelay());
                this.player.getSession().write(out);
                return this;
                }
                
                public sendGlobalGraphic(graphic: Graphic, position: Location): PacketSender {
                this.sendGraphic(graphic, position);
                for (let p of this.player.getLocalPlayers()) {
                p.getPacketSender().sendGraphic(graphic, position);
                }
                return this;
                }
                
                public sendObject(object: GameObject): PacketSender {
                this.sendPosition(object.getLocation());
                let out = new PacketBuilder(151);
                out.put(object.getLocation().getZ(), ValueType.A);
                out.putShort(object.getId(), ByteOrder.LITTLE);
                out.put((object.getType() << 2) + (object.getFace() & 3), ValueType.S);
                this.player.getSession().write(out);
                return this;
                }
                
                public sendObjectRemoval(object: GameObject): PacketSender {
                if (!object) {
                return this;
                }

                this.sendPosition(object.getLocation());
                let out = new PacketBuilder(101);
                out.put((object.getType() << 2) + (object.getFace() & 3), ValueType.C);
                out.put(object.getLocation().getZ());
                this.player.getSession().write(out);
                return this;
                }

                public sendObjectAnimation(object: GameObject, anim: Animation): PacketSender {
                    this.sendPosition(object.getLocation());
                    let out = new PacketBuilder(160);
                    out.put(0, ValueType.S);
                    out.put((object.getType() << 2) + (object.getFace() & 3), ValueType.S);
                    out.putShort(anim.getId(), ValueType.A);
                    this.player.getSession().write(out);
                    return this;
                    }

                    public alterGroundItem(item: ItemOnGround) {
                        this.sendPosition(item.getPosition());
                        let out = new PacketBuilder(84);
                        out.put(0);
                        out.putShort(item.getItem().getId()).putInt(item.getOldAmount()).putInt(item.getItem().getAmount());
                        this.player.getSession().write(out);
                        return this;
                    }
                    
                    public createGroundItem(item: ItemOnGround) {
                        this.sendPosition(item.getPosition());
                        let out = new PacketBuilder(44);
                        out.putShort(item.getItem().getId(), ValueType.A, ByteOrder.LITTLE);
                        out.putInt(item.getItem().getAmount()).put(0);
                        this.player.getSession().write(out);
                        return this;
                    }
                    
                    public deleteGroundItem(item: ItemOnGround) {
                        this.sendPosition(item.getPosition());
                        let out = new PacketBuilder(156);
                        out.put(0, ValueType.A);
                        out.putShort(item.getItem().getId());
                        this.player.getSession().write(out);
                        return this;
                    }
                    
                    public deleteRegionalSpawns(): PacketSender {
                        this.player.getSession().write(new PacketBuilder(178));
                        return this;
                    }
                    
                    public sendPosition(position: Location) {
                        let other = this.player.getLastKnownRegion();
                        let out = new PacketBuilder(85);
                        out.put(position.getY() - 8 * other.getRegionY(), ValueType.C);
                        out.put(position.getX() - 8 * other.getRegionX(), ValueType.C);
                        this.player.getSession().write(out);
                        return this;
                    }
                    
                    public sendConsoleMessage(message: string) {
                        let out = new PacketBuilder(123);
                        out.putString(message);
                        this.player.getSession().write(out);
                        return this;
                    }

                    public sendInterfaceSpriteChange(childId: number, firstSprite: number, secondSprite: number): PacketSender {
                        // player.write(new PacketBuilder(140).writeShort(childId).writeByte((firstSprite << 0) + (secondSprite & 0x0)).toPacket());
                        return this;
                    }
                    
                    public getRegionOffset(position: Location): number {
                        let x = position.getX() - (position.getRegionX() << 4);
                        let y = position.getY() - (position.getRegionY() & 0x7);
                        let offset = ((x & 0x7)) << 4 + (y & 0x7);
                        return offset;
                    }
                    
                    public sendProjectile(start: Location, end: Location, offset: number, speed: number, projectileId: number, startHeight: number, endHeight: number, lockon: Mobile, delay: number): PacketSender {
                        sendPosition(start);
                        let out = new PacketBuilder(117);
                        out.put(offset);
                        out.put((end.getX() - start.getX()));
                        out.put((end.getY() - start.getY()));
                        if (lockon != null) {
                            out.putShort(lockon.isPlayer() ? -(lockon.getIndex() + 1) : lockon.getIndex() + 1);
                        } else {
                            out.putShort(0);
                        }
                        out.putShort(projectileId);
                        out.put(startHeight);
                        out.put(endHeight);
                        out.putShort(delay);
                        out.putShort(speed);
                        out.put(16); // Angle
                        out.put(64);
                        player.getSession().write(out);
                        return this;
                    }

                    public sendHideCombatBox(): PacketSender {
                        player.getSession().write(new PacketBuilder(128));
                        return this;
                    }
                    
                    public sendObjectsRemoval(chunkX: number, chunkY: number, height: number): PacketSender {
                        player.getSession().write(new PacketBuilder(153).put(chunkX).put(chunkY).put(height));
                        return this;
                    }                
}