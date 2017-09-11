import domain from "../domain.js"
import $$request from "./data/request.js"

var send = function (params,fn) {
	var url = domain + "aggregate";
	$$request(url,params,fn);
}