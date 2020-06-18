import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente.js';
import { Region } from './region.js';
import { Observable, of, fromEventPattern, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = "http://localhost:8080/api/clientes";
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  private isNoAutorizado(e): boolean{
    if(e.status==401 || e.status==403){
      this.router.navigate(['/login']);
      return true;
    }
    else
      return false;
  }
  
  getClientes(page: number): Observable<any>{
    // return of(CLIENTES);  
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint+'/page/'+page).pipe(
      map((response :any) => {
       // let clientes = response as Cliente[];

         (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase(); //Convertimos el nombre a mayuscula
          let datePipe = new DatePipe('es');
          //cliente.createAt =datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy' ); //formatDate(cliente.createAt,'dd-MM-yyyy','en-US');
          return cliente;
        });
        return response;
      })
    );

  }

  create(cliente: Cliente): Observable<any>{
    return this.http.post<any>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(this.isNoAutorizado(e)){
          return throwError(e);
        }

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

        if(this.isNoAutorizado(e)){
          return throwError(e);
        }

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

        if(this.isNoAutorizado(e)){
          return throwError(e);
        }

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

        if(this.isNoAutorizado(e)){
          return throwError(e);
        }

        console.log(e.error.mensaje);
        swal('Error al eliminar', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{  // cambiar Observable<Cliente> por Observable<HttpEvent<{}>> 
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id",id);


    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    ); //Cambios para insertar la barra de progreso

   /* return this.http.post(`${this.urlEndPoint}/upload`, formData).pipe(  //METODO SIN PROGRES BAR
        map((response: any) => response.cliente as Cliente ),
        catchError(e => {
          console.log(e.error.mensaje);
          swal('Error al subir imagen', e.error.mensaje, 'error');
          return throwError(e);
        })
    );*/
      

  }

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones').pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }



}
