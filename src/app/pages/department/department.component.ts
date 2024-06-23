import { Component, OnInit, inject } from '@angular/core';
import { MasterService, Department } from '../../services/master.service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css',
})
export class DepartmentComponent implements OnInit {
  masterSrv = inject(MasterService);
  departments: Department[] = [];
  newDepartment: Department = { deptId: 0, deptName: '' };

  ngOnInit(): void {
    this.getAllDepts();
  }
  getAllDepts(): void {
    this.masterSrv.getAllDepts().subscribe((data) => {
      this.departments = data;
    });
  }

  createDept(): void {
    this.masterSrv.createNewDept(this.newDepartment).subscribe((department) => {
      this.departments.push(department);
      this.newDepartment = { deptId: 0, deptName: '' }; // Reset the form
    });
  }

  updateDept(department: Department): void {
    this.masterSrv.updateDept(department).subscribe((updatedDepartment) => {
      const index = this.departments.findIndex(
        (d) => d.deptId === updatedDepartment.deptId
      );
      if (index !== -1) {
        this.departments[index] = updatedDepartment;
      }
    });
  }

  deleteDept(deptId: number): void {
    this.masterSrv.deleteDeptById(deptId).subscribe(() => {
      this.departments = this.departments.filter(
        (department) => department.deptId !== deptId
      );
    });
  }
}
