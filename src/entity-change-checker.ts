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

function isSampleValue(value: unknown): boolean {
    return !isObject(value) && !Array.isArray(value);
}

@Injectable({
    providedIn: 'root'
})
export class EntityChangeChecker {
    checkChanges<T extends Record<string, unknown>>(obj: T, sourceObj: T, dirtyOnly = false): boolean {
        return this.detectObjectChanges(obj, sourceObj, dirtyOnly);
    }

    private detectObjectChanges(
        obj: Record<string, unknown>,
        sourceObj: Record<string, unknown>,
        dirtyOnly: boolean
    ): boolean {
        const isTrackableEntity = ((obj as unknown) as TrackableEntity).trackingState != null;

        if (
            isTrackableEntity &&
            !dirtyOnly &&
            (((obj as unknown) as TrackableEntity).trackingState === TrackingState.Added ||
                ((obj as unknown) as TrackableEntity).trackingState === TrackingState.Deleted)
        ) {
            return true;
        }

        if (sourceObj == null) {
            if (isTrackableEntity && !dirtyOnly) {
                ((obj as unknown) as TrackableEntity).trackingState = TrackingState.Added;
            }

            return true;
        }

        let hasAnychanges = false;

        for (const key in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) {
                continue;
            }

            if (key === 'modifiedProperties' || key === 'trackingState') {
                continue;
            }

            const objValue = (obj as { [key: string]: unknown })[key];
            const sourceObjValue = (sourceObj as { [key: string]: unknown })[key];

            if (isSampleValue(objValue) || isSampleValue(sourceObjValue)) {
                if (!this.equalSampleValues(objValue, sourceObjValue)) {
                    hasAnychanges = true;

                    if (dirtyOnly) {
                        break;
                    }

                    if (isTrackableEntity && !dirtyOnly) {
                        ((obj as unknown) as TrackableEntity).modifiedProperties.push(key);
                        ((obj as unknown) as TrackableEntity).trackingState = TrackingState.Modified;
                    }
                }

                continue;
            }

            if (Array.isArray(objValue) || Array.isArray(sourceObjValue)) {
                if (
                    !objValue ||
                    !Array.isArray(objValue) ||
                    this.detectArrayValueChanges(objValue, sourceObjValue, dirtyOnly)
                ) {
                    hasAnychanges = true;

                    if (dirtyOnly) {
                        break;
                    }

                    if (isTrackableEntity && !dirtyOnly) {
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
                    this.detectObjectChanges(objValue, sourceObjValue, dirtyOnly)
                ) {
                    hasAnychanges = true;

                    if (dirtyOnly) {
                        break;
                    }

                    if (isTrackableEntity && !dirtyOnly) {
                        (obj as TrackableEntity).modifiedProperties.push(key);
                        (obj as TrackableEntity).trackingState = TrackingState.Modified;
                    }
                }

                continue;
            }
        }

        return hasAnychanges;
    }

    private detectArrayValueChanges(value: unknown[], sourceValue: unknown, dirtyOnly: boolean): boolean {
        // TrackingState.Added
        if (!sourceValue || !Array.isArray(sourceValue)) {
            return true;
        }

        const valueLength = value.length;
        const sourceValueLength = sourceValue.length;
        let hasAnyChanges = valueLength !== sourceValueLength;

        if (hasAnyChanges && dirtyOnly) {
            return true;
        }

        for (let i = value.length - 1; i >= 0; i--) {
            const item = value[i];
            const surceItem = sourceValueLength > i ? sourceValue[i] : null;

            if (this.detectValueChanges(item, surceItem, dirtyOnly)) {
                hasAnyChanges = true;

                if (dirtyOnly) {
                    break;
                }
            }
        }

        return hasAnyChanges;
    }

    private detectValueChanges(value: unknown, sourceValue: unknown, dirtyOnly: boolean): boolean {
        if (isSampleValue(value) || isSampleValue(sourceValue)) {
            return !this.equalSampleValues(value, sourceValue);
        }

        if (Array.isArray(value) || Array.isArray(sourceValue)) {
            if (!value || !Array.isArray(value)) {
                return true;
            }

            return this.detectArrayValueChanges(value, sourceValue, dirtyOnly);
        }

        if (isObject(value) || isObject(sourceValue)) {
            if (!value || typeof value !== 'object') {
                return true;
            }

            return this.detectObjectChanges(value, sourceValue, dirtyOnly);
        }

        return false;
    }

    private equalSampleValues(value: unknown, sourceValue: unknown): boolean {
        if (value === sourceValue) {
            return true;
        }

        if ((value == null || value === '') && (sourceValue == null || sourceValue === '')) {
            return true;
        }

        if ((sourceValue == null || sourceValue === '') && (value == null || value === '')) {
            return true;
        }

        if (isDate(value) && isDate(sourceValue) && (value as Date).getTime() === (sourceValue as Date).getTime()) {
            return true;
        }

        // true if both NaN, false otherwise
        return value !== value && sourceValue !== sourceValue;
    }
}
