import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-simple-form-native-approach',
  templateUrl: './simple-form-native-approach.component.html',
  styleUrls: ['./simple-form-native-approach.component.scss']
})
export class SimpleFormNativeApproachComponent implements OnInit {
  subjectOptions = ['Incorrect work', 'Unexpected behaviour'];

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
    this.formGroup = this.formBuilder.group({
      name: [''],
      email: [''],
      subject: [''],
      message: ['']
    });
  }

  ngOnInit(): void {
    console.log(this.formGroup.valid);
    this.cd.detectChanges();
  }
}
