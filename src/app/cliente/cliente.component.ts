import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
})
export class ClienteComponent implements OnInit {

  clientes: Cliente[];
  paginator: any;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute) { }
  
  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params =>{
      
      let page:number= +params.get('page');

      if(!page)
        page=0;

      this.clienteService.getClientes(page).subscribe(
        response => {
          this.clientes = response.content;
          this.paginator = response;
        } 
      );

    });
   
  }

  delete(cliente: Cliente): void{

    swal({
      title: 'Estas Seguro?',
      text: `Estas seguro de eliminar al cliente: ${cliente.nombre} ${cliente.apellido} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminalo',
      cancelButtonText: 'No, cancela!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli!== cliente)
            swal(
              'Eliminado!',
              `El cliente: ${cliente.nombre} fue eliminado¡.`,
              'success'
            )
          }
        )
        
      } 
    })


  }

}
