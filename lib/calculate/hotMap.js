var fs = require('fs'); 

var a = ""
fs.readFile('fugai/input.txt','utf-8',function(err,data){
    if(err) throw err; 
    else {
        console.log('read success');
    // console.log(data)
    }
    var dataline = data.split("\r\n");
    dataline.pop();
//console.log(dataline)
var coordinate_sBS00 = [];
var coordinate_sBS01 = [];
var coordinate_gBS00 = [];
var coordinate_gBS01 = [];
var coordinate_sBSS0 = [];
var coordinate_sBSS1 = [];
var number_BS = dataline.length;
//console.log(number_BS)
var flag = dataline[0].length;
var input = [];

for (var i=0;i<number_BS;i++){
    input.push(dataline[i].split("\t").concat());
}
for (var i=0;i<number_BS;i++){
    coordinate_sBS00[i] = input[i][0];
    coordinate_sBS01[i] = input[i][1];
    coordinate_gBS00[i] = input[i][2];
    coordinate_gBS01[i] = input[i][3];
    coordinate_sBSS0[i] = (coordinate_gBS00[i] - coordinate_sBS00[i])*111*Math.cos(coordinate_gBS01[i]); 
    coordinate_sBSS1[i] = (coordinate_gBS01[i] - coordinate_sBS01[i])*111;          
}
var coordinate_sBS0 = [coordinate_sBS00,coordinate_sBS01];
var coordinate_gBS0 = [coordinate_gBS00,coordinate_gBS01];
var coordinate_sBS = [coordinate_sBSS0,coordinate_sBSS1];
//console.log(coordinate_sBS);
var f = 2.5,wallthrowLoss = 0;

//console.log(input[0][8]);
var power_gBS = input.map(function (item,i) { return Math.pow(10,input[i][8]/10)});
var height_BS = input.map(function (item,i) {return input[i][4]/1000});
var distance_sBS_gBS = input.map(function (item,i) {
    return 6371004*Math.acos(Math.sin(input[i][1]*Math.PI/180)*Math.sin(input[i][3]*Math.PI/180)+Math.cos((input[i][2]-input[i][0])*Math.PI/180)*Math.cos(input[i][1]*Math.PI/180)*Math.cos(input[i][3]*Math.PI/180));
});
//console.log(distance_sBS_gBS)
//pathLoss_sBS_gBS=10.^((80+21*log10(f)+40*log10(distance_sBS_gBS/1000).*(1-4*10^(-3).*height_BS*1000)-18*log10(height_BS*1000))./10);
var pathLoss_sBS_gBS = height_BS.map(function (item,i) {
    return Math.pow(10,(80+21*Math.log(f)/Math.log(10)+40*Math.log(distance_sBS_gBS[i]/1000)/Math.log(10)*(1-4*Math.pow(10,-3)*height_BS[i]*1000)-18*Math.log(height_BS[i]*1000)/Math.log(10))/10)
});
var ceter3db=65;                
var Am=20;                      
var D = [];
var cosgg = [];
for (var i=0;i<number_BS;i++){
    D.push(20);
    cosgg.push(1);
}
var cosgg1 = cosgg.concat();
var cosgg2 = cosgg.concat();
var tilt_down_Radian = input.map(function (item,i) {return input[i][5]*Math.PI/180});
var tilt_direct_Radian = input.map(function (item,i) {return input[i][6]*Math.PI/180});

var r,B,A1,F,M,aa,a,tilt,l;
var R,linshi,b,F;
for (var k=0;k<number_BS;k++){
    distance_sBS_gBS = Math.sqrt(Math.pow(coordinate_sBS[0][k],2)+Math.pow(coordinate_sBS[0][k],2));     
    r = 1.5 * distance_sBS_gBS;
    B = [coordinate_sBS[0][k],coordinate_sBS[1][k],height_BS[k]];
    if ((B[1]/Math.sqrt(3))<B[0]&&(B[1]/Math.sqrt(3))>-B[0]) {
        A1=[(-1/2)*r,(1/2)*Math.sqrt(3)*r,0];
    }else if (B[1]>0){
        A1=[(-1/2)*r,(-1/2)*Math.sqrt(3)*r,0];
    }else{ 
        A1=[Math.sqrt(3)*r,0,0];
    }       
    F = height_BS.map(function (item,i) { return height_BS[i]-r*Math.tan(tilt_down_Radian[k])});
    M=[0,0,F[k]];
    aa=[0,0,height_BS[k]];  
    var a = aa.map(function (item,i) {
        return aa[i]-B[i];
    });
    tilt = tilt_direct_Radian[k];
    R = [[Math.cos(tilt),-Math.sin(tilt),0],[Math.sin(tilt),Math.cos(tilt),0],[0,0,1]];

    function T(arr){
        var arr_new=[];  
        //初始化，定下有多少行  
        for (var i=0;i<arr[0].length;i++ ){  
            arr_new[i]=[];  
        }  
        //可以动态的添加数据  
        //遍历旧数组  
        for (var i=0;i<arr.length ;i++ ){//控制有几个元素     
            for (j=0;j<arr[i].length ;j++ ){//遍历每一个具体的值   
                arr_new[j][i]=arr[i][j];  
            }  
        }  
        return arr_new;
    }

   // a = a * R;
 
    var a_new = [];
    for (var i=0;i<a.length;i++ ){
        //R_col = T(R)[i]
        //console.log(i+"1");
        //console.log(R_col)
        a_new[i] = dot(a,T(R)[i]);
        // console.log(i);
    }
    a = a_new

    function dot(v1,v2) {  
        var res = 0;
        for (var j=0;j<v1.length;j++){
            res += v1[j]*v2[j];
        }
        return res;
    }   
    //console.log(dot(a,T(R)[1]))



    linshi = [A1[0],A1[1],height_BS[k]];
    b = M.map(function (item,i) {
        return M[i]-linshi[i];
    })
   // b=M-[A1(1),A1(2),height_BS(k)];


    function X2(X){
        cf = X.map(function (item,i) {
            return X[i]*X[i];
        });
        return cf;
    }
    function sum(list){
        return eval(list.join("+"));
    }
    function norm(v){
        return Math.sqrt(sum(X2(v)));
    }

    cosgg[k] = Math.abs(dot(a,b))/(norm(a)*norm(b));   

    var fxxl = [0,0,-1] //方向向量
    var n1 = A1.map(function (item,i) {
        return A1[i]/norm(A1)*Math.sin(tilt_down_Radian[k])+fxxl[i]/norm(fxxl)*Math.cos(tilt_down_Radian[k]);
    })






    var d1 = Math.abs(dot(a,n1))/norm(n1);
    cosgg1[k]=Math.sqrt(1-Math.pow((d1/norm(a)),2));                        
    var n2 = [A1[0]+A1[1],A1[1]-A1[0],0];                                 
    var d2 = Math.abs(dot(a,n2))/norm(n2);
    cosgg2[k] = Math.sqrt(1-Math.pow(d2/norm(a),2));                           
}
//console.log(n2)
//console.log(cosgg2)
//以上调试完成校对结果准确







var g1=[];g2=[];
var gain_gBS_sBS0=[];
var gain_gBS_sBS=[],C=[],C1=[],power_re=[],g11=[],g21=[],power_re=[],result=[];
for (var i=0;i<number_BS;i++){
    g1[i] = cosgg[i]/cosgg1[i];
    g2[i] = cosgg[i]/cosgg2[i];
    //var filtered = [12, 5, 8, 130, 44].filter(isBigEnough);
    if (isNaN(g1[i])==1){
        g1[i] = 0 ;
    }
    if (isNaN(g2[i])==1){
        g2[i] = 0 ;
    }
    g11[i] = Math.acos(g1[i])*180/Math.PI;    //js real 不知道如何处理
    g21[i] = Math.acos(g2[i])*180/Math.PI;
    C[i] = -12*(Math.pow((g11[i])/ceter3db,2));
    if (isNaN(C[i])==1){
        C[i] = 0 ;
    }
    //C(find(isnan(C)==1)) = 0;
    //C1=-12*((g21)./ceter3db).^2;
    C1[i] = -12*(Math.pow((g21[i])/ceter3db,2));
    if (isNaN(C1[i])==1){
        C1[i] = 0 ;
    }
    gain_gBS_sBS0[i] = 15-Math.min(-(C[i]+C1[i]),D[i]);
    gain_gBS_sBS[i] = Math.pow(10,gain_gBS_sBS0[i]/10);

    power_re[i]=(power_gBS[i]*gain_gBS_sBS[i])/pathLoss_sBS_gBS[i];    
    result[i] = 10*Math.log(power_re[i])/Math.log(10)-20*Math.log(f)/Math.log(10)-75.06; 
}
//console.log(result);
var sendout = ""
for (i=0;i<result.length;i++){
sendout += result[i]+"\r\n";
}
fs.writeFile('output.txt', sendout, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
});
})