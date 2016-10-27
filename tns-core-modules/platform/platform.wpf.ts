/* tslint:disable:class-name */
import definition = require("platform");
import utils = require("utils/utils");
import * as enumsModule from "ui/enums";

const MIN_TABLET_PIXELS = 600;

export module platformNames {
    export var android = "Android";
    export var ios = "iOS";
    export var wpf = "WPF";
}

let mscorlib = requireAssembly("mscorlib");
let presentation = requireAssembly("PresentationFramework");

class Device implements definition.Device {
    private _manufacturer: string;
    private _model: string;
    private _osVersion: string;
    private _sdkVersion: string;
    private _deviceType: string;
    private _uuid: string;
    private _language: string;
    private _region: string;

    get os(): string {
        return platformNames.wpf;
    }

    get manufacturer(): string {
        return undefined;
    }

    get osVersion(): string {
        if (!this._osVersion) {
            //this._osVersion = mscorlib.System.Environment.OSVersion.// todo;
        }

        return this._osVersion;
    }

    get model(): string {
        // if (!this._model) {
        //     this._model = android.os.Build.MODEL;
        // }

        return this._model;
    }

    get sdkVersion(): string {
        // if (!this._sdkVersion) {
        //     this._sdkVersion = android.os.Build.VERSION.SDK;
        // }

        return this._sdkVersion;
    }

    get deviceType(): string {
        if (!this._deviceType) {
            this._deviceType = enumsModule.DeviceType.Desktop;
        }

        return this._deviceType;
    }

    get uuid(): string {
        // if (!this._uuid) {
        //     this._uuid = android.provider.Settings.Secure.getString(
        //         utils.ad.getApplicationContext().getContentResolver(),
        //         android.provider.Settings.Secure.ANDROID_ID
        //         );
        // }

        return this._uuid;
    }

    get language(): string {
        if (!this._language) {
            this._language = mscorlib.System.Globalization.CultureInfo.CurrentCulture.Name;
        }

        return this._language;
    }

    get region(): string {
        // if(!this._region) {
        //     this._region = java.util.Locale.getDefault().getCountry();
        // }

        return this._region;
    }
}

class MainScreen implements definition.ScreenMetrics {
    private _mainScreen: any;
    private get screen(): any {
        if (!this._mainScreen) {
            this._mainScreen = presentation.System.Windows.SystemParameters.WorkArea;
        }
        return this._mainScreen;
    }

    get widthPixels(): number {
        return this.screen.Width;
    }
    get heightPixels(): number {
        return this.screen.Height;
    }
    get scale(): number {
        return 1;
    }
    get widthDIPs(): number {
        return this.widthPixels;
    }
    get heightDIPs(): number {
        return this.heightPixels;
    }

}

export var device: definition.Device = new Device();

export module screen {
    export var mainScreen = new MainScreen();
}

export var isAndroid = true;