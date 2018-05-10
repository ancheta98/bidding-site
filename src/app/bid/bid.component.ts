import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit {
  product: any;
  errors: any;
  id: String;

  constructor(private _httpService: HttpService, private _router: Router,private _route: ActivatedRoute) {
    this.product = {name: "", img: "", price: 0}
    // this.getOneProduct();
   }

  ngOnInit() {
    this._route.paramMap.subscribe((params)=>{
      this.id = params.get('id');
      this._httpService.serviceOneProduct(this.id)
      .subscribe((data: object)=>{
        this.product = data;
      })
    })
  }
  //need to get user that's in session to decrease their bids by one
  componentBid(){
    let id = this.product._id;
    let observable= this._httpService.serviceBidProduct(id,this.product);
    observable.subscribe((data:any)=>{
      console.log(data);
      this.errors = [];
      if (data.errors) {
        for (var key in data.errors) {
          this.errors.push(data.errors[key].message);
          console.log(this.errors);
        }
      } else {
        this._router.navigate(['/bid/'+id]);
        location.reload();
      }
    })
  }
}

