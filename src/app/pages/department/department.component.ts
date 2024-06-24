import { Component, OnInit, inject } from '@angular/core';
import { MasterService, Department } from '../../services/master.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './department.component.html',
  styleUrl: './department.component.css',
})
export class DepartmentComponent implements OnInit {
  masterSrv = inject(MasterService);
  deptList: Department[] = [];
  newDepartment: Department = { deptId: 0, deptName: '', createdDate: new Date()  };

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

  createDept(): void {
    this.masterSrv.createNewDept(this.newDepartment).subscribe((department) => {
      this.deptList.push(department);
      this.newDepartment = { deptId: 0, deptName: '', createdDate: new Date()  }; // Reset the form
    });
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
    this.masterSrv.deleteDeptById(deptId).subscribe(() => {
      this.deptList = this.deptList.filter(
        (department) => department.deptId !== deptId
      );
    });
  }
}
