function getPoxy (type,params,fn) {
    var result;
    switch (type) {
        case "getRectangleInfo":
            result = require("./proxy/getRectangleInfo.js");
            break;
        case "getCoverageInfo":
            result = require("./proxy/getCoverageInfo.js");
            break;
        case "getInterferenceInfo":
            result = require("./proxy/getInterferenceInfo.js");
            break;
        case "getResoureceRateInfo":
            result = require("./proxy/getResoureceRateInfo.js");
            break;
        case "getNetworkLayoutInfo":
            result = require("./proxy/getNetworkLayoutInfo.js");
            break;
    }
    result(params,fn);
}
export default getPoxy;