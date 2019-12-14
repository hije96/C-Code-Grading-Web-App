import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import{InfoService} from '../info.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css'],
  providers: [InfoService]
})
export class SubmitComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private Infoservice : InfoService,
    private router: Router
  ) { }

  imagePath="../assets/student.png"
  student_id;

  id;
  connection;
  code;
  task;
  title;

  iscompiled=false;

  compiledFile;
  filename;

  information="1.코드 입력 <br> 2.컴파일 버튼 클릭 <br> 3. 체점하기 버튼 클릭";
  result="";

  ngOnInit() {
    if(!sessionStorage.getItem('login')){
      alert("로그인을 해주세요")
      this.router.navigateByUrl('/login');
    }
    this.student_id=JSON.parse(sessionStorage.getItem('login')).id
    this.route.params.subscribe(params => {
       //console.log(JSON.parse(sessionStorage.getItem('login')).id);
       this.id=params['id'];

       this.connection=this.Infoservice.getTask({task_id:this.id}).subscribe(
           data =>{
             this.task=data[0];
             this.title=data[0].title
           }
       )
    })
  }
  btnClick2(){
    if(this.iscompiled){
      this.iscompiled=false
      this.result="ING"
      //console.log(this.code);
      try{
      this.Infoservice.submitCode({filename:this.filename,file:this.compiledFile,task_id:this.id,id:JSON.parse(sessionStorage.getItem('login')).id})
      .subscribe(
          data =>{
            if(data=="ok"){
              this.result="PASS"
              this.information="마지막으로 조교님을 불러 검사받으세요."
              alert("성공")
              //this.router.navigateByUrl('/main');
            }else if(data=="dbErr"){
              this.result="FAIL"
              this.information="데이터베이스 insert 에러 <br> 조교에게 문의해 주세요."
              alert("실패")
            }else if(data=="compileErr"){
              this.result="FAIL"
              this.information="컴파일 에러 <br> 컴파일 후 다시 시도해 주세요"
              alert("실패")
            }else{
              this.result="FAIL"
              this.information="틀린 테스트 케이스: <br>"+data
              alert("실패")
            }
          },
        err =>{
          this.result="FAIL"
          this.information="서버 접속 에러 <br> 네트워크를 확인해 주세요"
        }

      )
      }
      catch(e){
        console.log("error")
      }
    }else{
      alert("컴파일 해주세요.")
    }
  }
  btnClick1(){
    this.result="COMPILE";
    this.information="1.코드 입력 <br> 2.컴파일 버튼 클릭 <br> 3. 체점하기 버튼 클릭";
    this.Infoservice.compile({code:this.code,task_id:this.id,id:JSON.parse(sessionStorage.getItem('login')).id}).subscribe(
        data =>{
          //console.log(data)
          if(data.result=="no"){
            alert("컴파일 실패")

            var err=data.err;
            while(err.indexOf("\n")!=-1){
              err=err.replace("\n","<br>");
            }
            this.information="컴파일 에러: <br>"+err;
            this.result="";
            //this.router.navigateByUrl('/main');
          }else{
            this.compiledFile=data.compiled;
            this.filename=data.filename;
            this.iscompiled=true;
            this.information="1.코드 입력 <br> 2.컴파일 버튼 클릭 <br> 3. 체점하기 버튼 클릭";
            this.result="";
            alert("컴파일 성공")
          }
        },
        err =>{
          this.result="FAIL"
          this.information="서버 접속 에러 <br> 네트워크를 확인해 주세요"
          alert("컴파일 실패")
        }
    )
  }

}
