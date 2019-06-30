import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/Auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelEvent: EventEmitter<any> = new EventEmitter();
  model: any = {};
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  Register() {

   this.authService.Register(this.model).subscribe(() => {
     console.log('registered');
   },
   error => {
     return console.log(error);
   })
  }
  Cancel() {
   this. model = {};
   this.cancelEvent.emit();
  }

}
