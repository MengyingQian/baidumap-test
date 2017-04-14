//Math.random()是（0,1）是否与matlab相同有待查证
// 如果想获得 [min, max], 可以使用 Math.floor(Math.random() * (max - min + 1)) + min;
// 如果想获得 [min, max）, 可以使用 Math.floor(Math.random() * (max - min )) + min;
// 如果想获得 (min, max], 可以使用 Math.ceil(Math.random() * (max - min )) + min;


var fs = require('fs'); 
var a = "";
fs.readFile('ganrao/input.txt','utf-8',function(err,data){
    if(err) throw err; 
    else {
        console.log('read success');
    // console.log(data)
    }
var dataline = data.split("\r\n");
dataline.pop();
var number_BS = dataline.length;
//console.log(number_BS)
var flag = dataline[0].length;
var input = [];

for (var i=0;i<number_BS;i++){
    input.push(dataline[i].split("\t").concat());
}
//console.log(dataline)
var coordinate_sBS00 = [];
var coordinate_sBS01 = [];
var coordinate_gBS00 = [];
var coordinate_gBS01 = [];
var coordinate_sBSS0 = [];
var coordinate_sBSS1 = [];
var tilt_down = [];

//console.log(input)
 for (var i=0;i<number_BS;i++){
    coordinate_sBS00[i] = input[i][0];
    coordinate_sBS01[i] = input[i][1];
    coordinate_gBS00[i] = input[i][8];
    coordinate_gBS01[i] = input[i][9];
    coordinate_sBSS0[i] = (coordinate_gBS00[i] - coordinate_sBS00[i])*111*Math.cos(coordinate_gBS01[i]); 
    coordinate_sBSS1[i] = (coordinate_gBS01[i] - coordinate_sBS01[i])*111;          

    var coordinate_sBS0 = [coordinate_sBS00,coordinate_sBS01];
    var coordinate_gBS0 = [coordinate_gBS00,coordinate_gBS01];
    var coordinate_sBS = [coordinate_sBSS0,coordinate_sBSS1];
    var f = 2;                                         
    var r = 0.15;                                        
    var number_User = 60;                               
    var wallthrowLoss = 0;       
    var power_gBS = input.map(function (item,i) { return Math.pow(10,input[i][14]/10)});        
    var power_UE_Max = Math.pow(10,23/10);                       
    var power_UE_Min = Math.pow(10,-30/10);                     
    var height_sUE = 1/1000;                             
    var gain_sUE = Math.pow(10,-4/10);            
    var height_gBS = input.map(function (item,i) {return input[i][10]/1000}) ;     
    var height_sBS = input.map(function (item,i) {return input[i][2]/1000})   ;
    // tilt_down[0] = [];
    // tilt_down[1] = [];
    // tilt_down[0][i] = input[i][3];    
    // tilt_down[1][i] = input[i][11];               
    // tilt_direct[0] = [];
    // tilt_direct[1] = [];
    // tilt_direct[0][i] = input[i][4];                 
    // tilt_direct[1][i] = input[i][12];
}
var arr = [];
for (var i=0;i<number_BS;i++){
    arr.push(0);
}
var interference_UE_sBS  = [];
for (var i=0;i<number_User*3;i++){
    interference_UE_sBS.push(arr.concat());
}
var probability_UE_sBS = [];
for (var i=0;i<number_BS;i++){
    probability_UE_sBS.push(0);
}
var ACLR = [41.57,42.97,44.37,45.77,47.17,47.35,47.35,47.35,47.35,47.35,47.35,59.35,59.35,59.35,59.35,59.35,59.35,59.35,59.35,59.35,59.35,59.35,59.35,59.35,59.35,59.35,59.35,59.35,59.35,59.35,69.35,69.35,69.35,69.35,69.35,69.35,69.35,69.35,69.35,69.35];
 //ACLR = 10.^(ACLR./10);
ACLR = ACLR.map(function (item,i) {
          return Math.pow(10,ACLR[i]/10);
        });
var distance_sBS_gBS = coordinate_sBSS0.map(function (item,i) {
        return Math.sqrt(Math.pow(coordinate_sBSS0[i],2)+Math.pow(coordinate_sBSS1[i],2)+Math.pow(height_gBS[i]-height_sBS[i],2));
      });


var pathLoss_sBS_gBS =  distance_sBS_gBS.map(function (item,i) {
   return Math.pow(10,(92.5+20*Math.log(f)/Math.log(10)+20*Math.log(distance_sBS_gBS[i])/Math.log(10)+(0.0072+0.0012)*distance_sBS_gBS[i])/10);
 });

var ceter3db=65;                   
var D = [[],[]] ; 
var C = [[],[]] ; 
var C1 = [[],[]] ;
var angle1 = [[],[]];   
var angle2 = [[],[]];    
var gain_gBS_sBS0 = [[],[]]; 
var gain_gBS_sBS = [[],[]];

for(var i=0;i<number_BS;i++) {
    D[0].push(20);
    D[1].push(20);
    angle1[0].push(0);
    angle1[1].push(0);
    angle2[0].push(0);
    angle2[1].push(0);
}
   
var tilt_down_Radian = [[],[]] ; 
for (var i=0;i<number_BS;i++){
    tilt_down_Radian[0][i] =  input[i][3]*Math.PI/180;
    tilt_down_Radian[1][i] =  input[i][11]*Math.PI/180;
}
var angle;
var differ_height = [];

function heaviside(x){
    if (x<0){
        return 0;
    }else if(x==0){
        return 0.5;
    }else {
        return 1;
    }
}
var distance_touying;
var interference_sBS_gBS = [];
for (var k=0;k<number_BS;k++){
    angle=(90-Math.atan(Math.abs(coordinate_sBS[0][k]/coordinate_sBS[1][k]))/Math.PI*180)*heaviside(coordinate_sBS[1][k])+(90+Math.atan(Math.abs(coordinate_sBS[0][k]/coordinate_sBS[1][k]))/Math.PI*180)*heaviside(-coordinate_sBS[1][k]);
    angle1[0][k] = Math.abs(angle-60)*heaviside(120-angle)+(180-angle)*heaviside(angle-120);
    differ_height[k] = Math.abs(height_gBS[k]-height_sBS[k]);
    distance_touying = Math.sqrt(Math.pow(coordinate_sBS[0][k],2)+Math.pow(coordinate_sBS[1][k],2)*Math.cos(angle1[0][k]*Math.PI/180));
    angle2[0][k] = Math.atan(differ_height[k]/distance_touying)/Math.PI*180-input[k][3];
    
    //var coordinate_gBS = -coordinate_sBS;
    //coordinate_gBS = coordinate_sBS.map(function (item,i) { return (-1)*coordinate_sBS


    angle=(90-Math.atan(Math.abs(-coordinate_sBS[0][k]/(-coordinate_sBS[1][k]))/Math.PI*180))*heaviside(-coordinate_sBS[1][k])+(90+Math.atan(Math.abs(coordinate_sBS[0][k]/coordinate_sBS[1][k]))/Math.PI*180)*heaviside(coordinate_sBS[1][k]);//因为注释把两个负号提出来了
    angle1[1][k] = Math.abs(angle -60)*heaviside(120-angle)+(180-angle)*heaviside(angle-120);
    distance_touying = Math.sqrt(Math.pow(-coordinate_sBS[0][k],2)+Math.pow(-coordinate_sBS[1][k],2))*Math.cos(angle1[1][k]*Math.PI/180);
    angle2[1][k] = Math.atan(differ_height[k]/distance_touying)/Math.PI*180-input[k][11];


    C[0][k]=-12*Math.pow(angle1[0][k]/ceter3db,2);
    C1[0][k]=-12*Math.pow(angle2[0][k]/ceter3db,2);
    C[1][k]=-12*Math.pow(angle1[1][k]/ceter3db,2);
    C1[0][k]=-12*Math.pow(angle2[0][k]/ceter3db,2);
    if (isNaN(C[0][k])==1){
        C[0][k] = 0 ;
    }
    if (isNaN(C[1][k])==1){
        C[1][k] = 0 ;
    }
    if (isNaN(C1[0][k])==1){
        C1[0][k] = 0 ;
    }
    if (isNaN(C1[1][k])==1){
        C1[1][k] = 0 ;
    }

    //C(find(isnan(C)==1)) = 0;
    //C1=-12*((angle2)./ceter3db).^2;
    //C1(find(isnan(C1)==1)) = 0;
    gain_gBS_sBS0[0][k] = 15-Math.min(-(C[0][k]+C1[0][k]),D[0][k]);
    gain_gBS_sBS0[1][k] = 15-Math.min(-(C[1][k]+C1[1][k]),D[1][k]);
    gain_gBS_sBS[0][k] = Math.pow(10,gain_gBS_sBS0[0][k]/10);
    gain_gBS_sBS[1][k] = Math.pow(10,gain_gBS_sBS0[1][k]/10);
    interference_sBS_gBS[k] = (power_gBS[k]*gain_gBS_sBS[0][k]*gain_gBS_sBS[1][k])/pathLoss_sBS_gBS[k]/Math.max.apply(Math,ACLR);  
    //gain_gBS_sBS0=15-min(-(C+C1),D);
    //gain_gBS_sBS=10.^(gain_gBS_sBS0./10);
}
//coordinate_sUE=zeros(number_sBS,3*number_User,3);  
D = null;
C = null ;
angle1 = null;
angle2 = null;
D = [];
angle1 = [];
C = []; 
angle2 = [];
var coordinate_sUE0 = [];  
var coordinate_sUE1 = [];  
var coordinate_sUE2 = [];  
for (var i=0;i<3*number_User;i++ ){  //180列
    coordinate_sUE0[i] = [];  
    coordinate_sUE1[i] = []; 
    coordinate_sUE2[i] = []; 
    D[i] = [];
    C[i] = []; 
    angle1[i] = [];
    angle2[i] = [];
}  
for (var j=0;j<3*number_User;j++){
for (var i=0;i<number_BS;i++){     //57行
    coordinate_sUE0[j][i] = 0;
    coordinate_sUE1[j][i] = 0;
    coordinate_sUE2[j][i] =0;
    D[j][i] = 20;
}
}
var x = [];
for (var i = 0 ;i<number_BS;i++){

    var k=0;
    while (k < number_User*3){
        x=[(Math.sqrt(3)/2)*(2*Math.random()-1)*r,(2*Math.random()-1)*r];
        if ((Math.abs(x[1])+Math.abs(x[0])/Math.sqrt(3))<r){
          
            coordinate_sUE0[k][i] = x[0];
            coordinate_sUE1[k][i] = x[1];
            coordinate_sUE2[k][i] = Math.sqrt(Math.pow(x[0],2)+Math.pow(x[1],2)+Math.pow(height_sBS[i]-height_sUE,2));
            k = k + 1;
        }   
    }
}
var ceter3db=65;    
for (var k = 0;k< number_BS;k++){
    for (var i = 0 ;i< number_User*3;i++){
        angle = (90-Math.atan(Math.abs(coordinate_sUE0[i][k]/coordinate_sUE1[i][k]))/Math.PI*180)*heaviside(coordinate_sUE1[i][k])+(90+Math.atan(Math.abs(coordinate_sUE0[0][k]/coordinate_sUE1[i][k]))/Math.PI*180)*heaviside(-coordinate_sUE1[i][k]);
        //angle = (90-atan(abs(coordinate_sUE(k,i,1)/coordinate_sUE(k,i,2)))/pi*180)*heaviside(coordinate_sUE(k,i,2))+(90+atan(abs(coordinate_sUE(k,i,1)/coordinate_sUE(k,i,2)))/pi*180)*heaviside(-coordinate_sUE(k,i,2));
        //  %angle = abs(atan(coordinate_sUE(k,i,1)/coordinate_sUE(k,i,2)))/pi*180;  %终端与正北方向的夹角
        angle1[i][k] = Math.abs(angle-60)*heaviside(120-angle)+(180-angle)*heaviside(angle-120);
        //angle1(k,i) = abs(angle -60).*heaviside(120-angle)+(180-angle).*heaviside(angle-120);%基站和终端连线与天线水平方向的夹角
        differ_height[k] = Math.abs(height_sBS[k]-height_sUE);
        distance_touying = Math.sqrt(Math.pow(coordinate_sUE0[i][k],2)+Math.pow(coordinate_sUE1[i][k],2)*Math.cos(angle1[i][k]*Math.PI/180));
        // distance_touying = sqrt(coordinate_sUE(k,i,1).^2.+coordinate_sUE(k,i,2).^2)*cos(deg2rad(angle1(k,i)));%计算余弦值时，角度需转换为弧度
        angle2[i][k] = Math.atan(differ_height[k]/distance_touying)/Math.PI*180-input[k][3];
        //angle2(k,i) = atan(differ_height(k)./distance_touying)/pi*180-tilt_down(k,1);%基站和终端连线与天线垂直方向的夹角
    }
    //console.log(angle1)
}

C1 = null;
pathLoss_sBS_gBS = null;

C1=[];  
var gain_sBS_sUE0 = [];
var gain_sBS_sUE = [];
pathLoss_sBS_gBS = [];
var pathLoss_sUE_sBS = [];
var interference_sUE_sBS_Count = [];
var interference_sUE_sBS = [];

// C = buildamir(C,D);
// C1 = buildamir(C1,angle1);
// gain_sBS_sUE0 = buildamir( gain_sBS_sUE0,angle1);
// gain_sBS_sUE  = buildamir( gain_sBS_sUE,angle1);
for (var i=0;i<3*number_User;i++){  
    C1[i]=[];   
    gain_sBS_sUE0[i] = [];  
    gain_sBS_sUE[i] = [];
    pathLoss_sBS_gBS[i] = [];
    interference_sUE_sBS_Count[i] = [];
    interference_sUE_sBS[i] = [];
    pathLoss_sUE_sBS[i] = [];
}  

for (var i=0;i<number_User*3 ;i++ ){     
    for (var j=0;j<number_BS ;j++ ){  
        C[i][j]=-12*Math.pow(angle1[i][j]/ceter3db,2); 
        C1[i][j]=-12*Math.pow((angle2[i][j])/ceter3db,2); 
    }  
}  

function findnan(arr){
    for (var i=0;i<arr.length ;i++ ){//控制有几个元素  
        for (var j=0;j<arr[i].length ;j++ ){ //遍历每一个具体的值  
            if(isNaN(arr[i][j])==1){
                arr[i][j] = 0
            }
        }  
    }  
    return arr
} 
C = findnan(C);
C1 = findnan(C1);
//console.log(C);
//pathLoss_sBS_gBS  = buildamir( pathLoss_sBS_gBS,angle1);
// var interference_sUE_sBS = [];
// interference_sUE_sBS = buildamir( interference_sUE_sBS,angle1);
for (var i=0;i<number_User*3;i++ ){//控制有几个元素  
    for (var j=0;j<number_BS;j++ ){//遍历每一个具体的值  
        gain_sBS_sUE0[i][j] = 15-Math.min(-(C[i][j]+C1[i][j]),D[i][j]);
        gain_sBS_sUE[i][j] = Math.pow(10,gain_sBS_sUE0[i][j]/10);
        pathLoss_sUE_sBS[i][j] = Math.pow(10,(92.5+20*Math.log(f)/Math.log(10)+20*Math.log(coordinate_sUE2[i][j])/Math.log(10)+(0.0072+0.0012)*coordinate_sUE2[i][j]+wallthrowLoss)/10);
        interference_sUE_sBS[i][j] = (power_UE_Max*gain_sUE*gain_sBS_sUE[i][j])/pathLoss_sUE_sBS[i][j];
        //    console.log(interference_sUE_sBS[i][j]);
        //   console.log( gain_sBS_sUE[i][j]);
        //   console.log(pathLoss_sUE_sBS[i][j]);
    }  
} 
interference_sUE_sBS =  findnan(interference_sUE_sBS);
// interference_sBS_gBS[i] = interference_sBS_gBS

// Mir = interference_sBS_gBS;
// interference_sBS_gBS = null;
// interference_sBS_gBS = [];
var Mir = [];
for (var i=0;i<number_User*3;i++){
    Mir.push(interference_sBS_gBS.concat());
}
// var interference_sUE_sBS_Count = [];
// interference_sUE_sBS_Count = buildamir( interference_sUE_sBS_Count,angle1);

for (var k = 0;k< number_BS;k++){
    for (var i = 0 ;i< number_User*3;i++) {
        if (interference_sUE_sBS[i][k]<Mir[i][k]){  
          interference_sUE_sBS_Count[i][k] = 1;
        }else {
            interference_sUE_sBS_Count[i][k] = 0;
        }  
     }
 }
var sum = [];

var  probability_sUE = [];
for (var k = 0;k< number_BS;k++){
    sum[k]=0;
    for (var i = 0 ;i< number_User*3;i++) {
        sum[k] += interference_sUE_sBS_Count[i][k];
    }
    probability_sUE[k] = sum[k]/(number_User*3)
}
//console.log(probability_sUE)
var result = probability_sUE;
var sendout = "";
for (i=0;i<result.length;i++){
    sendout += result[i]+"\r\n";
}
fs.writeFile('output.txt', sendout, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
});
//console.log( result);
//写文件有时会写到文件夹外，该问题还未解决
})