import { Component, OnInit, inject } from '@angular/core';
import { MasterService, Department } from '../../services/master.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-department',
  standalone: true,
  imports: [MatSnackBarModule,DatePipe, FormsModule,AsyncPipe],

  templateUrl: './department.component.html',
  styleUrl: './department.component.css',
})
export class DepartmentComponent implements OnInit {
  masterSrv = inject(MasterService);
  snackBar = inject(MatSnackBar);
  deptList: Department[] = [];
  newDepartment: Department = {
    deptId: 0,
    deptName: '',
    createdDate: new Date(),
  };

  ngOnInit(): void {
    this.getAllDepts();
  }
  getAllDepts(): void {
    this.masterSrv.getAllDepts().subscribe((data) => {
      debugger;
      console.log(data);
      this.deptList = data;
    });
  }
 
  saveDept(): void {
    debugger;  
    const maxDeptId = this.deptList.length > 0
    ? Math.max(...this.deptList.map((department) => department.deptId))
    : 0;
    this.newDepartment.deptId = maxDeptId + 1;
    this.masterSrv.createNewDept(this.newDepartment).subscribe((department) => {
      this.deptList.push(department);
      this.newDepartment = { deptId: 0, deptName: '', createdDate: new Date() }; // Reset the form
    
    });
    this.getAllDepts();
  }

  onEdit(item:Department):void{
    debugger;
    this.newDepartment = { ...item };
    debugger;
  }
  resetDept():void{
    debugger;
      this.newDepartment = { deptId: 0, deptName: '', createdDate: new Date() };
  }
  updateDept(department: Department): void {
    debugger;
    console.log('Updating department:', department);
    this.masterSrv.updateDept(department).subscribe((updatedDepartment) => {
      const index = this.deptList.findIndex(
        (d) => d.id === updatedDepartment.id
      );
      if (index !== -1) {
        this.deptList[index] = updatedDepartment;
      }
    });
    this.getAllDepts();

  }

  deleteDept(deptId: number): void {
    debugger;
    console.log('Deleting department with ID:', deptId);
    this.masterSrv.getDeptByDeptId(deptId).subscribe({
      next: (departments) => {
        if (departments.length > 0) {
          const department = departments[0];
          const deptName = department.deptName;
          this.masterSrv.deleteDeptById(department.id!).subscribe({
            next: () => {
              this.deptList = this.deptList.filter(
                (dept) => dept.deptId !== deptId
              );
              console.log('Department deleted');
              this.showDeleteAlert(deptName);
             // alert('Department deleted')
            },
            error: (err) => {
              console.error('Error deleting department:', err);
            },
          });
        } else {
          console.error('Department not found');
        }
      },
      error: (err) => {
        console.error('Error fetching department:', err);
      },
    });
  }

  showDeleteAlert(deptName: string): void {
    this.snackBar.open(`Department: ${deptName} deleted successfully`, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'top', // We will override this with CSS
      panelClass: ['custom-snackbar', 'custom-snackbar-container'] // Apply the custom CSS classes
    });
  }
  
  
}