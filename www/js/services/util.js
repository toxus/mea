/**
 * global util functions
 */
angular.module('app')
  .factory('util', ['$log', function($log) {

    /**
     * returns the label from the dataField if exist otherwise fields[fieldIndex].labels the first
     * if no labels defined it return fieldIndex
     * @param dataField
     * @param fieldIndex
     * @private
     */
    function _labelFromDef(dataField, formDef, defaultVal) {
      if (typeof dataField.label !== 'undefined') {
        return dataField.label;
      } else if (typeof formDef.labels !== 'undefined') {
        if (typeof formDef.labels === 'string') {
          return formDef.labels;
        } else {
          return formDef.labels[0];
        }
      } else {
        return defaultVal;
      }
    }


    return {
      /**
       * returns true if object is defined
       * @param obj
       * @returns {boolean}
       */
      isDefined : function(obj){
        return typeof obj !== 'undefined';
      },
      /**
       * convert the internal definition to the json definition the can show the form
       *
       * @param formDef
       */
      jsonForm : function(formDef) {
        var result = {};
        var required = [];
        for (fieldId in formDef) {
          var fieldDef = formDef[fieldId];
          var item = {};
          if (!fieldDef.isArray) {
            item.title = _labelFromDef({}, formDef, fieldId );
            item.type  = typeof fieldDef.type === 'undefined' ? 'string' : fieldDef.type;
            if (this.isDefined(fieldDef.html5type)) {
              item['x-schema-form'] = {
                html5type: fieldDef.html5type
              };
            }
            if (fieldDef.isRequired) {
              required.push(fieldId);
            }
            if (this.isDefined(fieldDef.validationMessage)) {
              item.validationMessage = fieldDef.validationMessage;
            }
          } else {  // it's an array
            item.type = 'array';
            if (fieldDef.maxItems) { item.maxItems = fieldDef.maxItems; }
            // if a multi field array definition change it here
            var items = {
              type: 'object',
              properties : {}
            };
            items.properties.labels = {
              type : 'string',
              title : 'label'
            };
            items.properties.value = {
              type : 'string'
            }
            item.items = items;
          }
          result[fieldId] = item;
        }

        var a = {
          type : "object",
          properties : result,
          required : required
        };
        $log.log('jsonForm:', a);
        return a;
      },
      /**
       * convert the data into the model definition that can be used by the jsonForm
       *
       * ++++++++++ this version can NOT handle array structured data ++++++++++++
       *
       * @param data      the data from the PouchDB
       * @param formDef   the definition of the jsonForm
       * @returns array   the model data used for editing the jsonForm
       */
      dataToModel : function(data, formDef) {
        var result = [];
        for (var def in data) {
          if (data.hasOwnProperty(def)) {
            if (this.isDefined(formDef[def] )) { // field is editable
              var f = data[def];
              var item = {};
              if (!f.isArray) {
                result[def] = f[0].value
              } else {
                $log.warning('util.dataToModell: the array fields are not implemented');
              }
            }
          }
        }
        return result;
      },
      /**
       * convert the form input into the record by only change the _vmFields
       *
       * ++++++++++ this version can NOT handle array structured data ++++++++++++
       *
       * @param formData  data returned by editing
       * @param record    data loaded from disk
       * @param formDef   the definition of the form used
       * @returns changed record or false if nothing changed
       */
      modelToData: function(formData, record, formDef) {
        var didChange = false;
        for (var def in formDef) {
          if (formDef.hasOwnProperty(def)) {
            if (this.isDefined(formData[def]) && formData[def] != '') { // field is there
              if (this.isDefined(record[def]) && this.isDefined(record[def][0])) {
                didChange |= formData[def] != record[def][0].value;
                record[def][0].value = formData[def];
              } else {
                didChange = true;
                record[def] = [
                  { value: formData[def] }
                ];
              }
            } else {  // field is not there
              if (this.isDefined(record[def]) && this.isDefined(record[def][0])) {
                didChange = true;
                delete record[def];
              }
            }
          }
        }
        if (didChange) {
          return record;
        } else {
          return false;     // nothing did change
        }
      }
    }
  }]);