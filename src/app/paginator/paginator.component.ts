import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {


  @Input() paginator: any;

  paginas: number[];

  desde: number;
  hasta: number;

  constructor() { }

    
  
  ngOnChanges(){
    if(this.paginator.totalPages>5){
      this.desde = Math.min(Math.max(1, this.paginator.number-4), this.paginator.totalPages-5);
      this.hasta = Math.max(Math.min(this.paginator.totalPages, this.paginator.number +4), 6);
      
      this.paginas = new Array(this.hasta-this.desde+1).fill(0).map((_valor, indice)  => indice+this.desde );

    }else{
      this.paginas = new Array(this.paginator.totalPages).fill(0).map((_valor, indice)  => indice+1 );
    }
  }

  ngOnInit() {
    
  }

}
