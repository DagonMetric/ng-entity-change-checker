import { Injectable } from '@angular/core';

import { TrackableEntity, TrackingState } from './trackable-entity';

// TODO: To review
function isObject(value: unknown): boolean {
    // return {}.toString.apply(value) === '[object Object]';
    return Object.prototype.toString.call(value) === '[object Object]';
}

function isDate(value: unknown): boolean {
    // return {}.toString.apply(value) === '[object Date]';
    return Object.prototype.toString.call(value) === '[object Date]';
}

function isSimpleValue(value: unknown): boolean {
    return !isObject(value) && !Array.isArray(value);
}

function equalSampleValues(value: unknown, sourceValue: unknown, emptyAndNullAsEqual?: boolean): boolean {
    if (value === sourceValue) {
        return true;
    }

    if (emptyAndNullAsEqual && (value == null || value === '') && (sourceValue == null || sourceValue === '')) {
        return true;
    }

    if (isDate(value) && isDate(sourceValue) && (value as Date).getTime() === (sourceValue as Date).getTime()) {
        return true;
    }

    // true if both NaN, false otherwise
    return value !== value && sourceValue !== sourceValue;
}

const ModifiedPropertiesName = 'modifiedProperties';
const TrackingStateName = 'trackingState';

export interface EntityCheckingOptions {
    dirtyOnly?: boolean;
    emptyAndNullAsEqual?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class EntityChangeChecker {
    checkChanges<T>(obj: T, sourceObj: T, options: EntityCheckingOptions = {}): boolean {
        return this.detectObjectChanges(obj, sourceObj, options);
    }

    private detectObjectChanges(obj: unknown, sourceObj: unknown, options: EntityCheckingOptions): boolean {
        const isTrackableEntity = (obj as TrackableEntity).trackingState != null;

        if (
            isTrackableEntity &&
            ((obj as TrackableEntity).trackingState === TrackingState.Added ||
                (obj as TrackableEntity).trackingState === TrackingState.Deleted)
        ) {
            return true;
        }

        if (sourceObj == null) {
            if (isTrackableEntity && !options.dirtyOnly) {
                (obj as TrackableEntity).trackingState = TrackingState.Added;
            }

            return true;
        }

        let hasAnychanges = false;

        for (const key in obj as Record<string, unknown>) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) {
                continue;
            }

            if (key === ModifiedPropertiesName || key === TrackingStateName) {
                continue;
            }

            const objValue = (obj as Record<string, unknown>)[key];
            const sourceObjValue = (sourceObj as Record<string, unknown>)[key];

            if (isSimpleValue(objValue) || isSimpleValue(sourceObjValue)) {
                if (!equalSampleValues(objValue, sourceObjValue, options.emptyAndNullAsEqual)) {
                    hasAnychanges = true;

                    if (options.dirtyOnly) {
                        break;
                    }

                    if (isTrackableEntity && !options.dirtyOnly) {
                        (obj as TrackableEntity).modifiedProperties = (obj as TrackableEntity).modifiedProperties || [];
                        (obj as TrackableEntity).modifiedProperties.push(key);
                        (obj as TrackableEntity).trackingState = TrackingState.Modified;
                    }
                }

                continue;
            }

            if (Array.isArray(objValue) || Array.isArray(sourceObjValue)) {
                if (
                    !objValue ||
                    !Array.isArray(objValue) ||
                    this.detectArrayValueChanges(objValue, sourceObjValue, options)
                ) {
                    hasAnychanges = true;

                    if (options.dirtyOnly) {
                        break;
                    }

                    if (isTrackableEntity && !options.dirtyOnly) {
                        (obj as TrackableEntity).modifiedProperties = (obj as TrackableEntity).modifiedProperties || [];
                        (obj as TrackableEntity).modifiedProperties.push(key);
                        (obj as TrackableEntity).trackingState = TrackingState.Modified;
                    }
                }

                continue;
            }

            if (isObject(objValue) || isObject(sourceObjValue)) {
                if (
                    !objValue ||
                    typeof objValue !== 'object' ||
                    this.detectObjectChanges(objValue, sourceObjValue, options)
                ) {
                    hasAnychanges = true;

                    if (options.dirtyOnly) {
                        break;
                    }

                    if (isTrackableEntity && !options.dirtyOnly) {
                        (obj as TrackableEntity).modifiedProperties = (obj as TrackableEntity).modifiedProperties || [];
                        (obj as TrackableEntity).modifiedProperties.push(key);
                        (obj as TrackableEntity).trackingState = TrackingState.Modified;
                    }
                }

                continue;
            }
        }

        return hasAnychanges;
    }

    private detectArrayValueChanges(value: unknown[], sourceValue: unknown, options: EntityCheckingOptions): boolean {
        // TrackingState.Added
        if (!sourceValue || !Array.isArray(sourceValue)) {
            return true;
        }

        const valueLength = value.length;
        const sourceValueLength = sourceValue.length;
        let hasAnyChanges = valueLength !== sourceValueLength;

        if (hasAnyChanges && options.dirtyOnly) {
            return true;
        }

        for (let i = value.length - 1; i >= 0; i--) {
            const item = value[i];
            const surceItem = sourceValueLength > i ? (sourceValue[i] as unknown) : null;

            if (this.detectValueChanges(item, surceItem, options)) {
                hasAnyChanges = true;

                if (options.dirtyOnly) {
                    break;
                }
            }
        }

        return hasAnyChanges;
    }

    private detectValueChanges(value: unknown, sourceValue: unknown, options: EntityCheckingOptions): boolean {
        if (isSimpleValue(value) || isSimpleValue(sourceValue)) {
            return !equalSampleValues(value, sourceValue, options.emptyAndNullAsEqual);
        }

        if (Array.isArray(value) || Array.isArray(sourceValue)) {
            if (!value || !Array.isArray(value)) {
                return true;
            }

            return this.detectArrayValueChanges(value, sourceValue, options);
        }

        if (isObject(value) || isObject(sourceValue)) {
            if (!value || typeof value !== 'object') {
                return true;
            }

            return this.detectObjectChanges(value, sourceValue, options);
        }

        return false;
    }
}
