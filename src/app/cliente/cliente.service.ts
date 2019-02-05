import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente.js';
import { Observable, of, fromEventPattern, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = "http://localhost:8080/api/clientes";
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(): Observable<Cliente[]>{
    // return of(CLIENTES);  
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint).pipe(
      map(response => {
        let clientes = response as Cliente[];

        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase(); //Convertimos el nombre a mayuscula
          let datePipe = new DatePipe('es');
          //cliente.createAt =datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy' ); //formatDate(cliente.createAt,'dd-MM-yyyy','en-US');
          return cliente;
        });
      })
    );

  }

  create(cliente: Cliente): Observable<any>{
    return this.http.post<any>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(e);
        } 

        console.log(e.error.mensaje);
        swal('Error al crear', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.log(e.error.mensaje);
        swal('Error de editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`,cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente ),
      catchError(e=> {

        if(e.status==400){
          return throwError(e);
        }
        
        console.log(e.error.mensaje);
        swal('Error al Editar', e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        swal('Error al eliminar', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }



}
