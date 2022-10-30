import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  public checkValidEmail(email: string): boolean {
    if (email === undefined || email === null) return false;

    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
  }

  public checkValidName(name: string): boolean {
    if (name === undefined || name === null) return false;

    return /^\D+$/.test(name);
  }

  public cloneObject(obj): any {
    if (typeof obj !== 'object')
      return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.cloneObject(item));
    }

    const newObj = {};
    Object.keys(obj).forEach((key) => {
      newObj[key] = this.cloneObject(obj[key]);
    });
    return newObj;
  }
}
