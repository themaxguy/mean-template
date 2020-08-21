import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';

const modules = [
  AppRoutingModule,
  BrowserAnimationsModule,
  BrowserModule,
  SharedModule,
];

@NgModule({
  declarations: [AppComponent],
  imports: [...modules],
  exports: [...modules],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
