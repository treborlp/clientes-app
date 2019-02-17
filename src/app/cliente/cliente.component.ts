import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import {ModalService} from './detalle/modal.service';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
})
export class ClienteComponent implements OnInit {

  clientes: Cliente[];
  paginator: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService, 
              private activatedRoute: ActivatedRoute,
              private modalService: ModalService) { }
  
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
   
    this.modalService.notificarUpload.subscribe(cliente=>{
    this.clientes = this.clientes.map(clienteOriginal=>{
        if(cliente.id == clienteOriginal.id ){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
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

  abrirModal(cliente: Cliente){
    this.clienteSeleccionado =cliente;
    this.modalService.abrirModal();
  }

}
