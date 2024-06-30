import { Component, OnInit, inject } from '@angular/core';
import { MasterService, Department } from '../../services/master.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [DatePipe, FormsModule,AsyncPipe],

  templateUrl: './department.component.html',
  styleUrl: './department.component.css',
})
export class DepartmentComponent implements OnInit {
  masterSrv = inject(MasterService);
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

    const maxDeptId = Math.max(
      ...this.deptList.map((department) => department.deptId)
    );
    this.newDepartment.deptId = maxDeptId + 1;
    this.masterSrv.createNewDept(this.newDepartment).subscribe((department) => {
      this.deptList.push(department);
      this.newDepartment = { deptId: 0, deptName: '', createdDate: new Date() }; // Reset the form
    
    });
    this.getAllDepts();
  }

  onEdit(item:Department):void{
        this.newDepartment = item;
  }
  resetDept():void{
    debugger;
      this.newDepartment = { deptId: 0, deptName: '', createdDate: new Date() };
  }
  updateDept(department: Department): void {
    this.masterSrv.updateDept(department).subscribe((updatedDepartment) => {
      const index = this.deptList.findIndex(
        (d) => d.deptId === updatedDepartment.deptId
      );
      if (index !== -1) {
        this.deptList[index] = updatedDepartment;
      }
    });
  }

  deleteDept(deptId: number): void {
    debugger;
    console.log('Deleting department with ID:', deptId);
    this.masterSrv.getDeptByDeptId(deptId).subscribe({
      next: (departments) => {
        if (departments.length > 0) {
          const department = departments[0];
          this.masterSrv.deleteDeptById(department.id!).subscribe({
            next: () => {
              this.deptList = this.deptList.filter(
                (dept) => dept.deptId !== deptId
              );
              console.log('Department deleted');
              alert('Department deleted')
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
}