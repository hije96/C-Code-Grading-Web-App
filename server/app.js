var express = require('express');
let app = require('express')();
let http = require('http').Server(app);
var mysql = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var path = require('path');
var connection;
var kill  = require('tree-kill');

//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// app.get('/', (req, res) => {
//     var info;
//
//       res.json("get")
// });
app.post('/login', (req, res) => {
  var query='SELECT * FROM student WHERE id= '+req.body.id+' AND pw= \''+req.body.pw+'\'';
  //console.log(query);
  connection.query(query,function(err,rows,fields){
    if(err) {
      //throw err;
      res.json("no");
    }else{
      if(rows.length==0){
        res.json("no");
      }else{
        res.json("ok");
      }
    }
  })
})
app.post('/changePW', (req, res) => {
  var query="update student set pw=\'"+req.body.pw+"\' WHERE id= "+req.body.id;
  //console.log(query);
  connection.query(query,function(err,rows,fields){
    if(err) {
      //throw err;
      res.json("no");
    }else{
      res.json("ok");
    }
  })
})
app.post('/getTasks', (req, res) => {

  // SELECT a.task_id, a.task_no, a.title, sum(b.pass)
  // FROM task a left join summited b on a.task_id=b.task_id
  // where b.id=2015125068 && a.task_use=true
  // group by task_id

  var query='SELECT a.task_id, a.task_no, a.title, b.pass '
  +'FROM task a left join '
  +'(SELECT task_id, if(sum(pass)>0 ,true,false) as pass '
  +'FROM project.submited '
  +'where id='+req.body.id+' '
  +'group by task_id) b on a.task_id=b.task_id '
  +'where a.task_use=true';

  // var query='SELECT a.task_id, a.task_no, a.title, sum(b.pass) '
  // +'FROM task a left join summited b on a.task_id=b.task_id '
  // +'where b.id='+req.body.id+' && a.task_use=true '
  // +'group by task_id';
  //console.log(query);

  connection.query(query,function(err,rows,fields){
    if(err) {
      //throw err;
      res.json("no");
    }else{
      res.json(rows);
    }
  })
})
app.post('/getTask', (req, res) => {
  var query='SELECT * FROM task WHERE task_id= '+req.body.task_id;
  //console.log(query);
  connection.query(query,function(err,rows,fields){
    if(err) {
      //throw err;
      res.json("no");
    }else{
      res.json(rows);
    }
  })
})
app.post('/getSubmited', (req, res) => {
  var query='SELECT id, pass, min(submit_time) as submit_time FROM submited WHERE task_id= '+req.body.task_id+' and pass=1 group by id order by id ASC';
  //console.log(query);
  connection.query(query,function(err,rows,fields){
    if(err) {
      //throw err;
      res.json("no");
    }else{
      res.json(rows);
    }
  })
})
app.post('/compile', (req, res) => {
  var num=0;
  var base='task'+req.body.task_id+'/student/'+req.body.id;
  var studentFile=base;
  while(fs.existsSync(studentFile+'.c')){
    num+=1;
    studentFile=base+'_'+num;
  }
  fs.writeFileSync(studentFile+'.c', req.body.code ,'utf8');
  var compiledFile="n"+req.body.task_id+req.body.id+num+".exe";

  var child = exec("gcc "+studentFile+".c -o "+compiledFile+" -lm", function (error, stdout, stderr) { // gcc 'c파일' -o '실행파일명'
      if (error) {

        //console.log(error.message)
        res.json({result:"no",err:error.message});
      }else{
        res.json({result:"ok",compiled:compiledFile,filename:studentFile});
      }
  });

});
app.post('/submitCode', (req, res) => {
  function execorrect(n){ // 체점코드 실행 메소드

    var temp=[];

    if(fs.existsSync("t"+req.body.task_id+".txt")) {
      sc = spawn("./"+compiledFile); // 실행 방금 컴파일 한거
      sc.stdin.write(stuInput[n]); //my command takes a markdown string...
      sc.stdin.end();
    }else{
      sc = spawn("./"+compiledFile,stuInput[n].split(" ")); // 실행 방금 컴파일 한거
      sc.stdin.end();
    }

    sc.stdout.on('data', function(data) {
      var d=""+data;
      temp.push(d);
	console.log(d);
      if(d.indexOf("computer")!=-1){
        var dlist=d.split("\n")
        for(var i=0; i<dlist.length; i++){
          if(dlist[i].indexOf("computer")!=-1){
            //console.log(dlist[i].split(":")[1])
            ansInput[n]=ansInput[n].replace("RANDOM",""+parseInt(dlist[i].split(":")[1]));
          }
        }
      }
    });
    sc.stderr.on('data', function(data) {
      console.log(data);
      clearTimeout(timer);
      return res.json("err");
    });

    sc.on('exit', function(code) {
      if(timeout){
	kill(sc.pid);
        res.json("time over")
      }else{
        stuOutput.push(temp)
        if((stuInput.length)!==stuOutput.length){
          return execorrect(n+1);
        }else{
          return execheck(0);
        }
      }
    });
  }
  function execheck(n){ // 정답코드 실행 메소드
    //console.log(n);
    var temp=[];
    if(fs.existsSync(compiledFile)) {
      if(fs.existsSync("t"+req.body.task_id+".txt")) {
        var ls = spawn("./t"+req.body.task_id+".exe"); // 실행 '정답코드'-
        ls.stdin.write(ansInput[n]); //my command takes a markdown string...
        ls.stdin.end();
      }else{
        var ls = spawn("./t"+req.body.task_id+".exe",ansInput[n].split(" ")); // 실행 '정답코드'-
        ls.stdin.end();
      }
      ls.stdout.on('data', function(data) {
        let b = ""+data;
        temp.push(b);
        //console.log(b)
      });
      ls.stderr.on('data', function(data) {
        clearTimeout(timer);
        //console.log(data)
        return res.json("err");
      });
      ls.on('exit', function(code) {
        //console.log(n);
	console.log(temp);
	//console.log(temp.length);
	console.log(req.body.id,stuOutput[n]);
        if(temp.length==stuOutput[n].length){
	  //console.log("A");
          for(var i in temp){
            for(var k=0;k<temp[i].length;k++){
              temp[i]=temp[i].replace('\n','');
              temp[i]=temp[i].replace('\r','');
              temp[i]=temp[i].replace(' ','');
            }
            var befo=stuOutput[n][i];
            for(var k=0;k<stuOutput[n][i].length;k++){
              stuOutput[n][i]=stuOutput[n][i].replace('\n','');
              stuOutput[n][i]=stuOutput[n][i].replace('\r','');
              stuOutput[n][i]=stuOutput[n][i].replace(' ','');
            }
            console.log("ans : "+temp[i])
            console.log("stu : "+stuOutput[n][i])
            if(stuOutput[n][i]!=temp[i]){
              //비교 틀려서 실패
              iswrong=true;
            }
          }
          if(n==stuOutput.length-1 && iswrong==false){
            //모든 경우 다 맞아 성공
            //console.log(stuInput.length,n)
            clearTimeout(timer);
            fs.unlink(compiledFile,function(err){
              if( err ){
                console.log(err)
              }
            });
            connection.query(tquery,function(err,rows,fields){
              if(err) {
                return res.json("dbErr");
              }else{
                return res.json("ok");
              }
            })
          }else{
            if(iswrong){
              clearTimeout(timer);
              fs.unlink(compiledFile,function(err){
                if( err ){
                  console.log(err)
                }
              });
              connection.query(fquery,function(err,rows,fields){
                if(err) {
                  return res.json("dbErr");
                }else{
                  for(var k=0;k<befo.length;k++){
                    befo=befo.replace('\n','<br>');
                  }
                  return res.json(stuInput[n]+"<br>"+befo);
                }
              })
            }else{
              return execheck(n+1);
            }
          }
        }else{
          iswrong=true;
        }
      });
    }else{
      //컴파일 파일 없어서 실패
      clearTimeout(timer);
      return res.json("compileErr");
    }
  }



  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  var fquery="INSERT INTO submited(id,task_id,pass,task_code,submit_time) values ("
  +req.body.id+", "+req.body.task_id+", false, \'"+req.body.filename+".c\', \'"+dateTime+"\')";
  var tquery="INSERT INTO submited(id,task_id,pass,task_code,submit_time) values ("
  +req.body.id+", "+req.body.task_id+", true, \'"+req.body.filename+".c\', \'"+dateTime+"\')";
  //console.log(tquery);

  var compiledFile=req.body.file;

  if(fs.existsSync("t"+req.body.task_id+".txt")) {
    var stuInput = fs.readFileSync("t"+req.body.task_id+".txt", 'utf8').split('/');
  }else{
    var stuInput = fs.readFileSync("t"+req.body.task_id+"param.txt", 'utf8').split('/');
  }

  if(fs.existsSync("t"+req.body.task_id+"ans.txt")) {
    var ansInput =fs.readFileSync("t"+req.body.task_id+"ans.txt", 'utf8').split('/');
  }else{
    var ansInput=stuInput;
  }
  //console.log(stuInput);
  //console.log(ansInput);

  const stuOutput = []; // 정답 배열
  var sc;
  var timeout=false;
  var iswrong=false;
  var timer = setTimeout(function() {
    sc.stdin.pause();
    sc.kill();
    timeout=true;
  }, 2000);
  execorrect(0);

})
app.post('/adminLogin', (req, res) => {
  var query='SELECT * FROM admin WHERE id= '+req.body.id+' AND pw= \''+req.body.pw+'\'';
  //console.log(query);
  connection.query(query,function(err,rows,fields){
    if(err) {
      //throw err;
      res.json("no");
    }else{
      if(rows.length==0){
        res.json("no");
      }else{
        res.json("ok");
      }
    }
  })
})
app.post('/getAllTasks', (req, res) => {

  var query='SELECT * FROM task where task_use=1';
  //console.log(query);

  connection.query(query,function(err,rows,fields){
    if(err) {
      //throw err;
      res.json("no");
    }else{
      res.json(rows);
    }
  })
})
app.post('/addTask', (req, res) => {
  // var query='insert into task (task_no, content, deadline, title, task_id) '
  // +'values ('+req.body.task_no+', \''+req.body.content+'\' , \''+req.body.deadline+'\' ,\''+req.body.title +'\' ,\''+req.body.task_id+'\')'
  var query='insert into task (task_no, title, task_id) '
  +'values ('+req.body.task_no+', \''+req.body.title +'\' ,\''+req.body.task_id+'\')'
  console.log(query);
  connection.query(query,function(err,rows,fields){
    if(err) {
      //throw err;
      res.json("no");
    }else{
      // if (!fs.existsSync('task'+req.body.task_id)){
      //     fs.mkdirSync('task'+req.body.task_id+'/answer');
      //     fs.mkdirSync('task'+req.body.task_id+'/student');
      // }
      //fs.mkdirSync('task'+req.body.task_id');
      fs.mkdirSync('task'+req.body.task_id);
      fs.mkdirSync('task'+req.body.task_id+'/answer');
      fs.mkdirSync('task'+req.body.task_id+'/student');
      res.json("ok");
      //fs.mkdirSync('task'+req.body.task_id+'/student');
    }
  })
})

app.use(express.static(path.resolve(__dirname, '../dist'))); //1
app.get('*', function (req, res) { //2
  var indexFile = path.resolve(__dirname,'../dist/index.html');
  res.sendFile(indexFile);
});

http.listen(8000, () => {
  console.log('started on port 8000');
  connection = mysql.createConnection({
    host:'52.78.114.138',
    user:'root',
    password:'09250813',
    database:'project'
  });

  connection.connect();
});
