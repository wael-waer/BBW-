import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { JobsListService } from '../../jobs-list.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { JobsList, Skill } from '../../jobs-list.model';
import { CommonModule, formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipGrid, MatChipInput, MatChipInputEvent, MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SharedModule } from 'shared.module';
import { JobsListComponent } from '../../jobs-list.component';

export interface DialogData {
  id: number;
  action: string;
  jobsList: JobsList;
}

@Component({
    selector: 'app-form-dialog:not(f)',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    standalone: true,
    
    
    imports: [
      MatChipsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatDialogClose,
      //  JobsListComponent,
        MatIconModule,
       
        MatChipGrid,
        CommonModule,
        MatChipInput,
        SharedModule
       
    ],
})
export class FormDialogComponent {
  // predefinedSkills: string[] = ['HTML', 'CSS', 'JavaScript', 'Angular', 'React', 'Node.js','Java',
  // 'Python',
  // 'JavaScript',
  // 'C#',
  // 'C++',
  // 'Ruby',
  // 'Swift',
  // 'Kotlin'];
  predefinedSkills:Skill[]=[];
  skills: Skill[] = [];
 
  separatorKeysCodes: number[] = [ENTER, COMMA];
  enteredSkills: string[] = [];
  chipList: any;
  action: string;
  dialogTitle!: string;
  jobsListForm: UntypedFormGroup;
  jobsList!: JobsList;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public jobsListService: JobsListService,
    private fb: UntypedFormBuilder,
    // public JobsListComponent: JobsListComponent
    
  ) {
    // this.sortPredefinedSkills();
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.jobsList.title;
      this.jobsList = data.jobsList;
    } else if (this.action === 'add'){
      // this.dialogTitle = 'New JobsList';
      // const blankObject = {} as JobsList;
      // this.jobsList = new JobsList(blankObject);
      // this.jobsList = Object.assign(new JobsList(), blankObject);
      this.dialogTitle = 'New JobsList';
    this.jobsList = new JobsList();
    }
    this.jobsListForm = this.createContactForm();
  }
  ngOnInit(): void {
    
    this.jobsListForm = this.fb.group({
      // title: ['', Validators.required],
      // description: ['', Validators.required],
      // location: ['', Validators.required],
      // contractType: ['', Validators.required],
      // salary: ['', Validators.required],
      // applicationDeadline: ['', Validators.required],
      // status: ['', Validators.required],
      // publicationDate: ['', Validators.required],
      // requiredSkills: [[], Validators.required], // Définissez un tableau vide pour les compétences requises
      // recruitingMsanager: ['', Validators.required]
      id: [this.jobsList._id], // Assurez-vous que l'ID est initialisé correctement
      title: [this.jobsList.title, Validators.required],
      description: [this.jobsList.description, Validators.required],
      location: [this.jobsList.location, Validators.required],
      contractType: [this.jobsList.contractType, Validators.required],
      salary: [this.jobsList.salary, Validators.required],
      applicationDeadline: [this.jobsList.applicationDeadline, Validators.required],
      status: [this.jobsList.status, Validators.required],
      
      requiredSkills: [this.jobsList.requiredSkills, Validators.required],
      
    });
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.status,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('status')
      ? 'Not a valid status'
      : '';
  }
  
  onSkillInput(event: any) {
  const value = event?.target?.value;
  // Vérifier si value est défini et non vide avant de l'ajouter
  if (value && value.trim() !== '' && !this.enteredSkills.includes(value)) {
    this.enteredSkills.push(value.trim());
  }
}

  
// sortPredefinedSkills() {
//   this.predefinedSkills.sort((a, b) => a.localeCompare(b));
// }

  
  

  removeSkill(skill: string) {
    // Supprimer une compétence du tableau enteredSkills lorsque l'utilisateur retire un tag
    const index = this.enteredSkills.indexOf(skill);
    if (index >= 0) {
      this.enteredSkills.splice(index, 1);
    }
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.jobsList._id],
      Title: [this.jobsList.title],
      requiredSkills: [this.jobsList.requiredSkills],
      applicationDeadline: [
        this.jobsList.applicationDeadline ? formatDate(this.jobsList.applicationDeadline, 'yyyy-MM-dd', 'en') : null,
        [Validators.required],
      ],
      Location: [this.jobsList.location],
      contractType: [this.jobsList.contractType],
      salary: [this.jobsList.salary],
     
     
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
 
  public confirmAdd(): void {
    if (this.jobsListForm.valid) {
      const formData = this.jobsListForm.value;
  
      if (this.action === 'add') {
        // Logique pour ajouter un nouveau job
        const newJobsList: JobsList = {
          _id: formData.id,
          title: formData.title,
          description: formData.description,
          requiredSkills: formData.requiredSkills,
          location: formData.location,
          contractType: formData.contractType,
          salary: formData.salary,
          applicationDeadline: formData.applicationDeadline,
          status: formData.status,
          
          
          applicants: formData.applicants
        };
  
        // Appelez la méthode de service pour ajouter le nouveau job
        this.jobsListService.addJob(newJobsList).subscribe(
          (response) => {
            console.log('New job added successfully:', response,this.jobsList._id);
            alert('Job added successfully!');
            this.dialogRef.close(); // Fermez le dialogue après l'ajout réussi
           
          },
          (error) => {
            console.error('Error adding new job:', error);
          }
        );
      } else if (this.action === 'edit') {
        // Logique pour modifier un job existant
        const updatedJobsList: JobsList = {
          _id: formData.id,
          title: formData.title,
          description: formData.description,
          requiredSkills: formData.requiredSkills,
          location: formData.location,
          contractType: formData.contractType,
          salary: formData.salary,
          applicationDeadline: formData.applicationDeadline,
          status: formData.status,
          
          
          applicants: formData.applicants
        };
  
        // Appelez la méthode de service pour mettre à jour le job existant
        this.jobsListService.updateJob(updatedJobsList).subscribe(
          (response) => {
            console.log('Job updated successfully:', response);
            alert('Job updated successfully!');
            this.dialogRef.close(); // Fermez le dialogue après la modification réussie
          // this.JobsListComponent.refresh(); 
          },
          (error) => {
            console.error('Error updating job:', error);
          }
        );
      }
    } else {
      console.error('Invalid form data. Please check the form.');
    }
  }
 
 
  
  
}