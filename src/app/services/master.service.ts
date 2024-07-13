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

export interface ParentCategory{
  id?: string;
  categoryId: number; 
  categoryName: string;
  deptId:number;
}
@Injectable({
  providedIn: 'root',
})
export class MasterService {
  apiDeptUrl: string = 'http://localhost:3000/departments';
  apiParentCatUrl: string = 'http://localhost:3000/parentCategories';
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
//Department Service
  // Get all departments
  getAllDepts(): Observable<Department[]> {
   // this.url = `${this.apiUrl}departments`;
    return this.http.get<Department[]>(this.apiDeptUrl);
  }
  getDeptByDeptId(deptId: number): Observable<Department[]> {
    debugger;

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
    const url = `${this.apiDeptUrl}/${id}`;
    return this.http.delete<void>(url);
  }
//Department Service

//Parent Category Service
getAllParentCategory(): Observable<ParentCategory[]> {
   return this.http.get<ParentCategory[]>(this.apiParentCatUrl);
 }
 
createNewParentCategory(parentCategory: ParentCategory): Observable<ParentCategory> {
    const url = `${this.url}parentCategories`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ParentCategory>(url, parentCategory, { headers });
}
updateParentCategory(parentCategory: ParentCategory): Observable<ParentCategory> {
  debugger;
  if (!parentCategory.id) {
    throw new Error('Department id is required for update');
  }
  debugger;
  const url = `${this.apiParentCatUrl}/${parentCategory.id}`;
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.put<ParentCategory>(url, parentCategory, { headers });
}
getParentCategoryByCategoryId(categoryId: number): Observable<ParentCategory[]> {
  debugger;
  const url = `${this.apiParentCatUrl}?categoryId=${categoryId}`;
  return this.http.get<ParentCategory[]>(url);
}
deleteParentCategoryById(id: string): Observable<void> {
  const url = `${this.apiParentCatUrl}/${id}`;
  return this.http.delete<void>(url);
}
//Parent Category Service

//Child Category Service
//Child Category Service



}
