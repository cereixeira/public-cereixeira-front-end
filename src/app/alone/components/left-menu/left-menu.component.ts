import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { RouterModule } from '@angular/router';
import { RightMenuComponent } from '../right-menu/right-menu.component';

@Component({
  selector: 'app-left-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, RightMenuComponent],
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent {


@Input()
public header: string = '';

@Input()
public menuItems: any[] = [];

}
