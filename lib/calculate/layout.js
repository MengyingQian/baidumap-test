var fs = require('fs'); 

var a = ""
fs.readFile('input.txt','utf-8',function(err,data){
 if(err) throw err; 
 else {
   console.log('read success');
  // console.log(data)
 }
 var dataline = data.split("\r\n");
 dataline.pop();
 //console.log(dataline)

var number_BS = dataline.length;
// Bstation = new Object()

var result = [];
var input = [];
for (i=0;i<number_BS;i++){
    input.push(dataline[i].split("\t").concat());

    //Bstation.push(arr)
    // Bstation.fir = arr[0]
    // Bstation.sec = arr[1]
    // Bstation.tir = arr[2]
    // Bstation.for = arr[3]
    // Bstation.fiv = arr[4]
    // Bstation.six = arr[5]
    //inputtxt.push(Bstation)
}
//console.log(input.length)   174

var height_BS = [];
for (i=0;i<dataline.length;i++){
  height_BS[i] = input[i][2];    //height_BS = input(:,3); 
  //height_BS.push(input[i][2])
}

var height_BS_mean = eval(height_BS.join("+"))/number_BS;

// for(i=0;i<height_BS.length;i++){
// result3[i] = (height_BS[i] < height_BS_mean*0.85) | (height_BS[i] > height_BS_mean*1.15)
// result1[i] = distance7[i]/2; 
// } //result(:,3)
var distance1 = [];
var distance2 = [];
var distance3 = [];
var distance4 = [];
var distance5 = [];
var distance6 = [];
var distance7 = [];
var arr = [];

for (i=0;i<number_BS;i++){
    arr.push(0);
}

for (i=0;i<15;i++){
    result.push(arr.concat());
}
//console.log(result)

for (i=0;i<number_BS;i++){
    distance1[i] = 6371004*Math.acos(Math.sin(input[i][1]*Math.PI/180)*Math.sin(input[i][4]*Math.PI/180)+Math.cos((input[i][3]-input[i][0])*Math.PI/180)*Math.cos(input[i][1]*Math.PI/180)*Math.cos(input[i][4]*Math.PI/180));
    //{distance1[i] = Math.sin(input[i][1]*Math.PI/180)*Math.sin(input[i][4]*Math.PI/180)
    distance2[i] = 6371004*Math.acos(Math.sin(input[i][1]*Math.PI/180)*Math.sin(input[i][6]*Math.PI/180)+Math.cos((input[i][5]-input[i][0])*Math.PI/180)*Math.cos(input[i][1]*Math.PI/180)*Math.cos(input[i][6]*Math.PI/180)); 
    distance3[i] = 6371004*Math.acos(Math.sin(input[i][1]*Math.PI/180)*Math.sin(input[i][8]*Math.PI/180)+Math.cos((input[i][7]-input[i][0])*Math.PI/180)*Math.cos(input[i][1]*Math.PI/180)*Math.cos(input[i][8]*Math.PI/180)); 
    distance4[i] = 6371004*Math.acos(Math.sin(input[i][1]*Math.PI/180)*Math.sin(input[i][10]*Math.PI/180)+Math.cos((input[i][9]-input[i][0])*Math.PI/180)*Math.cos(input[i][1]*Math.PI/180)*Math.cos(input[i][10]*Math.PI/180)); 
    distance5[i] = 6371004*Math.acos(Math.sin(input[i][1]*Math.PI/180)*Math.sin(input[i][12]*Math.PI/180)+Math.cos((input[i][11]-input[i][0])*Math.PI/180)*Math.cos(input[i][1]*Math.PI/180)*Math.cos(input[i][12]*Math.PI/180)); 
    distance6[i] = 6371004*Math.acos(Math.sin(input[i][1]*Math.PI/180)*Math.sin(input[i][14]*Math.PI/180)+Math.cos((input[i][13]-input[i][0])*Math.PI/180)*Math.cos(input[i][1]*Math.PI/180)*Math.cos(input[i][14]*Math.PI/180)); 
    distance7[i] =(distance1[i]+distance2[i]+distance3[i]+distance4[i]+distance5[i]+distance6[i])/6;
    //console.log(input[i][1])
}
for(i=0;i<height_BS.length;i++){
result[2][i] = (height_BS[i] < height_BS_mean*0.85) | (height_BS[i] > height_BS_mean*1.15);
result[0][i] = distance7[i]/2; 

} 
//console.log(result)
//console.log(distance7)


var distance = [distance1,distance2,distance3,distance4,distance5,distance6,distance7];
var flag = [];
var postion = new Array();
for (i=0;i<=number_BS;i++){
    postion.push(1)
};

for (i=1;i<=6;i++){
    for (k=0;k<number_BS;k++){
        flag[k] = (distance[i-1][k] < distance[6][k]*0.75) | (distance[i-1][k] > distance[6][k]*1.25);  
        result[1][k] = result[1][k] | flag[k];      
        result[2*postion[k]+1][k] = input[k][2*i+1]*flag[k];     //result 原文中用position表示，这里直接编号，之后出错的话再改
        result[2*postion[k]+2][k] = input[k][2*i+2]*flag[k];
    }
    for (j=0;j<number_BS;j++){
        postion[j] = postion[j] + flag[j];                                          
    }
}
//console.log(result)

var txt = "";

for (j=0;j<result[0].length;j++){
    for (i=0;i<result.length;i++){    
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