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

    it('should NOT be dirty when object values are the same - { dirtyOnly: true, emptyAndNullAsEqual: true }', () => {
        const sourceObj: Record<string, unknown> = {
            prop1: 'hello',
            prop2: 1,
            prop3: true,
            prop4: ['a', 'b'],
            prop5: [],
            prop6: { a: 1, b: '2' },
            prop7: null
        };

        const modObj: Record<string, unknown> = {
            prop1: 'hello',
            prop2: 1,
            prop3: true,
            prop4: ['a', 'b'],
            prop5: [],
            prop6: { a: 1, b: '2' },
            prop7: ''
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, {
            dirtyOnly: true,
            emptyAndNullAsEqual: true
        });

        void expect(isDirty).toBeFalsy();
    });

    it('should be dirty when second object is null - { dirtyOnly: true }', () => {
        const modObj = {
            prop1: 'my',
            prop2: 'world'
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, (null as unknown) as Record<string, unknown>, {
            dirtyOnly: true
        });

        void expect(isDirty).toBeTruthy();
    });

    it('should be dirty when simple values are not the same - string - { dirtyOnly: true }', () => {
        const sourceObj = {
            prop1: 'hello'
        };

        const modObj = {
            prop1: 'my'
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, { dirtyOnly: true });

        void expect(isDirty).toBeTruthy();
    });

    it('should NOT be dirty when simple values are the same - string - { dirtyOnly: true }', () => {
        const sourceObj = {
            prop1: 'hello'
        };

        const modObj = {
            prop1: 'hello'
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, { dirtyOnly: true });

        void expect(isDirty).toBeFalsy();
    });

    it('should NOT be dirty when simple values are the same - empty string and null - { dirtyOnly: true, emptyAndNullAsEqual: true }', () => {
        const sourceObj = {
            prop1: ''
        };

        const modObj = {
            prop1: (null as unknown) as string
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, {
            dirtyOnly: true,
            emptyAndNullAsEqual: true
        });

        void expect(isDirty).toBeFalsy();
    });

    it('should be dirty when simple values are not the same - boolean - { dirtyOnly: true }', () => {
        const sourceObj = {
            prop1: true
        };

        const modObj = {
            prop1: false
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, { dirtyOnly: true });

        void expect(isDirty).toBeTruthy();
    });

    it('should NOT be dirty when simple values are the same - boolean - { dirtyOnly: true }', () => {
        const sourceObj = {
            prop1: true
        };

        const modObj = {
            prop1: true
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, { dirtyOnly: true });

        void expect(isDirty).toBeFalsy();
    });

    it('should be dirty when simple values are not the same - number - { dirtyOnly: true }', () => {
        const sourceObj = {
            prop1: 2
        };

        const modObj = {
            prop1: 3
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, { dirtyOnly: true });

        void expect(isDirty).toBeTruthy();
    });

    it('should NOT be dirty when simple values are the same - number - { dirtyOnly: true }', () => {
        const sourceObj = {
            prop1: 2
        };

        const modObj = {
            prop1: 2
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, { dirtyOnly: true });

        void expect(isDirty).toBeFalsy();
    });

    it('should be dirty when simple values are not the same - Date - { dirtyOnly: true }', () => {
        const sourceObj = {
            prop1: new Date('20201010')
        };

        const modObj = {
            prop1: new Date()
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, { dirtyOnly: true });

        void expect(isDirty).toBeTruthy();
    });

    it('should NOT be dirty when simple values are the same - Date - { dirtyOnly: true }', () => {
        const d = new Date();
        const sourceObj = {
            prop1: d
        };

        const modObj = {
            prop1: d
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, { dirtyOnly: true });

        void expect(isDirty).toBeFalsy();
    });
});
