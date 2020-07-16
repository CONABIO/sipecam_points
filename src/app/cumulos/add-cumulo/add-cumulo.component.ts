import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-add-cumulo',
  templateUrl: './add-cumulo.component.html',
  styleUrls: ['./add-cumulo.component.scss'],
})
export class AddCumuloComponent implements OnInit {
  @Input() cumulo: any = null;

  cumuloForm: FormGroup;

  constructor(private apollo: Apollo, private formBuilder: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.cumuloForm = this.formBuilder.group({
      idCumulo: ['', Validators.required],
      status: ['', Validators.required],
      criteria: ['', Validators.required],
      partner: ['', Validators.required],
      hasAgreement: [true, Validators.required],
      agreement: [''],
    });
  }

  fillForm() {
    Object.keys(this.cumulo).forEach((d) => {
      if (d !== 'id' && d !== '__typename') {
        this.cumuloForm.get(d).setValue(this.cumulo[d]);
      }
    });
  }

  ngOnInit(): void {
    if (this.cumulo) {
      this.fillForm();
    }
  }
}
