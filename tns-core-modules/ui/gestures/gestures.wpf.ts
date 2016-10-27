import common = require("./gestures-common");
import definition = require("ui/gestures");
import observable = require("data/observable");
import view = require("ui/core/view");
import trace = require("trace");
import utils = require("utils/utils");

global.moduleMerge(common, exports);

// TODO: Impl