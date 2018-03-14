import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Session } from '../shared/models/session.model';
import 'rxjs/add/observable/fromPromise'

const STORAGE_KEY = 'session';

@Injectable()
export class SecurityProvider {

  private session: BehaviorSubject<Session> = new BehaviorSubject<Session>(undefined);

  constructor(private storage: Storage) {
    Observable.fromPromise(this.storage.get(STORAGE_KEY).then(
      (session) => {
        if (session) {
          this.session.next(JSON.parse(session));
        }
      }
    )).subscribe();
  }

  storeSession(session: Session): void {
    Observable.fromPromise(this.storage.set(STORAGE_KEY, JSON.stringify(session)).then(
      (value) => {
        this.session.next(session);
      }
    )).subscribe();
  }

  removeSession(): void {
    Observable.fromPromise(this.storage.remove(STORAGE_KEY).then(
      () => {
        this.session.next(undefined);
      }
    )).subscribe();
  }

  getSession(): Observable<Session> {
    return this.session.asObservable();
  }

}
