import { FormConfiguration } from './configuration.interface';
import * as defaultFields from './form-fields-factory';

export class DefaultFormConfiguration implements FormConfiguration {

    getFormConfiguration() {
        const defaultData = defaultFields.createDefaultField();
        return defaultData.getFieldData();
    }
}