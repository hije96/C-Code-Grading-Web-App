import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import{InfoService} from '../info.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-detail',
  templateUrl: './admin-detail.component.html',
  styleUrls: ['./admin-detail.component.css'],
  providers: [InfoService]
})
export class AdminDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private Infoservice : InfoService,
    private router: Router
  ) { }

  task_id;
  submit_info=[];

  ngOnInit() {
    if(!sessionStorage.getItem('admin')){
      alert("로그인을 해주세요")
      this.router.navigateByUrl('/admin/login');
    }
  this.route.params.subscribe(params => {
    //console.log(params['id']);
      this.task_id=params['id'];

      this.Infoservice.getSubmited({task_id:this.task_id}).subscribe(
        data =>{
          if(data!="no"){
            this.submit_info=data;
          }
        }
       )
    })
  }
  parse(d){
    if(d){
      var day= new Date(d);
      return day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate()+" "+day.getHours() + ":" + day.getMinutes() + ":" + day.getSeconds()
    }
  }
}
