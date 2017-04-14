var fs = require('fs'); 


fs.readFile('rate/input.txt','utf-8',function(err,data){
  if(err) throw err; 
  else {
   console.log('read success');
  // console.log(data)
  }
 var dataline = data.split("\r\n");
 dataline.pop();

var number = dataline.length;
//console.log(number_BS)
//var number_time = dataline[0].length;
var input = [];

for (var i=0;i<number;i++){
input.push(dataline[i].split(",").concat());
}
var number_time = input[0].length;
var x = [];
for (var i=0;i<number_time;i++){
    x[i] = i;
}
//概率密度函数
function normpdf(x, miu, sig){   
    pdf = Math.pow(Math.sqrt(2*Math.PI)*sig,-1)*Math.pow(Math.E,-Math.pow(x-miu,2)/2*sig*sig);  
    return pdf 
}
var y = [];
 for (var i=0;i<number_time;i++){
    y[i] = normpdf(x[i],0,1);        
 }                         

function fliplr(T){  
    var FT = T.concat();
    for (var i=0;i<T.length;i++){
        T[i] = FT[T.length-1-i];
    }
    return T;
}

function conv(a,b){  
    M = a.length;
    N=b.length;
    var S = [];
    var B = [];
    var BB = [];
A = fliplr(a);
for (var i=0;i<M-1;i++){
    B[i] = 0;
    BB[i] = 0}
B = B.concat(b).concat(BB);
for (var i=0;i<M+N-1;i++){
   S[i] = 0;
   n=0;
for (var j=0;j<M;j++){
temp=A[j]*B[i+j];
if (B[i+j]!=0){
    n=n+1;
}
S[i]=S[i]+temp;
}
S[i]=S[i]/n;
}
return S
}

var aa = [];
var result = [];
for (var i=0;i<number;i++ ){ 
   result[i] = [];  }
var yy=fliplr(y);

for (var i = 0;i<number;i++){
    for (var j = 0;j<number_time;j++){//应该是end-numbertime
    aa = conv(input[i],yy);  
    result[i][j] = aa[number_time+j-1];
}
}
console.log(result);
var txt = "";
var a = "";
for (i=0;i<result.length;i++){
for (j=0;j<result[0].length;j++)
//for (i=0;i<result.length;i++)
{    
    txt += result[i][j]+",";
}
   a += txt.substring(0,txt.length-1)+"\r\n"
   txt =""
}
      fs.writeFile('output.txt', a, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
    });
})