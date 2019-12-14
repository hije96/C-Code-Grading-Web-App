import { Component, OnInit } from '@angular/core';
import{InfoService} from '../info.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  providers: [InfoService]
})
export class AdminLoginComponent implements OnInit {

  constructor(
    private Infoservice : InfoService,
    private router: Router
  ) { }
  imagePath="../assets/student.png"
  id : number;
  pw : String;

  connection;

  ngOnInit() {
    //console.log(sessionStorage.getItem('admin'));
    if(sessionStorage.getItem('admin')){
      this.router.navigateByUrl('/admin/main');
    }
  }
  btnClick(){
    //console.log("A")
    this.connection=this.Infoservice.adminLogin({id:this.id, pw:this.pw}).subscribe(
        data =>{
            if(data=="ok"){
              sessionStorage.setItem('admin', JSON.stringify({id:this.id}));
              //console.log(sessionStorage.getItem('admin'));
              this.router.navigateByUrl('/admin/main');
            }else{
              alert("일치하는 정보가 없습니다.")
            }
        }
    )

  }

}
