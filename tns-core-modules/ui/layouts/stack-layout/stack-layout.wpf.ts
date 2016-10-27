import common = require("./stack-layout-common");
import {Orientation} from "ui/enums";
import {PropertyMetadata} from "ui/core/proxy";
import {PropertyChangeData} from "ui/core/dependency-observable";

global.moduleMerge(common, exports);

let presentation = requireAssembly("PresentationFramework");

function setNativeOrientationProperty(data: PropertyChangeData): void {
    var stackLayout = <StackLayout>data.object;
    var nativeView = stackLayout._nativeView;
    if(data.newValue === Orientation.vertical) {
        nativeView.Orientation = presentation.System.Windows.Constrols.Orientation.Vertical;
    }
    else {
        nativeView.Orientation = presentation.System.Windows.Constrols.Orientation.Horizontal;
    }
    nativeView.setOrientation(data.newValue === Orientation.vertical ? org.nativescript.widgets.Orientation.vertical : org.nativescript.widgets.Orientation.horizontal);
}

(<PropertyMetadata>common.StackLayout.orientationProperty.metadata).onSetNativeValue = setNativeOrientationProperty;

export class StackLayout extends common.StackLayout {
    private _layout: any;

    constructor() {
        super();

        this._layout = new presentation.System.Windows.Controls.StackPanel();
    }

    get wpf(): any {
        return this._layout;
    }

    get _nativeView(): any {
        return this._layout;
    }    
}