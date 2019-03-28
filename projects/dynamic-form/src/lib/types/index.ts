import { ChangeDetectorRef, ElementRef, Injector, Type } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

import { AbstractDynamicControl, TemplateModel } from '../models';

export declare interface IDynamicComponentRef<T = any> {
  instance: T;
  injector: Injector;
  location: ElementRef;
  componentType: Type<T>;
  changeDetectorRef: ChangeDetectorRef;
}

export declare type ControlOrTemplate = AbstractDynamicControl<any> | TemplateModel<any>;

export declare interface IControlConfiguration<TInputs, TOutputs extends OutputsObject, TValue> {
  initialInputs?: TInputs;
  outputs?: TOutputs;
  validators?: ValidatorFn | ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[] | AsyncValidatorFn;
  initialValue?: TValue;
}

export declare interface OutputsObject {
  [key: string]: Function;
}
