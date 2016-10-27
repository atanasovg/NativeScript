import enums = require("ui/enums");
import common = require("./font-common");
import * as applicationModule from "application";
import * as typesModule from "utils/types";
import * as traceModule from "trace";
import * as fileSystemModule from "file-system";

var application: typeof applicationModule;
function ensureApplication() {
    if (!application) {
        application = require("application");
    }
}

var types: typeof typesModule;
function ensureTypes() {
    if (!types) {
        types = require("utils/types");
    }
}

var trace: typeof traceModule;
function ensureTrace() {
    if (!trace) {
        trace = require("trace");
    }
}

var fs: typeof fileSystemModule;
function ensureFS() {
    if (!fs) {
        fs = require("file-system");
    }
}

var presentationCore = requireAssembly("PresentationCore");

export class Font extends common.Font {
    public static default = new Font(undefined, undefined, enums.FontStyle.normal, enums.FontWeight.normal);

    private _wpfStyle;

    constructor(family: string, size: number, style: string, weight: string) {
        super(family, size, style, weight);
    }

    public withFontFamily(family: string): Font {
        return new Font(family, this.fontSize, this.fontStyle, this.fontWeight);
    }

    public withFontStyle(style: string): Font {
        return new Font(this.fontFamily, this.fontSize, style, this.fontWeight);
    }

    public withFontWeight(weight: string): Font {
        return new Font(this.fontFamily, this.fontSize, this.fontStyle, weight);
    }

    public withFontSize(size: number): Font {
        return new Font(this.fontFamily, size, this.fontStyle, this.fontWeight);
    }

    public getWPFStyle(): any {
        if (!this._wpfStyle) {
            if (this.isItalic) {
                this._wpfStyle = presentationCore.System.Windows.FontStyles.Italic;
            }
            else {
                this._wpfStyle = presentationCore.System.Windows.FontStyles.Normal;
            }
        }
        return this._wpfStyle;
    }
}
