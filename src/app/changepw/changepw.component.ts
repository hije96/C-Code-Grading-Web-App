import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import{InfoService} from '../info.service';

@Component({
  selector: 'app-changepw',
  templateUrl: './changepw.component.html',
  styleUrls: ['./changepw.component.css'],
  providers: [InfoService]
})
export class ChangepwComponent implements OnInit {

  constructor(
    private Infoservice : InfoService,
    private router: Router
  ) { }

  imagePath="../assets/student.png"
  student_id;

  pw="";check="";

  pinfo="";cinfo="";

  ngOnInit() {
    //console.log(sessionStorage.getItem('login'));
    if(!sessionStorage.getItem('login')){
      alert("로그인을 해주세요")
      this.router.navigateByUrl('/login');
    }
    this.student_id=JSON.parse(sessionStorage.getItem('login')).id
  }
  onPW(){
    //console.log(this.pw)
    if(this.pw.length>8){
      this.pinfo="*최대 8글자";
    }else{
      this.pinfo="";
    }
  }
  onCheck(){
    if(this.pw!=this.check){
      this.cinfo="*비밀번호가 일치하지 않습니다."
    }else{
      this.cinfo="";
    }
  }
  btnClick(){
    //console.log("수정")
    if(this.pw!="" && this.check!="" && this.cinfo=="" && this.pinfo==""){
      this.Infoservice.changePW({id:this.student_id, pw:this.pw}).subscribe(
          data =>{
              if(data=="ok"){
                alert("성공적으로 변경되었습니다.")
                this.router.navigateByUrl('/main');
              }else{
                alert("실패")
              }
          }
      )
    }
  }

}
