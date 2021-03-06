'use strict'

var q = require('q');
var exec = require('child_process').exec;
var fs = require('fs');

//调用matlab处理查询到的数据
//计算资源利用率
function MATLAB_rate(rData){
    function rate1(rData){
        var tab='\t';  
        var newLine='\r\n';  
        var chunks=[];  //存储读取的结果集合
        var length=0; 
        //使用缓存区
        for(var i=0,size=rData.length;i<size;i++){  
            var record=rData[i];  
            var rate1=record['LTE_无线利用率(新)(%)'];  
            var rate2=record['LTE_上行PRB平均利用率(新)(%)'];  
            var rate3=record['LTE_下行PRB平均利用率(新)(%)'];  
              
            var value=rate1+newLine+rate2+newLine+rate3+newLine;  
            var buffer=new Buffer(value);  
            chunks.push(buffer);  
            length+=buffer.length;  
        } 
        var resultBuffer=new Buffer(length);  
        for(var i=0,size=chunks.length,pos=0;i<size;i++){  
            chunks[i].copy(resultBuffer,pos);  //copy缓冲区，pos为copy对象此次copy起始位置
            pos+=chunks[i].length;  
        } 
        return resultBuffer;
    }
    function rate2(rData,dataline){
      for(var i=0;i<rData.length;i++){
            //console.log(typeof rData[i]+'    '+i);
            rData[i]['LTE_无线利用率相关性()'] = dataline[i*3].split(',').map(function(item,index,array){return parseFloat(item);});
            rData[i]['LTE_上行PRB平均利用率相关性()'] = dataline[i*3+1].split(',').map(function(item,index,array){return parseFloat(item);});
            rData[i]['LTE_下行PRB平均利用率相关性()'] = dataline[i*3+2].split(',').map(function(item,index,array){return parseFloat(item);});
          }
          return rData;
    }
    //var resultBuffer=rate1(rData);
    return reFile(rData,[],'rate.exe',rate1,rate2);
}

//干扰分析
function MATLAB_interference(data){
    var rData = data.station1;
    var data2 = data.station2;
    console.log('MATLAB_interference  '+rData.length+' '+data2.length);
    function interference1(rData,data2){
      var tab='\t';  
      var newLine='\r\n';  
      var chunks=[];  //存储读取的结果集合
      var length=0;  
      var props=['站高(m)','DownTilt(度)','Azimuth(度)','载波频点(MHz)','基站发射功率(dBm)'] ;
      //使用缓存区
      for(var i=0;i<rData.length;i++){  
          rData[i]['rePoints'] = data2[i][0]['geom']['coordinates']; 
          var value1 = rData[i].geom.coordinates[0]+tab+rData[i].geom.coordinates[1];
          var value2 = data2[i][0].geom.coordinates[0]+tab+data2[i][0].geom.coordinates[1];
          for(var j=0;j<props.length;j++){
            value1+=tab+rData[i][props[j]];
            value2+=tab+data2[i][0][props[j]];
          }
          value1+=tab+systemChange(rData[i]['制式类型']);
          value2+=tab+systemChange(data2[i][0]['制式类型']);
          var value=value1+tab+value2+newLine;  
          var buffer=new Buffer(value);  
          chunks.push(buffer);  
          length+=buffer.length;  
      }  
      var resultBuffer=new Buffer(length);  
      for(var i=0,size=chunks.length,pos=0;i<size;i++){  
          chunks[i].copy(resultBuffer,pos);  //copy缓冲区，pos为copy对象此次copy起始位置
          pos+=chunks[i].length;  
      }  
      return resultBuffer;
    } 
    function interference2(rData,dataline){
      for(var i=0;i<rData.length;i++){
        //console.log(typeof rData[i]+'    '+i);
        rData[i]['干扰系数'] = dataline[i];
      }
      return rData;
    }
    return reFile(rData,data2,'interfree.exe',interference1,interference2);
}


//网络布局分析
function MATLAB_layout(data){
    var rData = data.station1;
    var data2 = data.station2;
    console.log('MATLAB_layout  '+rData.length+' '+data2.length);
    function layout1(rData,data2){
      var tab='\t';  
      var newLine='\r\n';  
      var chunks=[];  //存储读取的结果集合
      var length=0;  
      //使用缓存区
      for(var i=0;i<rData.length;i++){   
          //console.log(data2[i].length);
          var value1 = rData[i].geom.coordinates[0]+tab+rData[i].geom.coordinates[1]+tab+rData[i]['站高(m)'];
          var value2 = '';
          rData[i]['rePoints']=[];
          for(var j=0;j<data2[i].length;j++){
            value2+=data2[i][j].geom.coordinates[0]+tab+data2[i][j].geom.coordinates[1]+tab;
            //rData[i]['rePoints'] = rData[i]['rePoints'].concat(data2[i][j].geom.coordinates);
          }
          var value=value1+tab+value2+newLine;  
          var buffer=new Buffer(value);  
          chunks.push(buffer);  
          length+=buffer.length;  
      }  
      var resultBuffer=new Buffer(length);  
      for(var i=0,size=chunks.length,pos=0;i<size;i++){  
          chunks[i].copy(resultBuffer,pos);  //copy缓冲区，pos为copy对象此次copy起始位置
          pos+=chunks[i].length;  
      } 
      return resultBuffer;
    }
    function layout2(rData,dataline){
      for(var i=0;i<rData.length;i++){
        //console.log(typeof rData[i]+'    '+i);
        var line = dataline[i].split(',');
        rData[i]['小区半径'] = line[0];
        rData[i]['基站布局'] = line[1];
        rData[i]['基站站高'] = line[2];
        rData[i]['rePoints'] = line.slice(3);
      }
      return rData;
    }
    return reFile(rData,data2,'layout.exe',layout1,layout2);
}

//网络布局分析
function MATLAB_hotMap(data){
    var rData = data.station1;
    var data2 = data.station2;
    console.log('MATLAB_hotMap  '+rData.length+' '+data2.length);
    function hotMap1(rData,data2){
        var tab='\t';  
        var newLine='\r\n';  
        var chunks=[];  //存储读取的结果集合
        var length=0;  //写入文件总字符串长度
        var props=['站高(m)','DownTilt(度)','Azimuth(度)','载波频点(MHz)','基站发射功率(dBm)'] ;
        //使用缓存区
        //使用了nodejs中的buffer类
        for(var i=0,length1=rData.length;i<length1;i++){   
            var value1 = rData[i][0]+tab+rData[i][1];
            var value2 = '';
            for(var j=0,length2=data2[i].length;j<length2;j++){
              //console.log(data2[i][j].geom.coordinates[0]);
              value2 += data2[i][j].geom.coordinates[0]+tab+data2[i][j].geom.coordinates[1]+tab;
              for(var k=0;k<props.length;k++){
                value2+=data2[i][j][props[k]]+tab;
              }
            }
            var value=value1+tab+value2+newLine;  
            var buffer=new Buffer(value);  
            chunks.push(buffer);  
            length+=buffer.length;  
        }  
        var resultBuffer=new Buffer(length);  
        for(var i=0,size=chunks.length,pos=0;i<size;i++){  
            chunks[i].copy(resultBuffer,pos);  //copy缓冲区，pos为copy对象此次copy起始位置
            pos+=chunks[i].length;  
        } 
        return resultBuffer;
    }
    function hotMap2(rData,dataline){
        for(var i=0;i<rData.length;i++){
            //console.log(typeof rData[i]+'    '+i);
            rData[i].push(dataline[i]);
        }
        return rData;
    }
    return reFile(rData,data2,'hotMap.exe',hotMap1,hotMap2);
}

function reFile(rData,data2,exeName,callback1,callback2){
    var defer = q.defer();
    var resultBuffer = callback1(rData,data2||[]);//获取写入字符串
    var t1 = new Date().getTime();
    //多次异步嵌套
    fs.writeFile('input.txt',resultBuffer,function(err){  
        if(err) throw err;  
        console.log('write into TEXT');
        console.log(Date.now()-t1);
        //子进程设置
        var options = { 
            encoding: 'utf8',
            timeout:0,
            maxBuffer: 200 * 1024,
            killSignal: 'SIGTERM',
            setsid: false,
            cwd: null,
            env: null 
        };
/*        for(var i=0;i<rData.length;i++){
            //console.log(typeof rData[i]+'    '+i);
            rData[i].push(100);
        }
        defer.resolve(rData);*/
        //子进程调用
        exec(exeName,options,function(error,stdout,stderr){
            console.log('matlab success');
            console.log(Date.now()-t1);
            fs.readFile('output.txt','utf-8',function(err,data){
                if(err) throw err; 
                console.log('read success');
                console.log(Date.now()-t1);
                var dataline = data.split("\r\n");//数据按行分组
                //console.log(dataline);
                rData = callback2(rData,dataline);
                defer.resolve(rData);
            });
        });
    });
    return defer.promise;
}

function systemChange(system){
    switch(system){
        case 'LTE':
            return '1';
            break;
        case 'GSM':
            return '2';
            break;
        default:
            return '0';
    }
}

//function 
module.exports = {
    MATLAB_rate : MATLAB_rate,
    MATLAB_interference : MATLAB_interference,
    MATLAB_layout : MATLAB_layout,
    MATLAB_hotMap : MATLAB_hotMap
};

