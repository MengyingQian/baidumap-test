import domain from "../domain.js"
import $$request from "./data/request.js"

function send (params,fn) {
	var url = domain + "aggregate";
	$$request(url,params,fn);
}

module.exports = send;