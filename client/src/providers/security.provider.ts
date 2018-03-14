import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Session } from '../shared/models/session.model';

const STORAGE_KEY = 'session';

@Injectable()
export class SecurityProvider {

  private session: BehaviorSubject<Session> = new BehaviorSubject<Session>(undefined);

  constructor() {
    const session = this.getSession();

    if (session) {
      this.session.next(session);
    }
  }

  storeSession(session: Session): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.session.next(session);
  }

  removeSession(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.session.next(undefined);
  }

  private getSession(): Session {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  }

  getSessionAsync(): Observable<Session> {
    return this.session.asObservable();
  }

  getSessionSync(): Session {
    return this.getSession();
  }
}
