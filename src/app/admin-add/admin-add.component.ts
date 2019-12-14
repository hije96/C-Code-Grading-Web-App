import { Component, OnInit } from '@angular/core';
import{InfoService} from '../info.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-add',
  templateUrl: './admin-add.component.html',
  styleUrls: ['./admin-add.component.css'],
  providers: [InfoService]
})
export class AdminAddComponent implements OnInit {

  constructor(
    private Infoservice : InfoService,
    private router: Router
  ) { }
  
  task_id;
  task_no;
  title;
  deadline=null;
  content;

  ngOnInit() {
    if(!sessionStorage.getItem('admin')){
      alert("로그인을 해주세요")
      this.router.navigateByUrl('/admin/login');
    }
  }
  btnClick(){
    //console.log(this.task_no,this.title,this.deadline,this.content);
    this.Infoservice
    .addTask({task_no:this.task_no, task_id:this.task_id, title:this.title, deadline:this.deadline,content:this.content})
    .subscribe(
        data =>{
          if(data=="ok"){
            alert("성공")
            this.router.navigateByUrl('/admin/main');
          }else{
            alert("실패")
          }
        }
      )
  }

}
