import { TestBed } from '@angular/core/testing';

import { EntityChangeChecker } from '../../src/entity-change-checker';

describe('EntityChangeChecker', () => {
    let entityChangeChecker: EntityChangeChecker;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EntityChangeChecker]
        });

        entityChangeChecker = TestBed.inject<EntityChangeChecker>(EntityChangeChecker);
    });

    it('should be dirty', () => {
        const sourceObj = {
            prop1: 'hello',
            prop2: 'world'
        };

        const modObj = {
            prop1: 'my',
            prop2: 'world'
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, true);

        void expect(isDirty).toBeTruthy();
    });
});
