import definition = require("ui/frame");
import frameCommon = require("./frame-common");
import pages = require("ui/page");
import trace = require("trace");
import {View} from "ui/core/view";
import {Observable} from "data/observable";
import * as application from "application";
import * as types from "utils/types";

global.moduleMerge(frameCommon, exports);

let FRAMEID = "_frameId";
let navDepth = -1;
let fragmentId = -1;

var presentationFramework = requireAssembly("PresentationFramework");

class WPFFrame extends Observable implements definition.WPFFrame {
    private _rootView;

    constructor() {
        super();
    }

    get rootView(): any {
        return this._rootView;
    }
}

export class Frame extends frameCommon.Frame {
    private _wpf: WPFFrame;

    constructor() {
        super();
    }

    get wpf(): any {
        return this._wpf;
    }

    public static get defaultAnimatedNavigation(): boolean {
        return false;
    }
    public static set defaultAnimatedNavigation(value: boolean) {
    }

    public static get defaultTransition(): definition.NavigationTransition {
        return undefined;
    }
    public static set defaultTransition(value: definition.NavigationTransition) {
    }

    get _nativeView(): any {
        return this._wpf.rootView;
    }

    public _navigateCore(backstackEntry: definition.BackstackEntry) {
        super._navigateCore(backstackEntry);

        let clearHistory = backstackEntry.entry.clearHistory;

        // New Fragment
        if (clearHistory) {
            navDepth = -1;
        }
        navDepth++;
        
        // backstackEntry
        backstackEntry.isNavigation = true;
        backstackEntry.navDepth = navDepth;
        this._currentEntry = backstackEntry;

        application.wpf.mainWindow.Content = backstackEntry.resolvedPage._nativeView;
    }

    private static _clearHistory(fragment: android.app.Fragment) {
    }

    public _goBackCore(backstackEntry: definition.BackstackEntry) {
        super._goBackCore(backstackEntry);
    }

    public _popFromFrameStack() {
        if (!this._isInFrameStack) {
            return;
        }

        super._popFromFrameStack();
    }

    protected _processNavigationContext(navigationContext: frameCommon.NavigationContext) {
        super._processNavigationContext(navigationContext);
    }
}