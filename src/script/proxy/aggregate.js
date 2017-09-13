import $$domain from "../domain.js"
import $$request from "./data/request.js"

module.exports = function (params,fn) {
	$$request.ajax({
		url: $$domain + "mapRectangle",
        type: 'POST',
		data: params,
		withCredentials: true,
        contentType: 'application/json',
		complete: function (data) {
		    fn(data);
		}
	});
}
