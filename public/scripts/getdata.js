/*通过ajax后台交互获取数据*/
/*使用promise*/
'use strict'

function getdata(url,condition){
	//debugger;
	console.log(condition);
	return new Promise(function(resolve, reject){
		$.ajax({
		type:'POST',
		url:url,
		async: false,
		dataType:'json',
		data:condition,
		success:function(data){
			console.log(data.length);
			resolve(data);
		},
		error:function(err){
			console.log(err);
			alert("fail");
		}
	});
	});
	
	
}