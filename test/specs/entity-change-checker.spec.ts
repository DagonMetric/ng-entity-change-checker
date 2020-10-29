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

    // Simple values
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

    // Array values
    it('should be dirty when array values are not the same - equal lengths - { dirtyOnly: true }', () => {
        const sourceObj = {
            prop1: ['a', 'b']
        };

        const modObj = {
            prop1: ['b', 'a']
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, { dirtyOnly: true });

        void expect(isDirty).toBeTruthy();
    });

    it('should be dirty when array values are not the same - unequal lengths - { dirtyOnly: true }', () => {
        const sourceObj = {
            prop1: ['a', 'b']
        };

        const modObj = {
            prop1: ['a', 'b', 'c']
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, { dirtyOnly: true });

        void expect(isDirty).toBeTruthy();
    });

    it('should NOT be dirty when array values are the same - { dirtyOnly: true }', () => {
        const sourceObj = {
            prop1: ['a', 'b', 100, true],
            prop2: [{ a: [1, 2, 3] }, { b: ['a', 'b', 'c'] }]
        };

        const modObj = {
            prop1: ['a', 'b', 100, true],
            prop2: [{ a: [1, 2, 3] }, { b: ['a', 'b', 'c'] }]
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, { dirtyOnly: true });

        void expect(isDirty).toBeFalsy();
    });

    // Object values
    it('should be dirty when object are not the same { dirtyOnly: true }', () => {
        const sourceObj = {
            prop1: {
                a: 'a'
            }
        };

        const modObj = {
            prop1: {
                a: 'b'
            }
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, { dirtyOnly: true });

        void expect(isDirty).toBeTruthy();
    });

    it('should NOT be dirty when object arethe same { dirtyOnly: true }', () => {
        const sourceObj = {
            prop1: {
                a: 'a'
            }
        };

        const modObj = {
            prop1: {
                a: 'a'
            }
        };

        const isDirty = entityChangeChecker.checkChanges(modObj, sourceObj, { dirtyOnly: true });

        void expect(isDirty).toBeFalsy();
    });
});
