import { Component, OnInit } from '@angular/core';
import{InfoService} from '../info.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [InfoService]
})
export class MainComponent implements OnInit {

  constructor(
    private Infoservice : InfoService,
    private router: Router
  ) { }
  imagePath="../assets/student.png"
  connection;
  //test=["A","B","C"];
  tasks;
  student_id;

  ngOnInit() {
    //console.log(sessionStorage.getItem('login'));
    if(!sessionStorage.getItem('login')){
      alert("로그인을 해주세요")
      this.router.navigateByUrl('/login');
    }
    this.student_id=JSON.parse(sessionStorage.getItem('login')).id
    this.connection=this.Infoservice.getTasks({id:JSON.parse(sessionStorage.getItem('login')).id}).subscribe(
        data =>{
            //console.log(data);
            this.tasks=data;
        }
    )
  }
}
