import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BackofficeState } from 'packages/lomi-backoffice/ngrx';
import { AddUserResource } from 'packages/lomi-backoffice/ngrx/actions/app.actions';
import { App } from 'packages/lomi-backoffice/types/app';
import { Resource } from 'packages/lomi-backoffice/types/resources';

@Component({
  selector: 'lomii-add-user-rol-dialog',
  templateUrl: './add-user-rol-dialog.component.html',
  styleUrls: ['./add-user-rol-dialog.component.scss'],
})
export class AddUserRolDialogComponent implements OnInit {
  public resource:Resource = {
    id: "",
    name: "",
    type: "",
  };

  public userResource = {
    id: "",
    name: "",
    resourceId: ""
  };

  public resources:Resource[] | undefined;

  private resourcesUnsubscribable: any;

  constructor(
    private store: Store<BackofficeState>,
    private dialogRef: MatDialogRef<AddUserRolDialogComponent>,
  ) {}

  ngOnInit(): void {
    this.resourcesUnsubscribable = this.store.select("app").subscribe((app:App)=>{
      this.resources = app.resources
    })
  }
  
  addUserResource(resourceId:string){
    const resource = this.resources?.find((resource:Resource)=>resource.id == resourceId)
    if(resource){
      this.resource = resource;
      this.store.dispatch(new AddUserResource({
        resourceId: resource.id,
        privilegeName: this.userResource.name,
      }))
      this.dialogRef.close(this.resource);
    }
  }

  ngOnDestroy(){
    this.resourcesUnsubscribable?.unsubscribe();
  }

}
