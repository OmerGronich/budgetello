import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  forwardRef,
  Input,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputDirective } from '@budgetello/ui/base-input';
import { PrimeTemplate } from 'primeng/api';

@Component({
  selector: 'budgetello-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordInputComponent,
      multi: true,
    },
  ],
})
export class PasswordInputComponent
  extends BaseInputDirective
  implements AfterViewInit
{
  @Input() feedBack = true;
  @Input() toggleMask = true;

  @ContentChildren(PrimeTemplate) templates: QueryList<any>;

  headerTemplate: TemplateRef<any>;
  footerTemplate: TemplateRef<any>;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'header':
          this.headerTemplate = item.template;
          break;
        case 'footer':
          this.footerTemplate = item.template;
          break;
      }
    });
  }
}
