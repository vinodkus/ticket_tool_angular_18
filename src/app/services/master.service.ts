import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Department {
  deptId: number;
  deptName: string;
}
@Injectable({
  providedIn: 'root',
})
export class MasterService {
  //apiUrl:string="http://localhost:3000/users";
  apiUrl: string = 'http://localhost:3000/';
  constructor(private http: HttpClient) {}
  login(obj: any) {
    const { emailId, password } = obj;
    return this.http
      .get<any[]>(`${this.apiUrl}users?emailId=${emailId}&password=${password}`)
      .pipe(
        map((users: string | any[]) => {
          if (users.length > 0) {
            const user = users[0];
            return {
              data: user,
              message: 'Valid Credentials',
              result: true,
            };
          } else {
            return {
              data: null,
              message: 'Wrong Crendentials',
              result: false,
            };
          }
        })
      );
  }

  // Get all departments
  getAllDepts(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  // Create a new department
  createNewDept(department: Department): Observable<Department> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Department>(this.apiUrl, department, { headers });
  }

  // Update an existing department
  updateDept(department: Department): Observable<Department> {
    const url = `${this.apiUrl}/${department.deptId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Department>(url, department, { headers });
  }

  // Delete a department by ID
  deleteDeptById(deptId: number): Observable<void> {
    const url = `${this.apiUrl}/${deptId}`;
    return this.http.delete<void>(url);
  }
}
