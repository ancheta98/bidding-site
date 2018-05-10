import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  newUser: any;
  errors:any;
  constructor(private _httpService: HttpService, private _router: Router, private _route: ActivatedRoute) {
    this.newUser= {username:"", email:"",password:"",}
    this.errors =[];
   }

  ngOnInit() {
  }

  addErrors(errors){
    for (var key in errors){
      this.errors.push(errors[key].message);
      console.log(this.errors);
    }
  }

  createUser(newUser){
    this._httpService.postUser(this.newUser)
    .subscribe((data:any)=>{
      this.errors = [];
      if(data.errors){
        this.addErrors(data.errors)
      }else{
        this._router.navigate(['/dash']);
      }
    })
  }

}
