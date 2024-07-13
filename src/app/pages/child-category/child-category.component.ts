import { Component , OnInit, inject } from '@angular/core';
import { MasterService, Department, ParentCategory, ChildCategory } from '../../services/master.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-child-category',
  standalone: true,
  imports: [MatSnackBarModule,DatePipe, FormsModule,AsyncPipe],
  templateUrl: './child-category.component.html',
  styleUrl: './child-category.component.css'
})
export class ChildCategoryComponent implements OnInit {
  masterSrv = inject(MasterService);
  snackBar = inject(MatSnackBar);
  deptList: Department[] = [];
  parentCatList: ParentCategory[]=[];
  childCatList: ChildCategory[]=[];
  newChildCategory:ChildCategory={
    childCategoryId:0,
    childCategoryName:'',
    parentCategoryId:0,
  };


  ngOnInit(): void {
    this.getAllParentCategory();
    this.getAllDepts();
    this.getAllChildCategory();
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
  getAllChildCategory(): void {
    this.masterSrv.getAllChildCategory().subscribe((data) => {
      debugger;
      console.log(data);
      this.childCatList = data;
    });    
  }
  getParentCategoryName(ParentCategoryId: number | string): string {
    debugger;
    const numericParentCategoryId = typeof ParentCategoryId === 'string' ? parseInt(ParentCategoryId, 10) : ParentCategoryId;
    const ParentCategory = this.parentCatList.find(d => d.parentCategoryId === numericParentCategoryId);
    return ParentCategory ? ParentCategory.parentCategoryName : '';
  }
  saveChildCategory(): void {
    debugger;

    const maxCategoryId = this.childCatList.length>0? Math.max(
      ...this.childCatList.map((pcat) => pcat.childCategoryId)
    ):0;
    debugger;
    this.newChildCategory.childCategoryId = maxCategoryId + 1;
    this.masterSrv.createNewChildCategory(this.newChildCategory).subscribe((pCat) => {
      this.childCatList.push(pCat);
      this.newChildCategory = { parentCategoryId:0,childCategoryName:'',childCategoryId:0 }; // Reset the form
    
    });
   // this.getAllChildCategory();
  }

  onEdit(item:ChildCategory):void{
    debugger;
    this.newChildCategory = { ...item };
    debugger;
  }
  resetChildCategory():void{
    debugger;
      this.newChildCategory = { parentCategoryId:0,childCategoryName:'',childCategoryId:0 };
  }
  updateChildCategory(childCategory: ChildCategory): void {
    debugger;
    console.log('Updating Parent Category:', childCategory);
    this.masterSrv.updateChildCategory(childCategory).subscribe((updatedChildCategory) => {
      const index = this.childCatList.findIndex(
        (d) => d.id === updatedChildCategory.id
      );
      if (index !== -1) {
        this.childCatList[index] = updatedChildCategory;
      }
    });
    this.getAllChildCategory();


  }

  deleteChildCategory(childCategoryId: number): void {
    debugger;
    console.log('Deleting Parent Category with ID:', childCategoryId);
    this.masterSrv.getChildCategoryByChildCategoryId(childCategoryId).subscribe({
      next: (childCategories) => {
        if (childCategories.length > 0) {
          const childCategory = childCategories[0];
          const childCategoryName = childCategory.childCategoryName;
          this.masterSrv.deleteChildCategoryById(childCategory.id!).subscribe({
            next: () => {
              this.childCatList = this.childCatList.filter(
                (childCat) => childCat.childCategoryId !== childCategoryId
              );
              console.log('Parent Category deleted');
              this.showDeleteAlert(childCategoryName);
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
