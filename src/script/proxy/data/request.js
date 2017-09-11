function sendData (url,params,fn) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
	    if (xhr.readyState==4){
	        if (xhr.status==200){
	            // ...our code here...
	            fn&&fn(xhr.responseText);
	        }
	        else{
	            console.log("Problem retrieving XML data");
	        }
	    }
	}
	xhr.open("post",url,true);
	xhr.withCredentials = true;
	xhr.setRequestHeader("Content-type","application/json; charset=utf-8");
	xhr.send(JSON.stringify(params));
}

export default sendData
