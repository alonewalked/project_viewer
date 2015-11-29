npm install

see demo
nw test.nw

引入
```
var basic = require('./index');
```

修改数据库连接地址
```
index.js
/* 
  @param {String} url 数据库连接地址，默认ife; e.g. mongodb://10.1.30.43:27017/tj
*/ 
app.start('dbpath',function(data){
    console.log(JSON.stringify(data)); 
});

```
登录
首次登陆会自动创建用户
```
basic.users.login({
    name:'',
    password:'',
    [email:'']      // optional
},function(data){
    console.log(JSON.stringify(data));
});
```

instance.js
```
getServerConfig
setCurrentUser
getCurrentUserName
getCurrentUserid
getPassword
isLoggedin 
```


退出程序
```
basic.app.exit();
```

basic.app
basic.svn
basic.projects
basic.branchs
basic.users

分页获取project
```
projects.getByQuery({},{
    sort:'-launchdate', // 按创建时间排序
    no:2,               // 请求第2页数据
    pagesize:2,         // 每页2条数据
    ref:['ownerid']     // 需要获取外键关联表的字段
},function(data){
    callback(data); 
});
```

接口支持promise

```
var f1 = function(){..};
var f2 = function(){..};
var doerror = function(){..};
projects.create()
.then(f1,doerror)
.then(f2,doerror);
```


//详见目录apis/ 下的文件提供的方法


