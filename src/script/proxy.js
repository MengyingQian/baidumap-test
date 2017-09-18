function getPoxy (type,params,fn) {
    var result;
    switch (type) {
        case "getRectangleInfo":
            result = require("./proxy/getRectangleInfo.js");
            break;
    }
    result(params,fn);
}
export default getPoxy;