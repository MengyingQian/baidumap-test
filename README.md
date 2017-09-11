# jingruoyu

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## map-rectangle

前端发送数据：

	{
        startTime: that.formData.dateRange[0],//开始时间
        endTime: that.formData.dateRange[1],//截止时间
        corporation: that.formData.corporation,//运营商
        system: that.formData.system,//基站类型
        service: that.formData.service,//业务类型
    }

前端接受数据：

	code: 0,
	data: [
		//每个栅格数据
		{
			//该栅格数据
			startlng: 
			endlng:
			//等等
			//栅格内每个点信息
			points: [
				{
					lng:
					lat:
					//等等
				}
			]
		}
	],
	msg: 'success'