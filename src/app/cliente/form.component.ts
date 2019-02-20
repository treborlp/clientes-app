import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
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
  regiones: Region[];

  private errores: string[];

  constructor(private clienteService: ClienteService, private router: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();

    this.clienteService.getRegiones().subscribe(regiones =>this.regiones = regiones);
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
      json => {
        this.router.navigate(['/clientes'])
        swal("Nuevo Cliente",`Cliente ${json.cliente.nombre} fue creado¡`, 'success')
      },
      err =>{
        this.errores = err.error.errors as string[];
        console.error(err.error.errors);
        console.error(err.status);

      }
    )
  }

  public update (): void{
    this.clienteService.update(this.cliente).subscribe( cliente => {
      this.router.navigate(['/clientes'])
      swal('Cliente Actualizado', `Cliente ${cliente.nombre} actualizado con exito¡'`,'success')
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error(err.error.errors);
      console.error(err.status);

    }

    )
  }

  compararRegion(o1:Region, o2:Region):boolean{

    if(o1 === undefined && o2===undefined ){
      return true;
    }


    return o1==null || o2==null?false : o1.id===o2.id ;
  }

}
