/**
 * global util functions
 */


angular.module('app')
  .factory('util', ['$log', '$translate', '$ionicPopup', function($log, $translate, $ionicPopup) {

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
        if (!this.isDefined(formDef)) {formDef = {};}
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
      },
      /**
       * generates the view out of the form definition
       *
       * ++++++++++ this version can NOT handle array structured data ++++++++++++
       *
       * @param record    the raw data from the record
       * @param formDef   the definition of the view
       * @returns array   the array to display
       *   - value
       *   - label
       *   - icon
       *   - format     (to display with dates)
       */
      view : function(record, formDef) {
        var result = [];
        for (var def in formDef) {
          if (formDef.hasOwnProperty(def)) {
            try {
              if (this.isDefined(record[def])) {
                result.push({
                  label: this.isDefined(record[def][0].label) ? record[def][0].label : formDef[def].labels[0],
                  icon: formDef[def].icon,
                  value: record[def][0].value
                });
              }
            } catch (err) {
              $log.error('util.view', err);
            } // just not adding the field
          }
        }
        return result;
      },
      /**
       * translates all the labels and message to the current language
       * @param form
       */
      translateForm : function(formDef) {
        var lbls, msgs;
        for (var fld in formDef) {
          if (formDef.hasOwnProperty(fld)) {
            if (this.isDefined(formDef[fld].labels)) {
              lbls = [];
              for (var lbl in formDef[fld].labels) {
                lbls.push($translate.instant(formDef[fld].labels[lbl]));
              }
              formDef[fld].labels = lbls;
            }
            if (this.isDefined(formDef[fld].validationMessage)) {
              msgs = {};
              for (var msg in formDef[fld].validationMessage) {
                msgs[msg] = $translate.instant(formDef[fld].validationMessage[msg])
              }
              formDef[fld].validationMessage = msgs;
            }
          }
        }
        return formDef;
      },
      randomKey : function(prefix) {
        // get currrent time
        var time = new Date().getTime(), sixteen = 16;
        // create UUID by replacing the template string
        return (this.isDefined(prefix) ? prefix : '') + "-xxxxxxxxxx".replace(/[xy]/g, function (match) {
          var remainder = (time + sixteen * Math.random()) % sixteen | 0;
          // update for next match
          time = Math.floor(time / sixteen);
          // check matched character
          return (match == "x" ? remainder : remainder & 7 | 8).toString(sixteen);
        });
      }


    }
  }]);