// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders} from '@angular/common/http';
// import { Reference } from '../assets/models/references';
// import { Observable } from 'rxjs/Observable';

// import { of } from 'rxjs/internal/observable/of';

// import { catchError, tap } from 'rxjs/operators';
// import { map } from "rxjs/operators"; 

// @Injectable({
//   providedIn: 'root'
// })

// export class referenceService {

//   private DB_REF_URL: string = "http://localhost:3001/references";
  
//   httpOptions = {
//     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//   };

//   constructor(private http: HttpClient) { }


//   // GENERAL METHODS:


//   getReferences(): Observable<Reference[]> {
//     return this.http.get<Reference[]>(this.DB_REF_URL);
//   }

//   filterReferencesByTag(tag : string): Observable<Reference[]> {
//     return this.getReferences().pipe(map(data => data.filter(ref =>
//         ref.tags?.includes(tag.substring(1).toLowerCase()))
//     ));
//   }

//   filterReferencesByTags(tags : string[]): Observable<Reference[]> {
//     return this.getReferences().pipe(map(
//         data => data.filter(ref => 
//           tags.every(tag => 
//             ref.tags!.toLowerCase().includes(tag.substring(1).toLowerCase())
//           )
//         )
//       ));
//   }

//   filterReferences(words : string[], tags : string[]): Observable<Reference[]> {
//     return this.getReferences().pipe(map(
//         data => data.filter(ref => 
//           tags.every(tag => 
//             ref.tags!.toLowerCase().includes(tag.substring(1).toLowerCase())
//           ) && (words.some(word => 
//             ref.title!.toLowerCase().includes(word.toLowerCase())
//           ))
//         )
//       ));
//   }

//     // deleteHero(idTower: number, idHero: number): Promise<void> {
//   //   const url = `${this.towersUrl}/${idTower}/heroes/${idHero}`;

//   deleteReference(idRef: number) {
//     const url = `${this.DB_REF_URL}/${idRef}`;
//     this.http.delete<Reference>(url, this.httpOptions).pipe(
//       tap(_ => this.log(`updated note id=${idRef}`)),
//       catchError(this.handleError<Reference>('deleteRef'))
//     ).subscribe();
//   }

//   addReference(jsonRef : string): Observable<Reference> {
//     return this.http.post<Reference>(this.DB_REF_URL, jsonRef, this.httpOptions).pipe(
//       tap(ref => this.log(`added new note title=${ref.title}`)),
//       catchError(this.handleError<Reference>('addRef'))
//     );
//   }
  
//   editReference(idRef: number, jsonRef : string): Observable<Reference> {
//     const url = `${this.DB_REF_URL}/${idRef}`;
//     return this.http.put<Reference>(url, jsonRef, this.httpOptions).pipe(
//       tap(ref => this.log(`updated note title=${ref.title}`)),
//       catchError(this.handleError<Reference>('updateRef'))
//     );
//   }

//   // OTHER DB METHODS:

//   getReference(idRef: number): Observable<Reference> {
//     const url = `${this.DB_REF_URL}/${idRef}`;
//     return this.http.get<Reference>(url, this.httpOptions).pipe(
//       tap(_ => this.log(`got note id=${idRef}`)),
//       catchError(this.handleError<Reference>('getRef'))
//     );
//     //.subscribe(data=>console.log(data));
//   }


//   // HANDING ERRORS


//     /**
//    * Handle Http operation that failed.
//    * Let the app continue.
//    * @param operation - name of the operation that failed
//    * @param result - optional value to return as the observable result
//    */
//     private handleError<T>(operation = 'operation', result?: T) {
//       return (error: any): Observable<T> => {

//         // TODO: send the error to remote logging infrastructure
//         console.error(error); // log to console instead

//         // TODO: better job of transforming error for user consumption
//         this.log(`${operation} failed: ${error.message}`);

//         // Let the app keep running by returning an empty result.
//         return of(result as T);
//       };
//     }

//     /** Log a HeroService message with the MessageService */
//     private log(message: string) {
//       // console.log(`Reference Service: ${message}`);
//     }
// }