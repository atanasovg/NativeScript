import pageCommon = require("./page-common");
import view = require("ui/core/view");
import enums = require("ui/enums");
import * as actionBar from "ui/action-bar";
import * as gridLayout from "ui/layouts/grid-layout";
import * as traceModule from "trace";
import * as colorModule from "color";

global.moduleMerge(pageCommon, exports);

let presentation = requireAssembly("PresentationFramework");

var trace: typeof traceModule;
function ensureTrace() {
    if (!trace) {
        trace = require("trace");
    }
}

var color: typeof colorModule;
function ensureColor() {
    if (!color) {
        color = require("color");
    }
}

export class Page extends pageCommon.Page {
    private _isBackNavigation = false;
    private _grid: any;

    constructor() {
        super();

        this._grid = new presentation.System.Windows.Controls.Grid;
    }

    get wpf(): any {
        return this._grid;
    }

    get _nativeView(): any {
        return this._grid;
    }

    public _addViewToNativeVisualTree(child: view.View, atIndex?: number): boolean {
        // Set the row property for the child 
        if (this._nativeView && child._nativeView) {
            if (child instanceof actionBar.ActionBar) {
                gridLayout.GridLayout.setRow(child, 0);
                child.horizontalAlignment = enums.HorizontalAlignment.stretch;
                child.verticalAlignment = enums.VerticalAlignment.top;
            }
            else {
                gridLayout.GridLayout.setRow(child, 1);
            }
        }

        return super._addViewToNativeVisualTree(child, atIndex);
    }

    public onNavigatedFrom(isBackNavigation: boolean) {
        this._isBackNavigation = isBackNavigation;
        super.onNavigatedFrom(isBackNavigation);
    }    

    public _updateActionBar(hidden: boolean) {
        this.actionBar.update();
    }
}
