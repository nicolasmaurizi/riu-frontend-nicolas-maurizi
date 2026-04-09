import { Directive } from '@angular/core';

@Directive({
  selector: '[appUppercaseName]',
})
export class UppercaseName {
  constructor() {}
}
