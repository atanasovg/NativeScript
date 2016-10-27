import utils = require("utils/utils");
import common = require("./grid-layout-common");
import {View} from "ui/core/view";
import {PropertyMetadata} from "ui/core/proxy";
import {PropertyChangeData} from "ui/core/dependency-observable";

global.moduleMerge(common, exports);

let presentation = requireAssembly("PresentationFramework");

function setNativeRowProperty(data: PropertyChangeData) {
    let view = <View>data.object;
    presentation.System.Windows.Controls.Grid.SetRow(view._nativeView, data.newValue);
}

function setNativeRowSpanProperty(data: PropertyChangeData) {
    let view = <View>data.object;
    presentation.System.Windows.Controls.Grid.SetRowSpan(view._nativeView, data.newValue);
}

function setNativeColumnProperty(data: PropertyChangeData) {
    let view = <View>data.object;
    presentation.System.Windows.Controls.Grid.SetColumn(view._nativeView, data.newValue);
}

function setNativeColumnSpanProperty(data: PropertyChangeData) {
    let view = <View>data.object;
    presentation.System.Windows.Controls.Grid.SetColumnSpan(view._nativeView, data.newValue);
}

(<PropertyMetadata>common.GridLayout.rowProperty.metadata).onSetNativeValue = setNativeRowProperty;
(<PropertyMetadata>common.GridLayout.rowSpanProperty.metadata).onSetNativeValue = setNativeRowSpanProperty;
(<PropertyMetadata>common.GridLayout.columnProperty.metadata).onSetNativeValue = setNativeColumnProperty;
(<PropertyMetadata>common.GridLayout.columnSpanProperty.metadata).onSetNativeValue = setNativeColumnSpanProperty;

function createNativeSpec(itemSpec: ItemSpec): org.nativescript.widgets.ItemSpec {
    switch (itemSpec.gridUnitType) {
        case common.GridUnitType.auto:
            return new org.nativescript.widgets.ItemSpec(itemSpec.value, org.nativescript.widgets.GridUnitType.auto);

        case common.GridUnitType.star:
            return new org.nativescript.widgets.ItemSpec(itemSpec.value, org.nativescript.widgets.GridUnitType.star);

        case common.GridUnitType.pixel:
            return new org.nativescript.widgets.ItemSpec(itemSpec.value * utils.layout.getDisplayDensity(), org.nativescript.widgets.GridUnitType.pixel);

        default:
            throw new Error("Invalid gridUnitType: " + itemSpec.gridUnitType);
    }
}

export class ItemSpec extends common.ItemSpec {
    nativeSpec: org.nativescript.widgets.ItemSpec;

    public get actualLength(): number {
        if (this.nativeSpec) {
            return Math.round(this.nativeSpec.getActualLength() / utils.layout.getDisplayDensity());
        }

        return 0;
    }
}

export class GridLayout extends common.GridLayout {
    private _layout: any;

    constructor() {
        super();

        this._layout = new presentation.System.Windows.Controls.Grid();
    }

    get wpf(): any {
        return this._layout;
    }

    get _nativeView(): any {
        return this._layout;
    }

    private static _getNativeGridUnitType(itemSpec: ItemSpec) {
        switch(itemSpec.gridUnitType) {
        case common.GridUnitType.auto:
            return presentation.System.Windows.GridUnitType.Auto;
        case common.GridUnitType.star:
            return presentation.System.Windows.GridUnitType.Star;
        case common.GridUnitType.pixel:
            return presentation.System.Windows.GridUnitType.Pixel;
        default:
            throw new Error("Invalid gridUnitType: " + itemSpec.gridUnitType);
    }
    }

    public _onRowAdded(itemSpec: ItemSpec) {
        // if (this._layout) {
        //     var nativeSpec = createNativeSpec(itemSpec);
        //     itemSpec.nativeSpec = nativeSpec;
        //     this._layout.addRow(nativeSpec);
        // }
        let rowDef = new presentation.System.Windows.Controls.RowDefinition();
        let unitType = GridLayout._getNativeGridUnitType(itemSpec);
        let length = new presentation.System.Windows.GridLength(itemSpec.actualLength, unitType);
        rowDef.Height = length;
        this._layout.RowDefinitions.Add(rowDef);
    }

    public _onColumnAdded(itemSpec: ItemSpec) {
        let colDef = new presentation.System.Windows.Controls.ColumnDefinition();
        let unitType = GridLayout._getNativeGridUnitType(itemSpec);
        let length = new presentation.System.Windows.GridLength(itemSpec.actualLength, unitType);
        colDef.Width = length;
        this._layout.ColumnDefinitions.Add(colDef);
    }

    public _onRowRemoved(itemSpec: ItemSpec, index: number) {
        this._layout.RowDefinitions.RemoveAt(index);
    }

    public _onColumnRemoved(itemSpec: ItemSpec, index: number) {
        this._layout.ColumnDefinitions.RemoveAt(index);
    }

    protected invalidate(): void {
        // No need to request layout for android because it will be done in the native call.
    }
}
