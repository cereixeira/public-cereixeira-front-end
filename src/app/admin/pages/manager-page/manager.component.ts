import { Component, inject, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { User } from 'src/app/auth/interfaces/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent {

  // ------------ inject ------------
  private authService = inject(AuthService);

  // ------------ signal properties ------------
  public searchInput = signal<FormControl>(new FormControl(''));
  public users = signal<User[]>([]);
  public selectedUser = signal<User|null>(null);


  // ------------ methods ------------
  onSwapToken(){
    this.authService.swapTokenById(this.selectedUser()?.id);
  }

  searchUserMail() {
    const value: string = this.searchInput().value || '';

    this.authService.findUsersByMail( value )
      .subscribe( users => this.users.set(users) );
  }

  onSelectedOption( event: MatAutocompleteSelectedEvent ): void {
    if ( !event.option.value ) {
      this.selectedUser.set(null);
      return;
    }

    const user: User = event.option.value;
    this.searchInput.mutate(input => input.setValue(user.email) );

    this.selectedUser.set(user);
  }

}
