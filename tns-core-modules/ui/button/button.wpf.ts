import common = require("./button-common");
import utils = require("utils/utils")
import dependencyObservable = require("ui/core/dependency-observable");
import style = require("ui/styling/style");
import { TextBaseStyler as TBS } from "ui/text-base/text-base-styler";
import {device} from "platform";
let styleHandlersInitialized: boolean;

global.moduleMerge(common, exports);
let presentationFramework = requireAssembly("PresentationFramework");

export class Button extends common.Button {
    private _wpf: any;

    constructor() {
        super();

        this._wpf = new presentationFramework.System.Windows.Controls.Button();
        let that = this;
        this._wpf.Click.connect(function (s, e) {
            that._emit(common.Button.tapEvent);
        });

        if(!styleHandlersInitialized) {
            styleHandlersInitialized = true;
            ButtonStyler.registerHandlers();
        }
    }

    get wpf(): android.widget.Button {
        return this._wpf;
    }

    public _onTextPropertyChanged(data: dependencyObservable.PropertyChangeData) {
        this._wpf.Content = data.newValue;
    }
}

export class ButtonStyler implements style.Styler {
    public static registerHandlers() {
        // !!! IMPORTANT !!! This was moved here because of the following bug: https://github.com/NativeScript/NativeScript/issues/1902
        // If there is no TextBase on the Page, the TextBaseStyler.registerHandlers
        // method was never called because the file it is called from was never required.

        // Register the same stylers for Button.
        // It also derives from TextView but is not under TextBase in our View hierarchy.
        // var TextBaseStyler = <any>TBS;
        // style.registerHandler(style.colorProperty, new style.StylePropertyChangedHandler(
        //     TextBaseStyler.setColorProperty,
        //     TextBaseStyler.resetColorProperty,
        //     TextBaseStyler.getNativeColorValue), "Button");

        // style.registerHandler(style.fontInternalProperty, new style.StylePropertyChangedHandler(
        //     TextBaseStyler.setFontInternalProperty,
        //     TextBaseStyler.resetFontInternalProperty,
        //     TextBaseStyler.getNativeFontInternalValue), "Button");

        // style.registerHandler(style.textAlignmentProperty, new style.StylePropertyChangedHandler(
        //     TextBaseStyler.setTextAlignmentProperty,
        //     TextBaseStyler.resetTextAlignmentProperty,
        //     TextBaseStyler.getNativeTextAlignmentValue), "Button");

        // style.registerHandler(style.textDecorationProperty, new style.StylePropertyChangedHandler(
        //     TextBaseStyler.setTextDecorationProperty,
        //     TextBaseStyler.resetTextDecorationProperty), "Button");

        // style.registerHandler(style.textTransformProperty, new style.StylePropertyChangedHandler(
        //     TextBaseStyler.setTextTransformProperty,
        //     TextBaseStyler.resetTextTransformProperty), "Button");

        // style.registerHandler(style.whiteSpaceProperty, new style.StylePropertyChangedHandler(
        //     TextBaseStyler.setWhiteSpaceProperty,
        //     TextBaseStyler.resetWhiteSpaceProperty), "Button");

        // if (parseInt(device.sdkVersion, 10) >= 21) {
        //     style.registerHandler(style.letterSpacingProperty, new style.StylePropertyChangedHandler(
        //         TextBaseStyler.setLetterSpacingProperty,
        //         TextBaseStyler.resetLetterSpacingProperty,
        //         TextBaseStyler.getLetterSpacingProperty), "Button");
        // }
    }
}