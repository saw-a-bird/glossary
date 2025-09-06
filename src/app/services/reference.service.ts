import { Injectable, OnDestroy } from '@angular/core';
import { Reference } from '../assets/models/references';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { takeUntil } from 'rxjs/operators';
import { map } from "rxjs/operators"; 
import { of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class referenceService implements OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();  
  private DB_REF_URL: string = "references";

  itemsRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {
    this.itemsRef = this.db.list(this.DB_REF_URL);
  }

  ngOnDestroy() { // Necessary to prevent memory leaks apparently
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  // GENERAL METHODS:

  getReferences(): Observable<any[]> {
    return this.itemsRef.snapshotChanges().pipe(map(
      (changes: any[]) => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))).pipe(takeUntil(this.destroy$));
  }

  filterReferencesByTag(tag : string): Observable<Reference[]> {
    return this.getReferences().pipe(map(data => data.filter(ref =>
        ref.tags?.includes(tag.substring(1).toLowerCase()))
    ));
  }

  filterReferencesByTags(tags : string[]): Observable<Reference[]> {
    return this.getReferences().pipe(map(
        data => data.filter(ref => 
          tags.every(tag => 
            ref.tags!.toLowerCase().includes(tag.substring(1).toLowerCase())
          )
        )
      ));
  }

  filterReferences(words : string[], tags : string[]): Observable<Reference[]> {
    return this.getReferences().pipe(map(
        data => data.filter(ref => 
          tags.every(tag => 
            ref.tags!.toLowerCase().includes(tag.substring(1).toLowerCase())
          ) && (words.some(word => 
            ref.title!.toLowerCase().includes(word.toLowerCase())
          ))
        )
      ));
  }

  addReference(json : any) {
    return this.itemsRef.push(json);
  }
  
  editReference(key: number, json : any) {
    return this.itemsRef.set(key.toString(), json);
  }

  deleteReference(key: number) {
    this.itemsRef.remove(key.toString());
  }

  // OTHER DB METHODS:

  getReference(key: number): Observable<any> {
    const url = `${this.DB_REF_URL}/${key}`;
    return this.db.object(url).valueChanges().pipe(takeUntil(this.destroy$));
  }


  // HANDING ERRORS


    /**
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */

    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {

        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead

        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);

        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
      console.log(`Reference Service: ${message}`);
    }
}
