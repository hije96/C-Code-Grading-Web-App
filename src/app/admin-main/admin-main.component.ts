import { Component, OnInit } from '@angular/core';
import{InfoService} from '../info.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css'],
  providers: [InfoService]
})
export class AdminMainComponent implements OnInit {

  constructor(
    private Infoservice : InfoService,
    private router: Router
  ) { }

  connection;
  tasks;

  ngOnInit() {
    if(!sessionStorage.getItem('admin')){
      alert("로그인을 해주세요")
      this.router.navigateByUrl('/admin/login');
    }
    this.connection=this.Infoservice.getAllTasks().subscribe(
        data =>{
            //console.log(data);
            this.tasks=data;
        }
    )
  }


}
