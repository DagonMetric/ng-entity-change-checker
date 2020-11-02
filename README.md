# Entity Change Checker for Angular

[![Azure Pipelines Status](https://dev.azure.com/DagonMetric/ng-entity-change-checker/_apis/build/status/DagonMetric.ng-entity-change-checker?repoName=DagonMetric%2Fng-entity-change-checker&branchName=main)](https://dev.azure.com/DagonMetric/ng-entity-change-checker/_build/latest?definitionId=25&repoName=DagonMetric%2Fng-entity-change-checker&branchName=main)
[![GitHub Actions Status](https://github.com/DagonMetric/ng-entity-change-checker/workflows/Main%20Workflow/badge.svg)](https://github.com/DagonMetric/ng-entity-change-checker/actions)

Object dirty checker and change states (such as Added, Modified or Deleted) and modified properties detector service for Angular applications.

## Get Started

### Installation

npm

```bash
npm install @dagonmetric/ng-entity-change-checker
```

or yarn

```bash
yarn add @dagonmetric/ng-entity-change-checker
```

Latest npm package is [![npm version](https://badge.fury.io/js/%40dagonmetric%2Fng-entity-change-checker.svg)](https://www.npmjs.com/package/@dagonmetric/ng-entity-change-checker)

### Module Setup (app.module.ts)

```typescript
import { EntityChangeCheckerModule } from '@dagonmetric/ng-entity-change-checker';

@NgModule({
  imports: [
    // Other module imports

    // ng-entity-change-checker module
    EntityChangeCheckerModule    
  ]
})
export class AppModule { }
```

### Usage (app.component.ts)

```typescript
import { Component } from '@angular/core';

import { EntityChangeChecker } from '@dagonmetric/ng-entity-change-checker';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']  
})
export class AppComponent {
  constructor(private readonly entityChangeChecker: EntityChangeChecker) {
    const sourceObj: MyType = {
        prop1: 'hello',
        prop2: 500,
        prop3: false,
        trackingState: TrackingState.Unchanged,
        modifiedProperties: []
    };

    const modObj = JSON.parse(JSON.stringify(sourceObj)) as MyType;
    modObj.prop1 = 'my';
    modObj.prop3 = true;               

    const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj);
    console.log('isDirty: ', isDirty); // Output: true
    console.log('trackingState: ', modObj.trackingState); // Output: 2
    console.log('modifiedProperties: ', modObj.modifiedProperties); // Output: ['prop1', 'prop3']
  }
}
```

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-entity-change-checker/blob/master/CONTRIBUTING.md) page.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-entity-change-checker/blob/master/LICENSE) license.
