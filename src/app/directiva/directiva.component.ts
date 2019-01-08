import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent implements OnInit {

  cursos: string[]=['Java','JavaScript','Math','PHP','Spring','MySql'];
  habilitar: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  setList():void{
    this.habilitar = (this.habilitar==true)?false:true;
  }

}
