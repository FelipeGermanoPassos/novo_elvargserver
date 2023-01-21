export class ButtonClickPacketListener implements PacketExecutor {

  public static readonly FIRST_DIALOGUE_OPTION_OF_FIVE: number = 2494;
  public static readonly SECOND_DIALOGUE_OPTION_OF_FIVE: number = 2495;
  public static readonly THIRD_DIALOGUE_OPTION_OF_FIVE: number = 2496;
  public static readonly FOURTH_DIALOGUE_OPTION_OF_FIVE: number = 2497;
  public static readonly FIFTH_DIALOGUE_OPTION_OF_FIVE: number = 2498;
  public static readonly FIRST_DIALOGUE_OPTION_OF_FOUR: number = 2482;
  public static readonly SECOND_DIALOGUE_OPTION_OF_FOUR: number = 2483;
  public static readonly THIRD_DIALOGUE_OPTION_OF_FOUR: number = 2484;
  public static readonly FOURTH_DIALOGUE_OPTION_OF_FOUR: number = 2485;
  public static readonly FIRST_DIALOGUE_OPTION_OF_THREE: number = 2471;
  public static readonly SECOND_DIALOGUE_OPTION_OF_THREE: number = 2472;
  public static readonly THIRD_DIALOGUE_OPTION_OF_THREE: number = 2473;
  public static readonly FIRST_DIALOGUE_OPTION_OF_TWO: number = 2461;
  public static readonly SECOND_DIALOGUE_OPTION_OF_TWO: number = 2462;
  private static readonly LOGOUT: number = 2458;
  private static readonly TOGGLE_RUN_ENERGY_ORB: number = 1050;
  private static readonly TOGGLE_RUN_ENERGY_SETTINGS: number = 42507;
  private static readonly OPEN_EQUIPMENT_SCREEN: number = 27653;
  private static readonly OPEN_PRICE_CHECKER: number = 27651;
  private static readonly OPEN_ITEMS_KEPT_ON_DEATH_SCREEN: number = 27654;
  private static readonly TOGGLE_AUTO_RETALIATE_328: number = 24115;
  private static readonly TOGGLE_AUTO_RETALIATE_425: number = 24041;
  private static readonly TOGGLE_AUTO_RETALIATE_3796: number = 24033;
  private static readonly TOGGLE_AUTO_RETALIATE_776: number = 24048;
  private static readonly TOGGLE_AUTO_RETALIATE_1698: number = 24017;
  private static readonly TOGGLE_AUTO_RETALIATE_1764: number = 24010;
  private static readonly TOGGLE_AUTO_RETALIATE_2276: number = 22845;
  private static readonly TOGGLE_AUTO_RETALIATE_5570: number = 24025;
  private static readonly DESTROY_ITEM: number = 14175;
  private static readonly CANCEL_DESTROY_ITEM: number = 14176;
  private static readonly PRICE_CHECKER_WITHDRAW_ALL: number = 18255;
  private static readonly PRICE_CHECKER_DEPOSIT_ALL: number = 18252;
  private static readonly TOGGLE_EXP_LOCK: number = 476;
  private static readonly OPEN_WORLD_MAP: number = 156;

  // Trade buttons
  private static readonly TRADE_ACCEPT_BUTTON_1: number = 3420;
  private static readonly TRADE_ACCEPT_BUTTON_2: number = 3546;
  // Duel buttons
  private static readonly DUEL_ACCEPT_BUTTON_1: number = 6674;
  private static readonly DUEL_ACCEPT_BUTTON_2: number = 6520;
  // Close buttons
  private static readonly CLOSE_BUTTON_1: number = 18247;
  private static readonly CLOSE_BUTTON_2: number = 38117;
  // Presets
  private static readonly OPEN_PRESETS: number = 31015;
  // Settings tab
  private static readonly OPEN_ADVANCED_OPTIONS: number = 42524;
  private static readonly OPEN_KEY_BINDINGS: number = 42552;

  public static handlers(player: Player, button: number): boolean {
    if (PrayerHandler.togglePrayer(player, button)) {
      return true;
    }
    if (Autocasting.handleWeaponInterface(player, button)
      || Autocasting.handleAutocastTab(player, button)
      || Autocasting.toggleAutocast(player, button)) {
      return true;
    }
    if (WeaponInterfaces.changeCombatSettings(player, button)) {
      BonusManager.update(player);
      return true;
    }
    if (EffectSpells.handleSpell(player, button)) {
      return true;
    }
    if (Bank.handleButton(player, button, 0)) {
      return true;
    }
    if (Emotes.doEmote(player, button)) {
      return true;
    }
    if (ClanChatManager.handleButton(player, button, 0)) {
      return true;
    }
    if (player.getSkillManager().pressedSkill(button)) {
      return true;
    }
    if (player.getQuickPrayers().handleButton(button)) {
      return true;
    }
    if (player.getDueling().checkRule(button)) {
      return true;
    }
    if (Smithing.handleButton(player, button)) {
      return true;
    }
    if (Presetables.handleButton(player, button)) {
      return true;
    }
    if (QuestHandler.handleQuestButtonClick(player, button)) {
      return true;
    }
    if (MinigameHandler.handleButtonClick(player, button)) {
      return true;
    }
    return false;
  }

    function execute(player: Player, packet: Packet): void {
  let button = packet.readInt();

  if (player.getHitpoints() <= 0 || player.isTeleporting()) {
    return;
  }

  if (player.getRights() == PlayerRights.DEVELOPER) {
    player.getPacketSender().sendMessage("Button clicked: " + button.toString() + ".");
  }

  if (handlers(player, button)) {
    return;
  }

  switch (button) {
    case OPEN_PRESETS:
      if (player.busy()) {
        player.getPacketSender().sendInterfaceRemoval();
      }
      Presetables.open(player);
      break;

    case OPEN_WORLD_MAP:
      if (player.busy()) {
        player.getPacketSender().sendInterfaceRemoval();
      }
      player.getPacketSender().sendInterface(54000);
      break;

    case LOGOUT:
      if (player.canLogout()) {
        player.requestLogout();
      } else {
        player.getPacketSender().sendMessage("You cannot log out at the moment.");
      }
      break;

    case TOGGLE_RUN_ENERGY_ORB:
    case TOGGLE_RUN_ENERGY_SETTINGS:
      if (player.busy()) {
        player.getPacketSender().sendInterfaceRemoval();
      }
      if (player.getRunEnergy() > 0) {
        player.setRunning(!player.isRunning());
      } else {
        player.setRunning(false);
      }
      player.getPacketSender().sendRunStatus();
      break;

    case OPEN_ADVANCED_OPTIONS:
      if (player.busy()) {
        player.getPacketSender().sendInterfaceRemoval();
      }
      player.getPacketSender().sendInterface(23000);
      break;

    case OPEN_KEY_BINDINGS:
      if (player.busy()) {
        player.getPacketSender().sendInterfaceRemoval();
      }
      player.getPacketSender().sendInterface(53000);
      break;

    case OPEN_EQUIPMENT_SCREEN:
      if (player.busy()) {
        player.getPacketSender().sendInterfaceRemoval();
      }
      BonusManager.open(player);
      break;

    case OPEN_PRICE_CHECKER:
      if (player.busy()) {
        player.getPacketSender().sendInterfaceRemoval();
      }
      player.getPriceChecker().open();
      break;

    case OPEN_ITEMS_KEPT_ON_DEATH_SCREEN:
      if (player.busy()) {
        player.getPacketSender().sendInterfaceRemoval();
      }
      ItemsKeptOnDeath.open(player);
      break;

    case PRICE_CHECKER_WITHDRAW_ALL:
      player.getPriceChecker().withdrawAll();
      break;

    case PRICE_CHECKER_DEPOSIT_ALL:
      player.getPriceChecker().depositAll();
      break;

    case TRADE_ACCEPT_BUTTON_1:
    case TRADE_ACCEPT_BUTTON_2:
      player.getTrading().acceptTrade();
      break;

    case DUEL_ACCEPT_BUTTON_1:
    case DUEL_ACCEPT_BUTTON_2:
      player.getDueling().acceptDuel();
      break;

    case TOGGLE_AUTO_RETALIATE_328:
    case TOGGLE_AUTO_RETALIATE_425:
    case TOGGLE_AUTO_RETALIATE_3796:
    case TOGGLE_AUTO_RETALIATE_776:
    case TOGGLE_AUTO_RETALIATE_1764:
    case TOGGLE_AUTO_RETALIATE_2276:
    case TOGGLE_AUTO_RETALIATE_5570:
    case TOGGLE_AUTO_RETALIATE_1698:
      player.setAutoRetaliate(!player.autoRetaliate());
      break;

    case DESTROY_ITEM:
      let item = player.getDestroyItem();
      player.getPacketSender().sendInterfaceRemoval();
      if (item != -1) {
        player.getInventory().delete(item, player.getInventory().getAmount(item));
      }
      break;

    case CANCEL_DESTROY_ITEM:
      player.getPacketSender().sendInterfaceRemoval();
      break;

    case TOGGLE_EXP_LOCK:
      player.setExperienceLocked(!player.experienceLocked());
      if (player.experienceLocked()) {
        player.getPacketSender().sendMessage("Your experience is now @red@locked.");
      } else {
        player.getPacketSender().sendMessage("Your experience is now @red@unlocked.");
      }
      break;

    case CLOSE_BUTTON_1:
    case CLOSE_BUTTON_2:
    case 16999:
      player.getPacketSender().sendInterfaceRemoval();
      break;

    case FIRST_DIALOGUE_OPTION_OF_FIVE:
    case FIRST_DIALOGUE_OPTION_OF_FOUR:
    case FIRST_DIALOGUE_OPTION_OF_THREE:
    case FIRST_DIALOGUE_OPTION_OF_TWO:
      player.getDialogueManager().handleOption(player, DialogueOption.FIRST_OPTION);
      break;
    case SECOND_DIALOGUE_OPTION_OF_FIVE:
    case SECOND_DIALOGUE_OPTION_OF_FOUR:
    case SECOND_DIALOGUE_OPTION_OF_THREE:
    case SECOND_DIALOGUE_OPTION_OF_TWO:
      player.getDialogueManager().handleOption(player, DialogueOption.SECOND_OPTION);
      break;
    case THIRD_DIALOGUE_OPTION_OF_FIVE:
    case THIRD_DIALOGUE_OPTION_OF_FOUR:
    case THIRD_DIALOGUE_OPTION_OF_THREE:
      player.getDialogueManager().handleOption(player, DialogueOption.THIRD_OPTION);
      break;
    case FOURTH_DIALOGUE_OPTION_OF_FIVE:
    case FOURTH_DIALOGUE_OPTION_OF_FOUR:
      player.getDialogueManager().handleOption(player, DialogueOption.FOURTH_OPTION);
      break;
    case FIFTH_DIALOGUE_OPTION_OF_FIVE:
      player.getDialogueManager().handleOption(player, DialogueOption.FIFTH_OPTION);
      break;
    default:
      // player.getPacketSender().sendMessage("Player "+player.getUsername()+", click button: "+button);
      break;
  }
}
