import * as ts from 'typescript';
import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { addImportToModule, getSourceNodes } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { buildRelativePath, ModuleOptions } from '@schematics/angular/utility/find-module';
import { normalize, strings} from '@angular-devkit/core';

import { MenuOptions } from '../schema';

const config = require('../config.json');
const _defaultFactoryName = config['factory'].name;

export function addDeclarationToNgModule(_options: ModuleOptions): Rule {
    return (host: Tree) => {
      if (!_options.module) {
        return host;
      }

      
  
      const modulePath: string = _options.module;
  
      const text = host.read(modulePath);
  
      if (text === null) {
        throw new SchematicsException(`File ${modulePath} does not exist.`);
      }
  
      const sourceText = text.toString('utf-8');
      const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
  
      const importModulePath = normalize(
        `/${_options.path}/${_defaultFactoryName}-`
        + strings.dasherize(_options.name) + `/${_defaultFactoryName}-`
        + strings.dasherize(_options.name)
        + '.module'
      );
  
      const relativePath = buildRelativePath(modulePath, importModulePath);
      const extensionForRoot = 'forRoot()';
      const changes = addImportToModule(source, modulePath, strings.classify(`${_defaultFactoryName}${strings.classify(_options.name)}Module.`) + `${strings.camelize(extensionForRoot)}`, relativePath);
      const recorder = host.beginUpdate(modulePath);
      for (const change of changes) {
        if (change instanceof InsertChange) {
          recorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(recorder);
      return host;
    }
  }
  
  
 export function findRoutingModule(_options: ModuleOptions) {
    const routingPath: string = normalize(`/${_options.path}/app-routing.module.ts`);
    return routingPath;
  }
  
 export function addDeclarationToRoutingModule(_options: MenuOptions): Rule {
    return (host: Tree) => {
      if (!_options.routing_module) {
        return host;
      }
      const routingPath: string = _options.routing_module;
      const text = host.read(routingPath);
  
      if (text === null) {
        throw new SchematicsException(`File ${routingPath} does not exist.`);
      }
  
      const sourceText = text.toString('utf-8');
      const source = ts.createSourceFile(routingPath, sourceText, ts.ScriptTarget.Latest, true);
      let nodes = getSourceNodes(source);
      let ctorRoutingNode = nodes.find(n => n.kind === ts.SyntaxKind.VariableDeclaration);
  
      if (!ctorRoutingNode) {
        throw new SchematicsException('AppRouting not found.');
      }
  
      let importRoutingPath = normalize(`../apps/${_defaultFactoryName}-`
                                        + strings.dasherize(_options.name)
                                        + `/${_options.path}/${_defaultFactoryName}-`
                                        + strings.dasherize(_options.name)
                                        + `.module#`
                                        + strings.classify(_defaultFactoryName)
                                        + strings.classify(_options.name)
                                        + `Module?chunkName=${_defaultFactoryName}-`
                                        + strings.dasherize(_options.name)
                                        + `/${_options.path}/${_defaultFactoryName}-`
                                        + strings.dasherize(_options.name));
      
      let decorator = `,
    {
      path: '${_options.name}',
      loadChildren: '${importRoutingPath}',
      data: {preload: true}
    }`;
  
      let insertDecorator = new InsertChange(routingPath, ctorRoutingNode.end-1, decorator);
      const recorder = host.beginUpdate(routingPath);
      recorder.insertLeft(insertDecorator.pos, insertDecorator.toAdd);
      host.commitUpdate(recorder);
  
      return host;
  
    }
  }