import common = require("./label-common");
import view = require("ui/core/view");
import utils = require("utils/utils");
import style = require("ui/styling/style");
import font = require("ui/styling/font");
import enums = require("ui/enums");
import {device} from "platform";
global.moduleMerge(common, exports);

let presentationCore = requireAssembly("PresentationCore");
let presentationFramework = requireAssembly("PresentationFramework");
let styleHandlersInitialized: boolean;

export class Label extends common.Label {
    private _wpf: any;

    constructor() {
        super();

        this._wpf = new presentationFramework.System.Windows.Controls.TextBlock();

        if(!styleHandlersInitialized) {
            styleHandlersInitialized = true;
            LabelStyler.registerHandlers();
        }
    }

    get wpf(): any {
        return this._wpf;
    }
}

export class LabelStyler implements style.Styler {
    // color
    private static setColorProperty(view: view.View, newValue: any) {
        let brush = new presentationCore.System.Windows.Media.SolidColorBrush(newValue.wpf);
        view._nativeView.Foreground = brush;
    }

    private static resetColorProperty(view: view.View, nativeValue: any) {
        view._nativeView.Foreground = nativeValue;
    }

    private static getNativeColorValue(view: view.View): any {
        return view._nativeView.Foreground;
    }

    // font
    private static setFontInternalProperty(view: view.View, newValue: any, nativeValue?: any) {
        var textBlock = view._nativeView;
        var fontValue = <font.Font>newValue;

        var style = fontValue.fontStyle;
        if (style) {
            textBlock.FontStyle = fontValue.getWPFStyle();
        }
        else {
            textBlock.ResetValue(presentationFramework.System.Windows.Controls.Control.FontStyleProperty);
        }

        if (fontValue.fontSize) {
            textBlock.FontSize = fontValue.fontSize;
        }
        else {
            textBlock.ResetValue(presentationFramework.System.Windows.Controls.Control.FontSizeProperty);
        }
    }

    private static resetFontInternalProperty(view: view.View, nativeValue: any) {
        var textBlock = view._nativeView;
        textBlock.ResetValue(presentationFramework.System.Windows.Controls.Control.FontStyleProperty);
        textBlock.ResetValue(presentationFramework.System.Windows.Controls.Control.FontSizeProperty);
    }

    private static getNativeFontInternalValue(view: view.View): any {
        return {};
    }

    // // text-align
    // private static setTextAlignmentProperty(view: view.View, newValue: any) {
    //     var verticalGravity = view._nativeView.getGravity() & android.view.Gravity.VERTICAL_GRAVITY_MASK;
    //     switch (newValue) {
    //         case enums.TextAlignment.left:
    //             view._nativeView.setGravity(android.view.Gravity.LEFT | verticalGravity);
    //             break;
    //         case enums.TextAlignment.center:
    //             view._nativeView.setGravity(android.view.Gravity.CENTER_HORIZONTAL | verticalGravity);
    //             break;
    //         case enums.TextAlignment.right:
    //             view._nativeView.setGravity(android.view.Gravity.RIGHT | verticalGravity);
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // private static resetTextAlignmentProperty(view: view.View, nativeValue: any) {
    //     view._nativeView.setGravity(nativeValue);
    // }

    // private static getNativeTextAlignmentValue(view: view.View): any {
    //     return view._nativeView.getGravity();
    // }

    // // text-decoration
    // private static setTextDecorationProperty(view: view.View, newValue: any) {
    //     utils.ad.setTextDecoration(view._nativeView, newValue);
    // }

    // private static resetTextDecorationProperty(view: view.View, nativeValue: any) {
    //     utils.ad.setTextDecoration(view._nativeView, enums.TextDecoration.none);
    // }

    // // text-transform
    // private static setTextTransformProperty(view: view.View, newValue: any) {
    //     utils.ad.setTextTransform(view, newValue);
    // }

    // private static resetTextTransformProperty(view: view.View, nativeValue: any) {
    //     utils.ad.setTextTransform(view, enums.TextTransform.none);
    // }

    // // white-space
    // private static setWhiteSpaceProperty(view: view.View, newValue: any) {
    //     utils.ad.setWhiteSpace(view._nativeView, newValue);
    // }

    // private static resetWhiteSpaceProperty(view: view.View, nativeValue: any) {
    //     utils.ad.setWhiteSpace(view._nativeView, enums.WhiteSpace.normal);
    // }

    // // letter-spacing
    // private static getLetterSpacingProperty(view: view.View): any {
    //     return view.android.getLetterSpacing();
    // }

    // private static setLetterSpacingProperty(view: view.View, newValue: any) {
    //     view.android.setLetterSpacing(newValue);
    // }

    // private static resetLetterSpacingProperty(view: view.View, nativeValue: any) {
    //     view.android.setLetterSpacing(nativeValue);
    // }

    public static registerHandlers() {
        style.registerHandler(style.colorProperty, new style.StylePropertyChangedHandler(
            LabelStyler.setColorProperty,
            LabelStyler.resetColorProperty,
            LabelStyler.getNativeColorValue), "Label");

        // style.registerHandler(style.placeholderColorProperty, new style.StylePropertyChangedHandler(
        //     TextBaseStyler.setPlaceholderColorProperty,
        //     TextBaseStyler.resetPlaceholderColorProperty,
        //     TextBaseStyler.getNativePlaceholderColorValue), "TextBase");

        style.registerHandler(style.fontInternalProperty, new style.StylePropertyChangedHandler(
            LabelStyler.setFontInternalProperty,
            LabelStyler.resetFontInternalProperty,
            LabelStyler.getNativeFontInternalValue), "TextBase");

        // style.registerHandler(style.textAlignmentProperty, new style.StylePropertyChangedHandler(
        //     TextBaseStyler.setTextAlignmentProperty,
        //     TextBaseStyler.resetTextAlignmentProperty,
        //     TextBaseStyler.getNativeTextAlignmentValue), "TextBase");

        // style.registerHandler(style.textDecorationProperty, new style.StylePropertyChangedHandler(
        //     TextBaseStyler.setTextDecorationProperty,
        //     TextBaseStyler.resetTextDecorationProperty), "TextBase");

        // style.registerHandler(style.textTransformProperty, new style.StylePropertyChangedHandler(
        //     TextBaseStyler.setTextTransformProperty,
        //     TextBaseStyler.resetTextTransformProperty), "TextBase");

        // style.registerHandler(style.whiteSpaceProperty, new style.StylePropertyChangedHandler(
        //     TextBaseStyler.setWhiteSpaceProperty,
        //     TextBaseStyler.resetWhiteSpaceProperty), "TextBase");

        // if (parseInt(device.sdkVersion, 10) >= 21) {
        //     style.registerHandler(style.letterSpacingProperty, new style.StylePropertyChangedHandler(
        //         TextBaseStyler.setLetterSpacingProperty,
        //         TextBaseStyler.resetLetterSpacingProperty,
        //         TextBaseStyler.getLetterSpacingProperty), "TextBase");
        // }

        // !!! IMPORTANT !!! Button registrations were moved to button.android.ts to make sure they 
        // are executed when there is a Button on the page: https://github.com/NativeScript/NativeScript/issues/1902
        // If there is no TextBase on the Page, the TextBaseStyler.registerHandlers
        // method was never called because the file it is called from was never required.
    }
}
