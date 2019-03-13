import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  forwardRef,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  ViewContainerRef
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';

import { AbstractDynamicControl } from '../../models';
import { IDynamicComponentRef } from '../../types';

export const formControlBinding: any = {
  provide: NgControl,
  useExisting: forwardRef(() => DynamicFormControlOutletDirective)
};

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[dynamicFormControlOutlet]', providers: [formControlBinding] })
export class DynamicFormControlOutletDirective extends NgControl implements OnChanges, OnDestroy {
  private subscriptions: Subscription[] = [];

  get control() {
    return this.dynamicFormControlOutlet;
  }

  @Input()
  dynamicFormControlOutlet: AbstractDynamicControl<any, any, any>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector
  ) {
    super();
  }

  ngOnChanges() {
    if (isNullOrUndefined(this.dynamicFormControlOutlet)) {
      this.viewContainerRef.clear();
    } else if (this.dynamicFormControlOutlet && !(this.dynamicFormControlOutlet instanceof AbstractDynamicControl)) {
      throw new Error(
        `DynamicFormControlOutlet requires an inheritor of BaseControlModel, but it was "${
          (this.dynamicFormControlOutlet as any).__proto__.constructor.name
        }"`
      );
    }

    const subscriptions = this.dynamicFormControlOutlet.componetController.componentTypeChanged$.subscribe(
      componentType => {
        this.viewContainerRef.clear();

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        const componentRef: ComponentRef<ControlValueAccessor> = <ComponentRef<ControlValueAccessor>>(
          this.viewContainerRef.createComponent(
            componentFactory,
            undefined,
            Injector.create({
              providers: [{ provide: NgControl, useValue: this }],
              parent: this.injector
            })
          )
        );

        const dynamicComponentRef: IDynamicComponentRef = {
          instance: componentRef.instance,
          injector: componentRef.injector,
          location: componentRef.location,
          componentType: componentRef.componentType,
          changeDetectorRef: componentRef.changeDetectorRef
        };

        this.dynamicFormControlOutlet.componetController.setComponentFactory(componentFactory);
        this.dynamicFormControlOutlet.componetController.registerComponent(dynamicComponentRef);

        componentRef.instance.writeValue(this.dynamicFormControlOutlet.value);
      }
    );

    this.subscriptions.push(subscriptions);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  viewToModelUpdate(newValue: any): void {}
}
