import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-input-confirm-dialog',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './input-confirm-dialog.component.html',
  styleUrls: ['./input-confirm-dialog.component.css']
})
export class InputConfirmDialogComponent {

  public data = inject(MAT_DIALOG_DATA);

  constructor(
    public dialogRef: MatDialogRef<InputConfirmDialogComponent>,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
