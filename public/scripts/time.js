function changeTime(time){
  var year = Number(time.split(" ")[0].split("/")[0]);
  var month = Number(time.split(" ")[0].split("/")[1]);
  var day = Number(time.split(" ")[0].split("/")[2]);
  var hour = Number(time.split(" ")[1].split(":")[0]); 
  //年、月、日、时的递增
  hour++;
  if(hour===24){
    day = day + 1;
    hour = 0 ;
  }
  switch(month){
    case 1:case 3:case 5:case 7:case 8:case 10:case 12:
      if(day===32){
        month++;
        day = 1;
      }
      break;
    case 2:
      if((year%4===0)&&(year%100!=0)||(year%400==0)){
        if(day===30){
          month++;
          day = 1;
        }
      }
      else{
        if(day===29){
          month++;
          day = 1;
        }
      }
      break;
    default:
      if(day===31){
          month++;
          day = 1;
      }
  }
  if(month===13){
          year++;
          month = 1;
  }
  //拼接时间字符串
  time = year.toString();
  if(month<10)
    time = time + '/0' + month;
  else
    time = time + '/' + month; 
  if(day<10)
    time = time + '/0' + day;
  else
    time = time + '/' + day;
  if(hour<10)
    time = time + ' 0' + hour+':00';
  else
    time = time + ' ' + hour+':00';
  //console.log(time);
  return time;
}

function checkDate(date){
  var re1 = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
  var re2 = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
  var re3 = /^\d{4}\.\d{1,2}\.\d{1,2}$/;
  //时间格式整理
  switch(true){
    case re1.test(date):
      date = date.split(/\-/).join('/');
      break;
    case re2.test(date):
      break;
    case re3.test(date):
      date = date.split(/\./).join('/');
      break;
    default:
      throw '输入日期格式错误';
  }
  var re4 = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/
  var year = parseInt(re4.exec(date)[1]);
  var month = parseInt(re4.exec(date)[2]);
  var day = parseInt(re4.exec(date)[3]);
  var minDay = 1;
  var maxDay;
  switch(month){
    case 1:case 3:case 5:case 7:case 8:case 10:case 12:
      maxDay = 31;
      break;
    case 2:
      if((year%4===0)&&(year%100!=0)||(year%400==0)){
        maxDay = 29;
      }
      else{
        maxDay = 28;
      }
      break;
    default:
      maxDay = 30;
  }
  //console.log(month===7);
  //console.log(maxDay);
  if(year!=2016) throw '仅存在2016年数据';
  if(month<1||month>12) throw '月份设置错误';
  if(day<minDay||day>maxDay) throw '日期设置错误';
  date = year.toString();
  if(month<10)
    date = date + '/0' + month;
  else
    date = date + '/' + month; 
  if(day<10)
    date = date + '/0' + day;
  else
    date = date + '/' + day;
  //console.log(date);
  return date;
}

function checkHour(hour){
  if(parseInt(hour.split(/\:/)[0])>23 || parseInt(hour.split(/\:/)[1])>59) throw '时间设置错误';
  if(/^\d{1,2}\:\d{2}$/.test(hour)){
    if(/^\d{1}\:\d{2}$/.test(hour))
      hour = '0'+hour.split(/\:/)[0]+':00';
    else
      hour = hour.split(/\:/)[0]+':00';
  }
  else {
    throw '时间格式错误';
  }
  return hour;
}