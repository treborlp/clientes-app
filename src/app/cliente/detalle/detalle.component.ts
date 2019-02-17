import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';
import swal from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;

  titulo: String = "Detalle del CLiente";
  private fotoSeleccionada: File;
  progreso:number = 0;

  constructor(private clienteService: ClienteService,
              private modalService: ModalService) { }

  ngOnInit() {

  }

  seleccionarFoto(event){
    
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);

    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      swal("Error upload: ","Archivo no valido","error");
      this.fotoSeleccionada = null;
    }
    
  }

  subirFoto(event){

    if(!this.fotoSeleccionada){
      swal("Error upload: ","Choise a image","error");
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(event =>{
        //this.cliente = cliente;
        if(event.type ===HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if(event.type ===HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          swal("Mensaje de subida",response.mensaje,"success");
        }

      });
    }
  
    }

    /* METODO SIN PROGRESSBAR
    if(!this.fotoSeleccionada){
      swal("Error upload: ","Choise a image","error");
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(cliente =>{
        this.cliente = cliente;
        swal("Mensaje de subida","La foto fue subida con exito","success");
      });
    }
    
    
    */

    
   cerrarModal(){
      this.modalService.cerrarModal();
      this.fotoSeleccionada = null;
      this.progreso = 0;
   }

  }


