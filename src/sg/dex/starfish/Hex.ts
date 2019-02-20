
/**
 * Utility class for hexadecimal strings
 *
 */
export default class Hex {
    /**
     * Converts an int value in the range 0..15 to a hexadecimal character
     * @param value Integer value to convert
     * @return hex char for value
     */
    public static toChar(value: number) {
        if (value>=0) {
            if (value<=9) return String.fromCharCode(value+48);
            if (value<=15) return String.fromCharCode(value+87);
        }
        throw new Error("Invalid value for hex char: "+value);
    }

    /**
     * Gets the value of a single hex car e.g. val('c') =&gt; 12
     * @param c Character to convert
     * @return int value from hex char c
     */
    public static val(c: string) {
        let v: number = c.charCodeAt(0);
        if (v<=102) {
            if (v>=97) return v-87; // lowercase
            if ((v>=65)&&(v<=70)) return v-55; // uppercase
            if ((v>=48)&&(v<=57)) return v-48; // digit
        }
        throw new Error("Invalid hex char ["+c+"] = "+v);
    }

}
