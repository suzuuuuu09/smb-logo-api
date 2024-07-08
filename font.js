// font.js
const { registerFont } = require("canvas");

class Font{
    constructor(fontPath, family){
        this.fontPath = fontPath;
        this.family = family;
    }
    register(){
        registerFont(this.fontPath, { family: this.family });
    }
}

module.exports = { Font };