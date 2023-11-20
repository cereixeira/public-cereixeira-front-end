import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  public data = inject(MAT_DIALOG_DATA);
}
