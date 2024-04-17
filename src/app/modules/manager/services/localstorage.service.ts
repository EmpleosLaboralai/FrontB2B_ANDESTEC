import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  saveStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getStorage(key: string) {
    return JSON.parse(localStorage.getItem(key)!);
  }

}
