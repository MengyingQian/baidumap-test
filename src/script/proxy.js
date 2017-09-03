function getPoxy (type,params,fn) {
    var result;
    switch (type) {
        case "aggregate":
            result = require("./proxy/aggregate.js");
            break;
    }
    result(params,fn);
}
export default getPoxy;