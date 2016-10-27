import appModule = require("./application-common");
import definition = require("application");
import frame = require("ui/frame");
import observable = require("data/observable");
import * as typesModule from "utils/types";
import * as enumsModule from "ui/enums";
var presentation = requireAssembly("PresentationFramework");

let enums: typeof enumsModule;

global.moduleMerge(appModule, exports);
const typedExports: typeof definition = exports;

let started = false;
let mainWindow;
export function start(entry?: frame.NavigationEntry) {
    if (started) {
        throw new Error("Application is already started.");
    }

    started = true;
    if (entry) {
        typedExports.mainEntry = entry;
    }

    loadCss();
    wpf.initialize();
}

function loadCss() {
    //HACK: identical to application.ios.ts
    typedExports.appSelectors = typedExports.loadCss(typedExports.cssFile) || [];
    if (typedExports.appSelectors.length > 0) {
        typedExports.mergeCssSelectors(typedExports);
    }
}

export function addCss(cssText: string) {
    //HACK: identical to application.ios.ts
    const parsed = typedExports.parseCss(cssText);
    if (parsed) {
        typedExports.additionalSelectors.push.apply(typedExports.additionalSelectors, parsed);
        typedExports.mergeCssSelectors(typedExports);
    }
}

class WPFApp extends observable.Observable implements definition.WPFApplication {
    public nativeApp;
    public mainWindow;

    public initialize() {
        this.nativeApp = new presentation.System.Windows.Application();
        var that = this;
        this.nativeApp.Startup.connect(function(sender, e) {
            var navParam = typedExports.mainEntry;
            if (!navParam) {
                navParam = {
                    moduleName: typedExports.mainModule
                }
            }

            var rootFrame = new frame.Frame();

            that.mainWindow = new presentation.System.Windows.Window();
            that.mainWindow.Loaded.connect(function(s, e) {
                rootFrame.onLoaded();
            });
            navParam.context = that.mainWindow;

            rootFrame.navigate(navParam);
            that.mainWindow.Show();
        });
        this.nativeApp.Run();
    }
}

export var wpf = new WPFApp();