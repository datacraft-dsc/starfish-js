import * as assert from "assert"
import Hex from "../../../../src/sg/dex/starfish/Hex"

describe("Hex", () => {

    it("testHexVal", () => {
        let i: number = 0;

	for (i=0; i<=15; i++) {
	    assert.equal(i,Hex.val("0123456789abcdef".charAt(i)));
	}

	for (i=0; i<=15; i++) {
	    assert.equal(i,Hex.val("0123456789ABCDEF".charAt(i)));
	}
    })

    it("testHexChars", () => {
        let i: number = 0;

	for (i=0; i<=15; i++) {
	    assert.equal("0123456789abcdef".charAt(i),Hex.toChar(i));
	}
    })
})
