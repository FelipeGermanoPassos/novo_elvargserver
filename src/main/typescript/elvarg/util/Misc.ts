import DecimalFormat from "decimal-format"

class Misc {

    /**
 * Gets the number of seconds represented in Game ticks
 *
 * @param seconds
 * @return
 */

    public static getTicks(seconds: number, int) {
        return (int)(seconds / 0.6);
    }

    public static getSeconds(int, ticks: number) {
        return (int)(ticks * 0.6);
    }

    //Our formatter
    public static formatter = new DecimalFormat("0.#");
    public static halfADayInMillis = 43200000;
    /**
      * An array containing valid player name characters.
      */
    public static validPlayerCharacters: string[] = ['_', 'a', 'b', 'c', 'd',
    'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
    'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '!', '@', '#', '$', '%', '^', '&',
    '*', '(', ')', '-', '+', '=', ':', ';', '.', '>', '<', ',', '"',
    '[', ']', '|', '?', '/', '`'];

        /**
     * Random instance, used to generate pseudo-random primitive types.
     */

}