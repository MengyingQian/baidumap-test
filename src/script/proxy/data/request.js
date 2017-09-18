function sendData (params) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
	    if (xhr.readyState==4){
	        if (xhr.status==200){
	            // ...our code here...
	            params.complete(JSON.parse(xhr.responseText));
	        }
	        else{
	            console.log("Problem retrieving XML data");
	        }
	    }
	}
	xhr.open(params.type,params.url,true);
	xhr.withCredentials = params.withCredentials;
	xhr.setRequestHeader("Content-type",params.contentType);
	xhr.send(JSON.stringify(params.data));
}

export default {
	ajax: sendData
}
