iexport class Misc {
    static getTicks(seconds: number): number {
    return (int) (seconds / 0.6);
    }
    
    Copy code
    static getSeconds(ticks: number): number {
        return (int) (ticks * 0.6);
    }
    
    static readonly FORMATTER = new DecimalFormat("0.#");
    static readonly HALF_A_DAY_IN_MILLIS = 43200000;
    static readonly VALID_PLAYER_CHARACTERS = ['_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
            'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '[', ']', '/', '-', ' '];
    static readonly VALID_CHARACTERS = ['_', 'a', 'b', 'c', 'd',
    'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
    'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '!', '@', '#', '$', '%', '^', '&',
    '', '(', ')', '-', '+', '=', ':', ';', '.', '>', '<', ',', '"',
    '[', ']', '|', '?', '/', '`'
    ];
    private static readonly RANDOM = new RandomGen();
    private static readonly SECURE_RANDOM = new SecureRandom();
    private static readonly BLOCKED_WORDS = [
    ".com", ".net", ".org", "<img", "@cr", "<img=", ":tradereq:", ":duelreq:",
    "<col=", "<shad="];
    static readonly DIRECTIONS = [ [ -1, 1 ], [ 0, 1 ], [ 1, 1 ],
    [ -1, 0 ], [ 1, 0 ], [ -1, -1 ], [ 0, -1 ], [ 1, -1 ] ];
    static xlateDirectionToClient = new byte[]{1, 2, 4, 7, 6, 5, 3, 0};
    static xlateTable = [' ', 'e', 't', 'a', 'o', 'i', 'h', 'n',
    's', 'r', 'd', 'l', 'u', 'm', 'w', 'c', 'y', 'f', 'g', 'p', 'b',
    'v', 'k', 'x', 'j', 'q', 'z', '0', '1', '2', '3', '4', '5', '6',
    '7', '8', '9', ' ', '!', '?', '.', ',', ':', ';', '(', ')', '-',
    '&', '', '\', ''', '@', '#', '+', '=', '\243', '$', '%', '"',
    '[', ']'];

    private static ZonedDateTime zonedDateTime;
    private static RANDOM = new Random();

    Copy code
    public static getRandom(length: number): number {
        return RANDOM.nextInt(length + 1);
    }

    public static getRandomDouble(length: number): number {
        return Math.random() * length;
    }

    public static getRandomDouble(): number {
        return Math.random();
    }

    public static getRandomInt(): number {
        return RANDOM.nextInt();
    }

    public static inclusive(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static getCurrentServerTime(): string {
        zonedDateTime = ZonedDateTime.now();
        let hour = zonedDateTime.getHour();
        let hourPrefix = hour < 10 ? "0" + hour + "" : "" + hour + "";
        let minute = zonedDateTime.getMinute();
        let minutePrefix = minute < 10 ? "0" + minute + "" : "" + minute + "";
        return "" + hourPrefix + ":" + minutePrefix + "";
    }

    function getTimePlayed(totalPlayTime: number): string {
        const sec = Math.floor(totalPlayTime / 1000);
        const h = Math.floor(sec / 3600);
        const m = Math.floor(sec / 60 % 60);
        const s = sec % 60;
        return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
      }
      
      function getHoursPlayed(totalPlayTime: number): string {
        const sec = Math.floor(totalPlayTime / 1000);
        const h = Math.floor(sec / 3600);
        return (h < 10 ? "0" + h : h) + "h";
      }
      
      function getMinutesPassed(t: number): number {
        const seconds = Math.floor((t / 1000) % 60);
        const minutes = Math.floor(((t - seconds) / 1000) / 60);
        return minutes;
      }
      
      function concat(a: any[], b: any[]): any[] {
        const aLen = a.length;
        const bLen = b.length;
        const c = new Array(aLen + bLen);
        c.push(...a, ...b);
        return c;
      }
      
      function getCloseRandomPlayer(plrs: any[]): any {
        const index = getRandom(plrs.length - 1);
        if (index > 0) {
          return plrs[index];
        }
        return null;
      }

      function getDirection(x: number, y: number): number {
        for (let i = 0; i < 8; i++) {
            if (DIRECTIONS[i][0] == x && DIRECTIONS[i][1] == y)
                return i;
        }        
        return -1;
    }
    
    function ucFirst(str: string): string {
        str = str.toLowerCase();
        if (str.length > 1) {
            str = str.substring(0, 1).toUpperCase() + str.substring(1);
        } else {
            return str.toUpperCase();
        }
        return str;
    }
    
    function format(num: number): string {
        return num.toLocaleString();
    }
    
    function formatText(s: string): string {
        for (let i = 0; i < s.length; i++) {
            if (i == 0) {
                s = `${s.charAt(0).toUpperCase()}${s.substring(1)}`;
            }
            if (!/[a-zA-Z0-9]/.test(s.charAt(i))) {
                if (i + 1 < s.length) {
                    s = `${s.substring(0, i + 1)}${s.charAt(i + 1).toUpperCase()}${s.substring(i + 2)}`;
                }
            }
        }
        return s.replace("_", " ");
    }

    public static getTotalAmount(j: number): string {
        if (j >= 10000 && j < 1000000) {
            return (j / 1000) + "K";
        } else if (j >= 1000000 && j <= Number.MAX_SAFE_INTEGER) {
            return (j / 1000000) + "M";
        } else {
            return "" + j;
        }
    }
    
    public static formatPlayerName(str: string): string {
        return this.formatText(str);
    }
    
    public static insertCommasToNumber(number: string): string {
        return number.length < 4 ? number : this.insertCommasToNumber(number.substring(0, number.length - 3)) + "," + number.substring(number.length - 3, number.length);
    }
    
    public static textUnpack(packedData: Uint8Array, size: number): string {
        let decodeBuf = new Uint8Array(4096);
        let idx = 0, highNibble = -1;
        for (let i = 0; i < size * 2; i++) {
            let val = packedData[i / 2] >> (4 - 4 * (i % 2)) & 0xf;
            if (highNibble == -1) {
                if (val < 13)
                    decodeBuf[idx++] = xlateTable[val];
                else
                    highNibble = val;
            } else {
                decodeBuf[idx++] = xlateTable[((highNibble << 4) + val) - 195];
                highNibble = -1;
            }
        }
        return new TextDecoder().decode(decodeBuf.slice(0, idx));
    }

    function anOrA(s: string): string {
        s = s.toLowerCase();
        if (s === "anchovies" || s === "soft clay" || s === "cheese" || s === "ball of wool" || s === "spice" || s === "steel nails" || s === "snape grass" || s === "coal") {
          return "some";
        }
        if (s.startsWith("a") || s.startsWith("e") || s.startsWith("i") || s.startsWith("o") || s.startsWith("u")) {
          return "an";
        }
        return "a";
      }
      
    function textPack(text: string): number[] {
        if (text.length > 80) {
          text = text.substring(0, 80);
        }
      
        let packedData: number[] = [];
        text = text.toLowerCase();
        let carryOverNibble = -1;
        let ofs = 0;
        for (let idx = 0; idx < text.length; idx++) {
          let c = text.charAt(idx);
          let tableIdx = 0;
          for (let i = 0; i < xlateTable.length; i++) {
            if (c === xlateTable[i]) {
              tableIdx = i;
              break;
            }
          }
          if (tableIdx > 12) {
            tableIdx += 195;
          }
          if (carryOverNibble === -1) {
            if (tableIdx < 13) {
              carryOverNibble = tableIdx;
            } else {
              packedData[ofs++] = tableIdx;
            }
          } else if (tableIdx < 13) {
            packedData[ofs++] = (carryOverNibble << 4) + tableIdx;
            carryOverNibble = -1;
          } else {
            packedData[ofs++] = (carryOverNibble << 4) + (tableIdx >> 4);
            carryOverNibble = tableIdx & 0xf;
          }
        }
        if (carryOverNibble != -1) {
            packedData[ofs++] = carryOverNibble << 4;
            }
        return packedData;
    }

    function anOrA(s: string): string {
            s = s.toLowerCase();
            if (s.toLowerCase() === "anchovies" || s.toLowerCase() === "soft clay" || s.toLowerCase() === "cheese" || s.toLowerCase() === "ball of wool" || s.toLowerCase() === "spice" || s.toLowerCase() === "steel nails" || s.toLowerCase() === "snape grass" || s.toLowerCase() === "coal")
                return "some";
            if (s.startsWith("a") || s.startsWith("e") || s.startsWith("i") || s.startsWith("o") || s.startsWith("u"))
                return "an";
            return "a";
    }
        
    function getClasses(packageName: string): Array<any> {
            let classList: Array<any> = [];
            // Add logic to get classes from package name
            return classList;
    }

    private static findClasses(directory: string, packageName: string): any[] {
        let classes = [];
        let files = fs.readdirSync(directory);
        for (let file of files) {
            let filePath = path.join(directory, file);
            let stat = fs.lstatSync(filePath);
            if (stat.isDirectory()) {
                classes = classes.concat(findClasses(filePath, packageName + '.' + file));
            } else if (file.endsWith('.class')) {
                classes.push(require(packageName + '.' + file.substring(0, file.length - 6)));
            }
        }
        return classes;
    }
    
    public static removeSpaces(s: string): string {
        return s.replace(/ /g, "");
    }
    
    public static getMinutesElapsed(minute: number, hour: number, day: number, year: number): number {
        let i = new Date();
        if (i.getFullYear() == year) {
            if (i.getDate() == day) {
                if (hour == i.getHours()) {
                    return i.getMinutes() - minute;
                }
                return (i.getHours() - hour) * 60 + (59 - i.getMinutes());
            }
            let ela = (i.getDate() - day) * 24 * 60 * 60;
            return ela > 2147483647 ? 2147483647 : ela;
        }
        let ela = getElapsed(day, year) * 24 * 60 * 60;
        return ela > 2147483647 ? 2147483647 : ela;
    }

    const getDayOfYear = (): number => {
        let c = new Date();
        let year = c.getFullYear();
        let month = c.getMonth();
        let days = 0;
        let daysOfTheMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
            daysOfTheMonth[1] = 29;
        }
        days += c.getDate();
        for (let i = 0; i < daysOfTheMonth.length; i++) {
            if (i < month) {
                days += daysOfTheMonth[i];
            }
        }
        return days;
    }
    
    const getYear = (): number => {
        let c = new Date();
        return c.getFullYear();
    }
    
    const getElapsed = (day: number, year: number): number => {
        if (year < 2013) {
            return 0;
        }
    
        let elapsed = 0;
        let currentYear = getYear();
        let currentDay = getDayOfYear();
    
        if (currentYear == year) {
            elapsed = currentDay - day;
        } else {
            elapsed = currentDay;
    
            for (let i = 1; i < 5; i++) {
                if (currentYear - i == year) {
                    elapsed += 365 - day;
                    break;
                } else {
                    elapsed += 365;
                }
            }
        }
    
        return elapsed;
    }

    function isWeekend(): boolean {
        let day = new Date().getDay();
        return (day === 0) || (day === 6) || (day === 7);
    }

    function readFile(s: File): Uint8Array {
        try {
            let fis = new FileReader();
            let fc = new Uint8Array(s.size);
            fis.readAsArrayBuffer(s);
            fis.onloadend = function() {
                fc = new Uint8Array(fis.result);
            }
            fis.close();
            return fc;
        } catch (e) {
            console.log("FILE : " + s.name + " missing.");
            return null;
        }
    }

    function randomTypeOfList<T>(list: T[]): T {
        return list[Math.floor(Math.random() * list.length)];
    }

    function randomInclusive(min: number, max: number): number {
        return Math.min(min, max) + Math.floor(Math.random() * (Math.max(min, max) - Math.min(min, max) + 1));
    }

    import { GZIPInputStream, ByteArrayInputStream, DataInputStream } from 'java.io';
    import { TimeUnit } from 'java.util.concurrent';

    public static getBuffer(f: File): Uint8Array | null {
    if (!f.exists()) {
        return null;
    }
    let buffer = new Uint8Array(f.length());
    let dis = new DataInputStream(new FileInputStream(f));
    dis.readFully(buffer);
    dis.close();
    let gzipInputBuffer = new Uint8Array(999999);
    let bufferlength = 0;
    let gzip = new GZIPInputStream(new ByteArrayInputStream(buffer));
    do {
        if (bufferlength === gzipInputBuffer.length) {
        console.log("Error inflating data.\nGZIP buffer overflow.");
        break;
        }
        let readByte = gzip.read(gzipInputBuffer, bufferlength, gzipInputBuffer.length - bufferlength);
        if (readByte === -1) {
        break;
        }
        bufferlength += readByte;
    } while (true);
    let inflated = new Uint8Array(bufferlength);
    inflated.set(gzipInputBuffer.slice(0, bufferlength));
    buffer = inflated;
    if (buffer.length < 10) {
        return null;
    }
        return buffer;
    }

    const getTimeLeft = (start: number, timeAmount: number, timeUnit: number): number => {
        start -= timeUnit.toMillis(timeAmount);
        const elapsed = Date.now() - start;
        let toReturn = timeUnit === TimeUnit.SECONDS ? (elapsed / 1000) % 60 - timeAmount : (elapsed / 1000) / 60 - timeAmount;
        if (toReturn <= 0)
            toReturn = 1;
        return timeAmount - toReturn;
    }
    
    const getFormattedPlayTime = (player: Player) => {
        const different = Date.now() - player.getCreationDate().getTime();
    
        const secondsInMilli = 1000;
        const minutesInMilli = secondsInMilli * 60;
        const hoursInMilli = minutesInMilli * 60;
        const daysInMilli = hoursInMilli * 24;
    
        const elapsedDays = different / daysInMilli;
        let different = different % daysInMilli;
    
        const elapsedHours = different / hoursInMilli;
        different = different % hoursInMilli;
    
        const elapsedMinutes = different / minutesInMilli;
        different = different % minutesInMilli;
    
        const elapsedSeconds = different / secondsInMilli;
    
        return `${elapsedDays} day(s) : ${elapsedHours} hour(s) : ${elapsedMinutes} minute(s) : ${elapsedSeconds} second(s)`;
    }

    // Converts an array of bytes to an integer
    function hexToInt(data: number[]) {
        let value = 0;
        let n = 1000;
        for (let i = 0; i < data.length; i++) {
            let num = (data[i] & 0xFF) * n;
            value += num;
            if (n > 1) {
                n = n / 1000;
            }
        }
        return value;
    }

    // Returns the delta between two locations
    function delta(a: Location, b: Location) {
        return {x: b.x - a.x, y: b.y - a.y};
    }

    // Picks a random element out of any array type
    function randomElement<T>(array: T[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Picks a random element out of any list type
    function randomElement<T>(list: T[]) {
        return list[Math.floor(Math.random() * list.length)];
    }

    const BLOCKED_WORDS: string[] = [];

    function blockedWord(string: string): boolean {
        for (const s of BLOCKED_WORDS) {
            if (string.includes(s)) {
                return true;
            }
        }
        return false;
    }

    function capitalizeWords(name: string): string {
        let builder = "";
        const words = name.split(" ");
        for (let i = 0, l = words.length; i < l; ++i) {
            if (i > 0) {
                builder += " ";
            }
            builder += words[i][0].toUpperCase() + words[i].substring(1);
        }
        return builder;
    }

    function capitalize(name: string): string {
        if (name.length < 1) {
            return "";
        }
        let builder = "";
        builder += name[0].toUpperCase() + name.substring(1).toLowerCase();
        return builder;
    }

    public static getVowelFormat(name: string): string {
        let letter = name.charAt(0);
        let vowel = letter == 'a' || letter == 'e' || letter == 'i' || letter == 'o' || letter == 'u';
        let other = vowel ? "an" : "a";
        return other + " " + name;
    }
    
    public static isValidName(name: string): boolean {
        return formatNameForProtocol(name).match(/^[a-z0-9_]+$/gi) !== null;
    }
    
    public static stringToLong(string: string): number {
        let l: number = 0;
        for (let i = 0; i < string.length && i < 12; i++) {
            let c = string.charAt(i);
            l *= 37;
            if (c >= 'A' && c <= 'Z') {
                l += (1 + c) - 65;
            } else if (c >= 'a' && c <= 'z') {
                l += (1 + c) - 97;
            } else if (c >= '0' && c <= '9') {
                l += (27 + c) - 48;
            }
        }
        while (l % 37 == 0 && l != 0) {
            l /= 37;
        }
        return l;
    }

    function getBuffer(file: string): Uint8Array | null {
        try {
            let f = new File(file);
            if (!f.exists())
                return null;
            let buffer = new Uint8Array(f.length);
            let dis = new DataInputStream(new FileInputStream(f));
            dis.readFully(buffer);
            dis.close();
            return buffer;
        } catch (e) {
            console.error(e);
        }
        return null;
    }
    
    function formatNameForProtocol(name: string) : string {
        return name.toLowerCase().replace(" ", "_");
    }
    
    function formatName(name: string) : string {
        return fixName(name.replace(" ", "_"));
    }
    
    function longToString(l: number) : string {
        let i = 0;
        let ac: string[] = new Array(12);
        while (l != 0) {
            let l1 = l;
            l /= 37;
            ac[11 - i++] = VALID_CHARACTERS[(l1 - l * 37)];
        }
        return ac.slice(12 - i, i).join("");
    }

    const EFFECTS: string[] = [
        "@gre@", "@cya@", "@red@", "chalreq", "tradereq", "@bro@", "@yel@", "@blu@", "@gr1@", "@gr2@", "@gr3@", "@str@", "@mag@", "@dre@", "@dbl@", "@or1@", "@or2@", "@or3@", "@whi@", "@bla@", "@cr", "<col", "<shad", "<str", "<u", "<br", "<trans", "duelreq", "<img", "@lre@", ":clan:", "]cr", "::summ", "<str"
        ];
        
    function fixName(name: string): string {
        if (name.length > 0) {
            const ac = name.split('');
            for (let j = 0; j < ac.length; j++) {
                if (ac[j] === '_') {
                    ac[j] = ' ';
                if ((j + 1 < ac.length) && (ac[j + 1] >= 'a') && (ac[j + 1] <= 'z')) {
                    ac[j + 1] = String.fromCharCode((ac[j + 1].charCodeAt(0) + 65) - 97);
                }
                }
            }
            if ((ac[0] >= 'a') && (ac[0] <= 'z')) {
                ac[0] = String.fromCharCode((ac[0].charCodeAt(0) + 65) - 97);
            }
            return ac.join('');
        } else {
            return name;
        }
    }
    export function wrapText(text: string, len: number) {
        // return empty array for null text
        if (!text) return [];
      
        // return text if len is zero or less
        if (len <= 0) return [text];
      
        // return text if less than length
        if (text.length <= len) return [text];
      
        const chars = text.split("");
        const lines: string[] = [];
        let line = "";
        let word = "";
      
        // Text effects
        let effects: string | null = null;
        for (const effectCode of EFFECTS) {
          if (text.includes(effectCode)) {
            if (!effects) {
              effects = "";
            }
            effects += effectCode;
          }
        }

        if (!text) {
            return [];
        }
    
        // return text if len is zero or less
        if (len <= 0) {
            return [text];
        }
    
        // return text if less than length
        if (text.length <= len) {
            return [text];
        }
    
        const chars = text.split('');
        const lines: string[] = [];
        let line = '';
        let word = '';
    
        // Text effects
        let effects: string | null = null;
        for (const effectCode of EFFECTS) {
            if (text.includes(effectCode)) {
                if (!effects) {
                    effects = "";
                }
                effects += effectCode;
            }
        }
    
        for (let i = 0; i < chars.length; i++) {
            word += chars[i];
    
            if (chars[i] === ' ') {
                if (line.length + word.length > len) {
                    let line_ = line;

                    // Apply effects
                    if (effects && !line_.startsWith(effects)) {
                        line_ = effects + line_;
                    }

                    lines.push(line_);
                    line = '';
                }

                line += word;
                word = '';
            }
        }
        if (word.length > 0) {
            if (line.length + word.length > len) {
                let line_ = line;

                // Apply effects
                if (effects && !line_.startsWith(effects)) {
                    line_ = effects + line_;
                }

                lines.push(line_);
                line = '';
            }
            line += word;
        }
        
        // handle extra line
        if (line.length > 0) {
            let line_ = line.toString();
                // Apply effects
                if (effects != null && !line_.startsWith(effects)) {
                    line_ = effects + line_;
                }
        
                lines.push(line_);
            }
        
            let ret = new Array<string>(lines.length);
            let c = 0; // counter
            for (let e of lines) {
                ret[c] = e;
                c++;
            }
            
            return ret;
        }

    function _hash(string: string): number {
        return Array.from({length: string.length}, (_, index) => string.charCodeAt(index)).reduce((hash, charCode) => hash * 61 + charCode - 32, 0);
    }
    
    function getUsersProjectRootDirectory(): string {
        const envRootDir = process.cwd();
        const rootDir = path.resolve(".");
        if (rootDir.startsWith(envRootDir)) {
            return rootDir;
        } else {
            throw new Error("Root dir not found in user directory.");
        }
    }
    
    function random(range: number): number {
        return Math.floor(Math.random() * (range + 1));
    }
    
    function random(minRange: number, maxRange: number): number {
        return minRange + random(maxRange - minRange);
    }
    
    /**
     * Get a random number between a range and exclude some numbers.
     * The excludes list MUST BE MODIFIABLE.
     *
     * @param start start number
     * @param end end number
     * @param excludes list of numbers to be excluded
     * @return value between {@code start} (inclusive) and {@code end} (inclusive)
     */
    function getRandomExcluding(start: number, end: number, excludes: number[]): number {
        // Using Array as the list needs to be modifiable for Array.sort:
        excludes.sort();
    
        let random = start + Math.floor(Math.random() * (end - start + 1 - excludes.length));
        for (const exclude of excludes) {
            if (random < exclude) {
                break;
            }
            random++;
        }
        return random;
    }
    
    function concatWithCollection<T>(array1: T[], array2: T[]): T[] {
        const resultList = [...array1, ...array2];
        return resultList as T[];
    }
}
    

    


    





    
