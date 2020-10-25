import { NgModule } from '@angular/core';

import { EntityChangeChecker } from './entity-change-checker';

@NgModule({
    providers: [EntityChangeChecker]
})
export class TrackableEntityModule {}
