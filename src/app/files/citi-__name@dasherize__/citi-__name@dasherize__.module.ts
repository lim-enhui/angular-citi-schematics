import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Citi<%= classify(name) %>Component } from './citi-<%= dasherize(name) %>.component';
import { Citi<%= classify(name) %>RoutingModule } from './citi-<%= dasherize(name) %>-routing.module';

@NgModule({
    declarations: [
        Citi<%= classify(name) %>Component
    ],
    imports: [
    CommonModule,
    Citi<%= classify(name) %>RoutingModule
    ]
})
export class Citi<%= classify(name) %>Module { 
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: Citi<%= classify(name) %>Module,
            providers: Citi<%= classify(name) %>Module.providers()
        }
    }

    public static providers(): Provider[] {
        return [];
    }
}