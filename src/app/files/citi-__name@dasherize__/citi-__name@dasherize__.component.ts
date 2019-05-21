import { Component, OnInit } from '@angular/core';

@Component({
  selector: '<%=dasherize(name)%>',
  templateUrl: './citi-<%= dasherize(name) %>.component.html',
  styleUrls: ['./citi-<%= dasherize(name) %>.component.css']
})
export class Citi<%= classify(name) %>Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}