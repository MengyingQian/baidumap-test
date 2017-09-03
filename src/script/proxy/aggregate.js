import domain from "../domain.js"


var send = function (params,fn) {
	var url = domain + "aggregate";
	var init = {
		method: "POST",
		body: params,
		mode: "cors",
		cache: "default"
	}

	fetch(url,init)
	.then(function(res){
		console.log(res);
		// fn&&fn(res);
	})
}