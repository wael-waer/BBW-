import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { JobsListService } from '../../jobs-list.service';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

export interface DialogData {
  id: number;
  title: string;
  status: string;
  description: string;
  jobId:string
}

@Component({
    selector: 'app-delete:not(g)',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
    ],
})
export class DeleteDialogComponent {
  jobId!: string;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public jobsListService: JobsListService
  ) {
    this.jobId = data.jobId;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // confirmDelete(): void {
  //   this.jobsListService.deleteJobsList(this.data.id);
  // }
  onDeleteJob(): void {
    // Affiche un SweetAlert2 pour confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the job titled "${this.data.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Appelle le service pour supprimer le job
        this.jobsListService.deleteJob(this.data.jobId).subscribe(
          () => {
            Swal.fire(
              'Deleted!',
              'The job has been deleted.',
              'success'
            ).then(() => {
              this.dialogRef.close(1);  // Ferme le dialogue et renvoie 1 comme résultat
            });
          },
          (error) => {
            Swal.fire(
              'Error!',
              'An error occurred while deleting the job.',
              'error'
            );
            console.error('Error deleting job:', error);
          }
        );
      }
    });
  }

}
