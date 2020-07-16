import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-add-socio',
  templateUrl: './add-socio.component.html',
  styleUrls: ['./add-socio.component.scss'],
})
export class AddSocioComponent implements OnInit {
  @Input() socio: any = null;

  socioForm: FormGroup;

  constructor(private apollo: Apollo, private formBuilder: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.socioForm = this.formBuilder.group({
      institution: [''],
      address: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: [''],
      comments: [''],
      grade: [''],
    });
  }

  fillForm() {
    Object.keys(this.socio).forEach((d) => {
      if (d !== 'id' && d !== '__typename') {
        this.socioForm.get(d).setValue(this.socio[d]);
      }
    });
  }

  ngOnInit(): void {
    if (this.socio) {
      this.fillForm();
    }
  }
}
