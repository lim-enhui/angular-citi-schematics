import { Rule, Tree, apply, url, branchAndMerge, SchematicContext, template, move, chain, mergeWith } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { parseName } from '@schematics/angular/utility/parse-name';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';
import { strings} from '@angular-devkit/core';
import { findRoutingModule, addDeclarationToNgModule, addDeclarationToRoutingModule } from './utils/utils';

import { MenuOptions } from './schema';




export function app(_options: MenuOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const workspace = getWorkspace(tree);

    if(!_options.project){
      _options.project = Object.keys(workspace.projects)[0];
    }

    const project = workspace.projects[_options.project];

    if(_options.path === undefined) {
      const projectDirName = project.projectType === 'application' ? 'app': 'lib';
      _options.path = `/${project.root}/src/${projectDirName}`;
    }
    _options.routing_module = findRoutingModule(_options);
    _options.module = findModuleFromOptions(tree, _options);


    //resetting path to apps structure
    _options.path = `/${project.root}/src/apps`;


    const parsedPath = parseName(_options.path, _options.name);
    _options.name = parsedPath.name;
    _options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ..._options
      }),
      move(parsedPath.path)
    ]);

    const rule = chain([
      branchAndMerge(chain([
        addDeclarationToNgModule(_options),
        addDeclarationToRoutingModule(_options),
        mergeWith(templateSource)
      ]))
    ]);


    return rule;

  };
}

