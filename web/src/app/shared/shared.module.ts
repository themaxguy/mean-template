import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpClientModule }   from '@angular/common/http';
import { FlexLayoutModule }   from '@angular/flex-layout';
import { FormsModule,
  ReactiveFormsModule }       from '@angular/forms';
import { MatCardModule }      from '@angular/material/card';
import { MatIconModule }      from '@angular/material/icon';
import { MatToolbarModule }   from '@angular/material/toolbar';
import { MatButtonModule }    from '@angular/material/button';
import { MatInputModule }     from '@angular/material/input';

const modules = [
  CommonModule,
  HttpClientModule,
  FlexLayoutModule,
  FormsModule,
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatInputModule,
  ReactiveFormsModule
]


@NgModule({
  declarations: [],
  imports: [...modules],
  exports: [...modules]
})
export class SharedModule { }
