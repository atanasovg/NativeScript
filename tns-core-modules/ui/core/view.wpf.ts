import viewCommon = require("./view-common");
import viewDefinition = require("ui/core/view");
import trace = require("trace");
import utils = require("utils/utils");
import dependencyObservable = require("ui/core/dependency-observable");
import proxy = require("ui/core/proxy");
import gestures = require("ui/gestures");
import * as types from "utils/types";
import style = require("ui/styling/style");
import enums = require("ui/enums");
import background = require("ui/styling/background");
import {CommonLayoutParams} from "ui/styling/style";
import {device} from "platform";

global.moduleMerge(viewCommon, exports);

function onAutomationTextPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var view = <View>data.object;
    // view._nativeView.setContentDescription(data.newValue);
}
(<proxy.PropertyMetadata>viewCommon.View.automationTextProperty.metadata).onSetNativeValue = onAutomationTextPropertyChanged;

function onIdPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var view = <View>data.object;
    // view._nativeView.setTag(data.newValue + "");
}
(<proxy.PropertyMetadata>viewCommon.View.idProperty.metadata).onSetNativeValue = onIdPropertyChanged;

function onOriginXPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    // org.nativescript.widgets.OriginPoint.setX((<View>data.object)._nativeView, data.newValue);
}
(<proxy.PropertyMetadata>viewCommon.View.originXProperty.metadata).onSetNativeValue = onOriginXPropertyChanged;

function onOriginYPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    // org.nativescript.widgets.OriginPoint.setY((<View>data.object)._nativeView, data.newValue);
}
(<proxy.PropertyMetadata>viewCommon.View.originYProperty.metadata).onSetNativeValue = onOriginYPropertyChanged;

function onIsEnabledPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var view = <View>data.object;
    // view._nativeView.setEnabled(data.newValue);
}
(<proxy.PropertyMetadata>viewCommon.View.isEnabledProperty.metadata).onSetNativeValue = onIsEnabledPropertyChanged;

function onIsUserInteractionEnabledPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var view = <View>data.object;
    // view._updateOnTouchListener(data.newValue);
}
(<proxy.PropertyMetadata>viewCommon.View.isUserInteractionEnabledProperty.metadata).onSetNativeValue = onIsUserInteractionEnabledPropertyChanged;

let styleHandlersInitialized: boolean;

let windowsBase;
let presentationCore;
let presentationFramework;

function loadWinBase() {
    if(!windowsBase){
        windowsBase = requireAssembly("WindowsBase");
    }
}
function loadPresentationCore() {
    if(!presentationCore){
        presentationCore = requireAssembly("PresentationCore");
    }
}
function loadPresentationFramework() {
    if(!presentationFramework){
        presentationFramework = requireAssembly("PresentationFramework");
    }
}

export class View extends viewCommon.View {
    constructor() {
        super();
        if (!styleHandlersInitialized) {
            styleHandlersInitialized = true;
            ViewStyler.registerHandlers();
        }
    }

    public onUnloaded() {
        super.onUnloaded();
        this._unregisterAllAnimations();
    }

    public _addViewCore(view: View, atIndex?: number) {
        super._addViewCore(view, atIndex);
        view._syncNativeProperties();
    }

    get _nativeView(): any {
        return this.wpf;
    }

    get isLayoutRequired(): boolean {
        return !this.isLayoutValid;
    }

    get isLayoutValid(): boolean {
        if (this._nativeView) {
            return this._nativeView.IsMeasureValid;
        }

        return false;
    }

    public layoutNativeView(left: number, top: number, right: number, bottom: number): void {
        if (this._nativeView) {
            loadWinBase();
            let rect = new windowsBase.System.Windows.Rect(left, top, right - left, bottom - top);
            this._nativeView.Arrange(rect);
        }
    }

    public requestLayout(): void {
        super.requestLayout();
        if (this._nativeView) {
            this._nativeView.InvalidateMeasure();
        }
    }

    public measure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        super.measure(widthMeasureSpec, heightMeasureSpec);
        this.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    public layout(left: number, top: number, right: number, bottom: number): void {
        super.layout(left, top, right, bottom);
        this.onLayout(left, top, right, bottom);
    }

    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        var view = this._nativeView;
        if (view) {
            let availableWidth = utils.layout.getMeasureSpecSize(widthMeasureSpec);
            let availableHeight = utils.layout.getMeasureSpecSize(heightMeasureSpec);

            loadWinBase();
            let size = new windowsBase.System.Windows.Size(availableWidth, availableHeight); 
            view.Measure(size);

            let desiredSize = view.DesiredSize;
            this.setMeasuredDimension(desiredSize.Width, desiredSize.Height);
        }
    }

    public onLayout(left: number, top: number, right: number, bottom: number): void {
        var view = this._nativeView;
        if (view) {
            this.layoutNativeView(left, top, right, bottom);
        }
    }

    _getCurrentLayoutBounds(): { left: number; top: number; right: number; bottom: number } {
        if (this._nativeView) {
            loadPresentationCore();
            let boundingBox = presentationCore.System.Windows.Media.VisualTreeHelper.GetContentBounds(this._nativeView);
            return {
                left: boundingBox.Left,
                top: boundingBox.Top,
                right: boundingBox.Left + boundingBox.Width,
                bottom: boundingBox.Top + boundingBox.Height
            };
        }

        return super._getCurrentLayoutBounds();
    }

    public getMeasuredWidth(): number {
        if (this._nativeView) {
            return this._nativeView.ActualWidth;
        }

        return super.getMeasuredWidth();
    }

    public getMeasuredHeight(): number {
        if (this._nativeView) {
            return this._nativeView.ActualHeight;
        }

        return super.getMeasuredHeight();
    }

    public focus(): boolean {
        // if (this._nativeView) {
        //     return this._nativeView.requestFocus();
        // }

        return false;
    }

    public getLocationInWindow(): viewDefinition.Point {
        // if (!this._nativeView || !this._nativeView.getWindowToken()) {
        //     return undefined;
        // }

        // var nativeArray = (<any>Array).create("int", 2);
        // this._nativeView.getLocationInWindow(nativeArray);
        // return {
        //     x: utils.layout.toDeviceIndependentPixels(nativeArray[0]),
        //     y: utils.layout.toDeviceIndependentPixels(nativeArray[1]),
        // }
        return undefined;
    }

    public getLocationOnScreen(): viewDefinition.Point {
        // if (!this._nativeView || !this._nativeView.getWindowToken()) {
        //     return undefined;
        // }

        // var nativeArray = (<any>Array).create("int", 2);
        // this._nativeView.getLocationOnScreen(nativeArray);
        // return {
        //     x: utils.layout.toDeviceIndependentPixels(nativeArray[0]),
        //     y: utils.layout.toDeviceIndependentPixels(nativeArray[1]),
        // }
        return undefined;
    }

    public getLocationRelativeTo(otherView: viewDefinition.View): viewDefinition.Point {
        // if (!this._nativeView || !this._nativeView.getWindowToken() ||
        //     !otherView._nativeView || !otherView._nativeView.getWindowToken() ||
        //     this._nativeView.getWindowToken() !== otherView._nativeView.getWindowToken()) {
        //     return undefined;
        // }

        // var myArray = (<any>Array).create("int", 2);
        // this._nativeView.getLocationOnScreen(myArray);
        // var otherArray = (<any>Array).create("int", 2);
        // otherView._nativeView.getLocationOnScreen(otherArray);
        // return {
        //     x: utils.layout.toDeviceIndependentPixels(myArray[0] - otherArray[0]),
        //     y: utils.layout.toDeviceIndependentPixels(myArray[1] - otherArray[1]),
        // }
        return undefined;
    }

    public static resolveSizeAndState(size: number, specSize: number, specMode: number, childMeasuredState: number): number {
        var result = size;
        switch (specMode) {
            case utils.layout.UNSPECIFIED:
                result = size;
                break;

            case utils.layout.AT_MOST:
                if (specSize < size) {
                    result = specSize | utils.layout.MEASURED_STATE_TOO_SMALL;
                }
                break;

            case utils.layout.EXACTLY:
                result = specSize;
                break;
        }

        return result | (childMeasuredState & utils.layout.MEASURED_STATE_MASK);
    }
}

export class CustomLayoutView extends View implements viewDefinition.CustomLayoutView {
    constructor() {
        super();
    }

    public _addViewToNativeVisualTree(child: View, atIndex?: number): boolean {
        super._addViewToNativeVisualTree(child);

        if (this._nativeView && this._nativeView.Children && child._nativeView) {
            this._nativeView.Children.Add(child._nativeView);
            return true;
        }

        return false;
    }

    public _removeViewFromNativeVisualTree(child: View): void {
        super._removeViewFromNativeVisualTree(child);

        if (this._nativeView && this._nativeView.Children && child._nativeView) {
            this._nativeView.Children.Remove(child._nativeView);
        }
    }
}

export class ViewStyler implements style.Styler {
    private static setNativeLayoutParamsProperty(view: View, params: CommonLayoutParams): void {
        loadPresentationFramework();
        let nativeView = view._nativeView;

        let width = params.width;
        let height = params.height;

        // If width is not specified set it as WRAP_CONTENT
        if (width < 0) {
            width = Number.NEGATIVE_INFINITY;
        }

        // If height is not specified set it as WRAP_CONTENT
        if (height < 0) {
            height = Number.NEGATIVE_INFINITY;
        }

        let hAlign;
        switch (params.horizontalAlignment) {
            case enums.HorizontalAlignment.left:
               	hAlign = presentationFramework.System.Windows.HorizontalAlignment.Left;
                break;
            case enums.HorizontalAlignment.center:
                hAlign = presentationFramework.System.Windows.HorizontalAlignment.Center;
                break;
            case enums.HorizontalAlignment.right:
                hAlign = presentationFramework.System.Windows.HorizontalAlignment.Right;
                break;
            case enums.HorizontalAlignment.stretch:
                hAlign = presentationFramework.System.Windows.HorizontalAlignment.Stretch;
                break;
            default:
                throw new Error("Invalid horizontalAlignment value: " + params.horizontalAlignment);
        }

        let vAlign;
        switch (params.verticalAlignment) {
            case enums.VerticalAlignment.top:
                vAlign = presentationFramework.System.Windows.VerticalAlignment.Top;
                break;
            case enums.VerticalAlignment.center:
            case enums.VerticalAlignment.middle:
                vAlign = presentationFramework.System.Windows.VerticalAlignment.Center;
                break;
            case enums.VerticalAlignment.bottom:
                vAlign = presentationFramework.System.Windows.VerticalAlignment.Bottom;
                break;
            case enums.VerticalAlignment.stretch:
                vAlign = presentationFramework.System.Windows.VerticalAlignment.Stretch;
                break;
            default:
                throw new Error("Invalid verticalAlignment value: " + params.verticalAlignment);
        }

        nativeView.HorizontalAlignment = hAlign;
        nativeView.VerticalAlignment = vAlign;
        nativeView.Margin = new presentationFramework.System.Windows.Thickness(params.leftMargin, params.topMargin, params.rightMargin, params.bottomMargin);
    }

    private static resetNativeLayoutParamsProperty(view: View, nativeValue: any): void {
        let nativeView = view._nativeView;
        nativeView.ResetValue(presentationFramework.System.Windows.FrameworkElement.MarginProperty);
        nativeView.ResetValue(presentationFramework.System.Windows.FrameworkElement.VerticalAlignmentProperty);
        nativeView.ResetValue(presentationFramework.System.Windows.FrameworkElement.HorizontalAlignmentProperty);
    }

    public static registerHandlers() {
        style.registerHandler(style.nativeLayoutParamsProperty, new style.StylePropertyChangedHandler(
            ViewStyler.setNativeLayoutParamsProperty,
            ViewStyler.resetNativeLayoutParamsProperty));
    }
}