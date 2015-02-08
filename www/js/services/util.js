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
       * convert the internal definition to the json definition
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
      }

    }
  }]);