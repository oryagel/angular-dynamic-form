import { Type } from '@angular/core';
import { FormControl, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs';
import { isString } from 'util';

import { dynamicControlAttrName } from '../../constants';
import { IControlConfiguration, IDynamicComponentRef } from '../../types';
import { ComponentController } from './component-controller';

function componentRegisteredCallback(this: AbstractDynamicControl<any>, dynamicComponentRef: IDynamicComponentRef) {
  const componentNativeElement = dynamicComponentRef.location.nativeElement as HTMLElement;

  if (isString(this.name)) {
    componentNativeElement.id = this.name;
  }

  const dynamicControlAttr = document.createAttribute(dynamicControlAttrName);
  componentNativeElement.attributes.setNamedItem(dynamicControlAttr);

  const valueAccessor = <ControlValueAccessor>dynamicComponentRef.instance;

  if (valueAccessor.registerOnChange) {
    this.registerOnChange(v => valueAccessor.writeValue(v));
    valueAccessor.registerOnChange(v => {
      this.setValue(v);
    });
  }
  if (valueAccessor.registerOnTouched) {
  }
  if (valueAccessor.setDisabledState) {
    this.registerOnDisabledChange(v => valueAccessor.setDisabledState(v));
  }
}

export abstract class AbstractDynamicControl<
  TControlComponent extends ControlValueAccessor,
  TInputs = any,
  TOutputs = any,
  TValue = any
> extends FormControl {
  private _name: string;
  private dynamicComponentRef: IDynamicComponentRef<TControlComponent>;

  private readonly _componentController: ComponentController<TControlComponent, TInputs>;

  get name() {
    return this._name;
  }

  get inputs(): TInputs {
    return this._componentController.inputs;
  }

  get outputs(): TOutputs {
    return this._componentController.outputs;
  }

  get isDisplayed() {
    return this._componentController.isDisplayed;
  }

  set isDisplayed(value: boolean) {
    this._componentController.isDisplayed = value;
  }

  readonly valueChanges: Observable<TValue>;

  get componetController() {
    return this._componentController;
  }

  constructor(config: IControlConfiguration<TInputs, TValue>, componentType: Type<TControlComponent>) {
    super(config.validators, config.asyncValidators);
    this._componentController = new ComponentController<TControlComponent, TInputs>(
      componentType,
      config.initialInputs
    );

    this._componentController.componentRegistered$.subscribe(dynamicComponentRef => {
      componentRegisteredCallback.bind(this)(dynamicComponentRef);
      this.dynamicComponentRef = dynamicComponentRef;
    });
  }

  registerComponent(componentInstance: TControlComponent) {}

  setValue(
    value: TValue,
    options: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    } = {}
  ): void {
    super.setValue(value, options);
    this.componetController.detectChanges();
  }

  patchValue(
    value: TValue,
    options: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    } = {}
  ): void {
    super.patchValue(value, options);
  }

  reset(value?: TValue, options?: Object): void {
    super.reset(value, options);
  }
}
