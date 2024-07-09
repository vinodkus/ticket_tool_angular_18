import { Component, OnInit, inject } from '@angular/core';
import { MasterService, Department, ParentCategory } from '../../services/master.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-parentcategory',
  standalone: true,
  imports: [MatSnackBarModule,DatePipe, FormsModule,AsyncPipe],
  templateUrl: './parentcategory.component.html',
  styleUrl: './parentcategory.component.css'
})
export class ParentcategoryComponent implements OnInit {
  masterSrv = inject(MasterService);
  snackBar = inject(MatSnackBar);
  deptList: Department[] = [];
  parentCatList: ParentCategory[]=[];
  newParentCategory:ParentCategory={
    categoryId:0,
    categoryName:'',
    deptId:0
  };
  newDepartment: Department = {
    deptId: 0,
    deptName: '',
    createdDate: new Date(),
  };

  ngOnInit(): void {
    this.getAllParentCategory();
    this.getAllDepts();
  }
  getAllDepts(): void {
    this.masterSrv.getAllDepts().subscribe((data) => {
      debugger;
      console.log(data);
      this.deptList = data;
    });
  }
  getAllParentCategory(): void {
    this.masterSrv.getAllParentCategory().subscribe((data) => {
      debugger;
      console.log(data);
      this.parentCatList = data;
    });
    
  }
 
  saveParentCategory(): void {
    debugger;

    const maxCategoryId = this.parentCatList.length>0? Math.max(
      ...this.parentCatList.map((pcat) => pcat.categoryId)
    ):0;
    debugger;
    this.newParentCategory.categoryId = maxCategoryId + 1;
    this.masterSrv.createNewParentCategory(this.newParentCategory).subscribe((pCat) => {
      this.parentCatList.push(pCat);
      this.newParentCategory = { categoryId:0,categoryName:'',deptId:0 }; // Reset the form
    
    });
    this.getAllParentCategory();
  }

  onEdit(item:ParentCategory):void{
    debugger;
    this.newParentCategory = { ...item };
    debugger;
  }
  resetParentCategory():void{
    debugger;
      this.newParentCategory = { categoryId:0,categoryName:'',deptId:0 };
  }
  updateParentCategory(parentCategory: ParentCategory): void {
    debugger;
    console.log('Updating Parent Category:', parentCategory);
    this.masterSrv.updateParentCategory(parentCategory).subscribe((updatedParentDepartment) => {
      const index = this.parentCatList.findIndex(
        (d) => d.id === updatedParentDepartment.id
      );
      if (index !== -1) {
        this.parentCatList[index] = updatedParentDepartment;
      }
    });
    this.getAllParentCategory();

  }

  deleteParentCategory(categoryId: number): void {
    debugger;
    console.log('Deleting Parent Category with ID:', categoryId);
    this.masterSrv.getParentCategoryByCategoryId(categoryId).subscribe({
      next: (parentCategories) => {
        if (parentCategories.length > 0) {
          const parentCategory = parentCategories[0];
          const parentCategoryName = parentCategory.categoryName;
          this.masterSrv.deleteParentCategoryById(parentCategory.id!).subscribe({
            next: () => {
              this.parentCatList = this.parentCatList.filter(
                (parentCat) => parentCat.categoryId !== categoryId
              );
              console.log('Parent Category deleted');
              this.showDeleteAlert(parentCategoryName);
             // alert('Department deleted')
            },
            error: (err) => {
              console.error('Error deleting Parent Category:', err);
            },
          });
        } else {
          console.error('Parent Category not found');
        }
      },
      error: (err) => {
        console.error('Error fetching Parent Category:', err);
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
