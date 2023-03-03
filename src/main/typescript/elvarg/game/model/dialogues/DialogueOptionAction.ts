import { DialogueOption } from "./DialogueOption";

interface DialogueOptionAction {
    executeOption(option: DialogueOption): void;
}