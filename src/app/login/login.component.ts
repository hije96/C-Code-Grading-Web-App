import { Component, OnInit } from '@angular/core';
import{InfoService} from '../info.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [InfoService]
})
export class LoginComponent implements OnInit {

  id : number;
  pw : String;

  connection;

  constructor(
    private Infoservice : InfoService,
    private router: Router
  ) { }
  imagePath="../assets/student.png"

  ngOnInit() {
    //console.log(sessionStorage.getItem('login'));
    if(sessionStorage.getItem('login')){
      this.router.navigateByUrl('/main');
    }
    //this.btnClick();
  }
  btnClick(){
    //console.log("A")
    this.connection=this.Infoservice.login({id:this.id, pw:this.pw}).subscribe(
        data =>{
            if(data=="ok"){
              sessionStorage.setItem('login', JSON.stringify({id:this.id}));
              //console.log(sessionStorage.getItem('login'));
              this.router.navigateByUrl('/main');
            }else{
              alert("일치하는 정보가 없습니다.")
            }
        }
    )

  }

}
