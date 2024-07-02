import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Department {
  id?: string;
  deptId: number;
  deptName: string;
  createdDate: Date;
}
@Injectable({
  providedIn: 'root',
})
export class MasterService {
  //apiUrl:string="http://localhost:3000/users";
  apiDeptUrl: string = 'http://localhost:3000/departments';
  url: string = 'http://localhost:3000/';
  constructor(private http: HttpClient) {}
  login(obj: any) {
    const { emailId, password } = obj;
    return this.http
      .get<any[]>(`${this.url}users?emailId=${emailId}&password=${password}`)
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
   // this.url = `${this.apiUrl}departments`;
    return this.http.get<Department[]>(this.apiDeptUrl);
  }
  getDeptByDeptId(deptId: number): Observable<Department[]> {
    debugger;
   // this.url = `${this.apiDeptUrl}departments`;

    const url = `${this.apiDeptUrl}?deptId=${deptId}`;
    return this.http.get<Department[]>(url);
  }
  // Create a new department
  createNewDept(department: Department): Observable<Department> {
    debugger
    this.url = `${this.apiDeptUrl}`;
    debugger;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    debugger;
    return this.http.post<Department>(this.url, department, { headers });
  }

  // Update an existing department
  updateDept(department: Department): Observable<Department> {
    debugger;
    if (!department.id) {
      throw new Error('Department id is required for update');
    }
    debugger;
    const url = `${this.apiDeptUrl}/${department.id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Department>(url, department, { headers });
  }

  // Delete a department by ID
  deleteDeptById(id: string): Observable<void> {
   // this.apiUrl = this.apiUrl+'departments';
    const url = `${this.apiDeptUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
