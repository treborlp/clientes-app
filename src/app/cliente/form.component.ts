import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import {Router, ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  tittle : string = "Crear Cliente";

  private cliente: Cliente = new Cliente();

  constructor(private clienteService: ClienteService, private router: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente() 
  }

  public cargarCliente(): void{
    this.activateRoute.params.subscribe(params =>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente =cliente)
      }
    })
  }

  public create(): void{
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        swal("Nuevo CLiente",`Cliente ${cliente.nombre} fue creado¡`, 'success')
      }
    )
  }

  public update (): void{
    this.clienteService.update(this.cliente).subscribe( cliente => {
      this.router.navigate(['/clientes'])
      swal('Cliente Actualizado', `Cliente ${cliente.nombre} actualizado con exito¡'`,'success')
    }

    )
  }

}
