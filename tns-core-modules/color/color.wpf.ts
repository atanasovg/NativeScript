import common = require("./color-common");

let presentationCore = requireAssembly("PresentationCore");

export class Color extends common.Color {
    private _wpf;

    get wpf(): number {
        if(!this._wpf) {
            this._wpf = presentationCore.System.Windows.Media.Color.FromArgb(this.a, this.r, this.g, this.b); 
        }
        return this._wpf;
    }
}
