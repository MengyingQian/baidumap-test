import $$domain from "../domain.js"
import $$request from "./data/request.js"

module.exports = function (params,fn) {
	$$request.ajax({
		url: $$domain + "networkLayout",
        type: 'POST',
		data: params,
		withCredentials: true,
        contentType: 'application/json',
		complete: function (data) {
			if (data.code != 0) throw data.msg
		    fn&&fn(data.data);
		}
	});
}
