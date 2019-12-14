import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import{InfoService} from '../info.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  providers: [InfoService]
})
export class DetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private Infoservice : InfoService,
    private router: Router
  ) { }

  id;
  connection;
  //task=[{title:"",content:"",deadline:"",id:0}];
  title;content;deadline;task_id;

  ngOnInit() {
    //console.log(this.route.params);
    if(!sessionStorage.getItem('login')){
      alert("로그인을 해주세요")
      this.router.navigateByUrl('/login');
    }
    this.route.params.subscribe(params => {
       //console.log(params['id']);
       this.id=params['id'];

       this.connection=this.Infoservice.getTask({task_id:this.id}).subscribe(
           data =>{
             //console.log(data);
             //this.task=data;
             this.task_id=data[0].task_id;
             this.title=data[0].title;
             this.content=data[0].content;
             this.deadline=data[0].deadline;

             while(this.content.indexOf("\n")!=-1){
               this.content=this.content.replace("\n","<br>");
             }
             //console.log(this.content)
           }
       )
    })
  }
  // getInfo(){
  //
  // }

}
