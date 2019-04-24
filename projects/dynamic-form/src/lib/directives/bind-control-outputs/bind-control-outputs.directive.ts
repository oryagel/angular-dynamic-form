import { ComponentFactoryResolver, Directive, DoCheck, Inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { OutputsHandlerService } from '../../services';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[bindControlOutputs]'
})
export class BindControlOutputsDirective implements OnInit, DoCheck {
  private valueAccessor: ControlValueAccessor;
  private outputsHandler: OutputsHandlerService;

  @Input()
  bindControlOutputs;

  constructor(
    @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[],
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.valueAccessor = valueAccessors[0];
  }

  ngOnInit() {
    const componentType = (<any>this.valueAccessor).constructor;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    this.outputsHandler = new OutputsHandlerService(componentFactory);
  }

  ngDoCheck(): void {
    this.outputsHandler.handle(this.bindControlOutputs, this.valueAccessor);
  }
}
