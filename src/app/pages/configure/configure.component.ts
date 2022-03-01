import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/_services/alert.service';
import { AuthorizationService } from 'app/_services/auth.service';
import { DriveService } from 'app/_services/drive.service';
import { PreventChanges } from 'app/_services/prevent-changes.guard';
import { Observable } from 'rxjs';
import { ValidatorService } from 'app/_services/validator.service';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss', '../../shared/shared.scss']
})
export class ConfigureComponent implements OnInit, PreventChanges {
	private modalRef: NgbModalRef;
	configForm: FormGroup;
	newModeratorForm: FormGroup;
	configuration = null;
	config = null;
	roles = ['Moderator', 'Teacher'];
	changed = false;
  constructor(public vService: ValidatorService, public dService: DriveService, public aService: AuthorizationService, public alService: AlertService, private modal: NgbModal) { }

  ngOnInit() {
		this.configureForm(false);
		this.seedForm();
  }
	configureForm(configured: Boolean): void {
		this.configForm = new FormGroup({
      role: new FormControl('', Validators.required),
			configured: new FormControl(configured),
      moderators: new FormArray([])
    });
	}
	seedForm() {
		const asyncify = new Promise((resolve, reject) => {
			this.dService.getFiles().then((o) => {
				if (o.files.length > 0) {
					const config = o.files.find(k => (k as any).name === "config.eMod");
					if (config) {
						this.config = config;
						this.dService.getFile(config.id).then((p) => {
							this.configuration = p;
							this.aService.$role.next(p.role);
							this.configForm.get('role').setValue(p.role);
							this.configForm.get('configured').setValue(true);
							if (p.role === 'Teacher') {
								for (let r = 0; r < p.moderators.length; r++) {
									(this.configForm.get('moderators') as FormArray).push(new FormGroup({
										id: new FormControl(p.moderators[r].id),
										name: new FormControl(p.moderators[r].name),
										email: new FormControl(p.moderators[r].email)
									}))
								}
								resolve(true);
							} else {
								resolve(true);
							}
						});
					} else {
						resolve(true);
					}
				} else {
					resolve(true);
				}
			});
		});
		asyncify.then(q => {
			const originalValue = JSON.stringify(this.configForm.value);
		  this.configForm.valueChanges.subscribe(p => {
			  if (JSON.stringify(p) === originalValue) {
				  this.changed = false;
			  } else {
				  this.changed = true;
			  }
		  });
		});
	}
	createConfiguration() {
		if (!this.configForm.invalid) {
			switch (this.configForm.get('role').value) {
				case 'Moderator': {
					this.createConfig({
						role: this.configForm.get('role').value
					});
					break;
				};
				case 'Teacher': {
					this.getTeacherBody().then(role => {
						this.createConfig(role)
					});
					break;
				};
			}
		} else {
			this.alService.error('Invalid Input!');
		}
	}
	createConfig(body: any) {
		if (body) {
			this.alService.load(this.dService.addSyncFile('config.eMod', body)).then(o => {
				this.changed = false;
				this.configForm = null;
				this.configureForm(true);
				this.seedForm();
			}).catch(err => this.alService.error(err));
		}
	}
	editConfiguration() {
		if (!this.configForm.invalid) {
			switch (this.configForm.get('role').value) {
				case 'Moderator': {
					this.alService.confirmDelete('This action will delete the attached moderators!').then(p => {
						const deleteFolders = [];
						for (let r = 0; r < this.configuration.moderators.length; r++) {
							deleteFolders.push(this.dService.deleteFolder(this.configuration.moderators[r].id));
						}
						Promise.all(deleteFolders).then(p => {
							this.editConfig(this.config.id, {
								role: this.configForm.get('role').value
							});
						});
					}).catch(err => err);
					break;
				};
				case 'Teacher': {
					if (this.configuration.role === 'Moderator') {
						this.getTeacherBody().then(body => {
							this.editConfig(this.config.id, body)
						})
					} else if (this.configuration.role === 'Teacher') {
						this.getEditedTeacherBody().then(body => {
							this.editConfig(this.config.id, body);
						})
					}
					break;
				};
			}
		} else {
			this.alService.error('Invalid Input!');
		}
	}
	editConfig(id: string, body: any): void {
		if (body) {
			this.alService.load(this.dService.editFile(id, body)).then(o => {
				this.changed = false;
				this.configForm = null;
				this.configureForm(true);
				this.seedForm();
			}).catch(err => this.alService.error(err));
		}
	}
	getTeacherBody(): Promise<any> {
		if (this.moderators.length > 0) {
			return new Promise((resolve, reject) => {
				const mods = [];
				const permissions = [];
				const folders = [];
				for (let r = 0; r < this.moderators.length; r++) {
					folders.push(this.dService.addFolder(this.moderators.at(r).get('name').value));
				}
				this.alService.load(Promise.all(folders)).then(u => {
					for (let h = 0; h < u.length; h++) {
						mods.push({
							name: this.moderators.at(h).get('name').value,
							email: this.moderators.at(h).get('email').value,
							id: (u[h] as any).id
						});
						permissions.push(this.dService.addPermission((u[h] as any).id, this.moderators.at(h).get('email').value));
					}
					const body = {
						role: this.configForm.get('role').value,
						moderators: mods
					};
					this.alService.load(Promise.all(permissions)).then(o => resolve(body)).catch(err => reject(err));
				}).catch(err => reject(err));
			});
		} else {
			this.alService.error('At least 1 moderator required to configure teacher account');
			return new Promise(null);
		}
	}
	getEditedTeacherBody(): Promise<any> {
		if (this.moderators.length > 0) {
			return new Promise((resolve, reject) => {
				const deleteFolders = [];
				this.configuration.moderators.forEach(element => {
					if (this.moderators.value.filter(p => p.id === element.id).length < 1) {
						deleteFolders.push(this.dService.deleteFolder(element.id));
					}
				});
				this.alService.load(Promise.all(deleteFolders)).then(p => {
					const newFolders: any[] = this.moderators.value.filter(g => !g.id);
					const existingFolders: any[] = this.moderators.value.filter(g => g.id);
					const permissions = [];
					const folders = [];
					for (let r = 0; r < newFolders.length; r++) {
						folders.push(this.dService.addFolder(newFolders[r].name));
					}
					this.alService.load(Promise.all(folders)).then(u => {
						for (let h = 0; h < u.length; h++) {
							existingFolders.push({
								name: newFolders[h].name,
								email: newFolders[h].email,
								id: (u[h] as any).id
							});
							permissions.push(this.dService.addPermission((u[h] as any).id, newFolders[h].email));
						}
						const body = {
							role: this.configForm.get('role').value,
							moderators: existingFolders
						};
						this.alService.load(Promise.all(permissions)).then(o => resolve(body)).catch(err => reject(err));
					}).catch(err => reject(err));
				}).catch(err => reject(err));
			});
		} else {
			this.alService.error('At least 1 moderator required to configure teacher account');
			return new Promise(null);
		}
	}
	open(content: any) {
    this.newModeratorForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(2), this.vService.existingNameValidator(this.moderators)]),
      email: new FormControl(null, [this.vService.sameEmailValidator, Validators.required, this.vService.customEmailValidator, this.vService.existingValidator(this.moderators)])
    });
    this.modalRef = this.modal.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', keyboard: false, backdrop: 'static' });
    this.modalRef.result.then((result) => {}, (reason) => {});
  }
  close(reason: string) {
    this.modalRef.close();
    this.newModeratorForm = null;
  }
  add() {
    if (this.newModeratorForm.invalid) {
      this.newModeratorForm.markAllAsTouched();
    } else {
      this.moderators.push(new FormGroup({
        name: new FormControl(this.newModeratorForm.get('name').value),
        email: new FormControl(this.newModeratorForm.get('email').value)
      }));
      this.close('');
    }
  }
	delete(i: number): void {
		this.alService.confirmDelete('Are you sure?').then(p => {
			this.moderators.removeAt(i);
		}).catch(err => err);
	}
	@HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
		if (this.changed && this.aService.$role.getValue() === 'Error') {
			return true;
		}	else if (this.changed) {
			return false;
		} else {
			return true;
		}
  }
	get role() {
    return this.configForm.get('role') as FormControl;
  }
	get configured() {
		return this.configForm.get('configured') as FormControl;
	}
	get moderators() {
    return this.configForm.get('moderators') as FormArray;
  }
	get n() {
    return (this.newModeratorForm as FormGroup).controls;
  }
}
