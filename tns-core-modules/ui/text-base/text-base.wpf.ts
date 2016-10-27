import common = require("./text-base-common");
import types = require("utils/types");
import dependencyObservable = require("ui/core/dependency-observable");

export class TextBase extends common.TextBase {
    public _onTextPropertyChanged(data: dependencyObservable.PropertyChangeData) {
        this.wpf.Text = data.newValue;
    }
    public _setFormattedTextPropertyToNative(value) {
        var newText = value ? value._formattedText : null;
        if (this.android) {
            this.android.setText(newText);
        }
    }
}