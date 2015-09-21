'use strict';

angular.module('lformsWidget')
  .controller('PanelTableCtrl',
    ['$scope', '$compile', '$http', '$location', '$anchorScroll', 'selectedFormData', 'LF_CONSTANTS',
      function ($scope, $compile, $http, $location, $anchorScroll, selectedFormData, LF_CONSTANTS) {

      $scope.debug = false;

      // Configuration data that controls form's UI
      $scope.formConfig = {
        showQuestionCode: false,   // whether question code is displayed next to the question
        showCodingInstruction: false // whether to show coding instruction inline. (false: inline; true: in popup)
      };

        // Provide blank image to satisfy img tag. Bower packaging forces us to
        // avoid using image files from html templates, therefore using base64
        // encoding for a 1x1 blank gif file.
      $scope.blankGifDataUrl = LF_CONSTANTS.BLANK_GIF_DATAURL;

      // Default option for calendar
      $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0',
        showOn: 'button',
        buttonImage: LF_CONSTANTS.BLANK_GIF_DATAURL,
        buttonImageOnly: true,

        constrainInput: false,
        showOtherMonths: true,
        selectOtherMonths: true,
        showMonthAfterYear: true,
        buttonText: ""
      };

      // base config for ui-select2
      $scope.tagOptions = {
        width: "100%",
        maximumSelectionSize:1,
        minimumInputLength: 0,
        // minimumResultsForSearch: 6,   // -1 will hide the search(input) field
        minimumResultsForSearch: -1,
        allowClear: false,
        selectOnBlur: false,
        multiple: false
        // simple_tags: false
      };

      // index of active row
      $scope.activeRow = null;

      /**
       * Set the active row in table
       * @param index index of an item in the lforms form items array
       */
      $scope.setActiveRow = function(index) {
        $scope.activeRow = index;
      }

      /**
       * Get the css class for the active row
       * @param index index of an item in the lforms form items array
       * @returns {string}
       */
      $scope.getActiveRowClass = function(index) {
        return $scope.activeRow === index ? "active-row" : "";

      }

      /**
       * Reset lfData, by assign the object from the service directly
       */
      $scope.resetPanelWidgetData = function() {
        $scope.lfData = selectedFormData.getFormData();
      }

      /**
       * Reset the lfData
       * by listening on a broadcast event
       */
      $scope.$on('NewFormData', function(event, panelData) {
        $scope.lfData = panelData;
      });

      /**
       * Check if the current question item is to be displayed in a horizontal table
       * @param index
       * @returns {*}
       */
      $scope.inHorizontalTable = function(index) {
        return $scope.lfData.inHorizontalTable(index);
      };

      /**
       * Check if the current question is a title for a horizontal table
       * @param index index of an item in the lforms form items array
       * @returns {*}
       */
      $scope.isHorizontalTableTitle = function(index) {
        return $scope.lfData.isHorizontalTableTitle(index);
      };

      /**
       * Check if the form is finished
       * @returns {boolean|*|*}
       */
      $scope.isFormDone = function() {
        return $scope.lfData.isFormDone();
      };

      /**
       * Check if input field is readonly(0), writable(1), or readonly for existing data, writable for new data(2)
       * @param item an item in the lforms form items array
       * @returns {boolean}
       */
      $scope.isReadOnly = function(item) {
        var ret = false;
        if (item.editable && item.editable == "0") {
          ret = true;
        }
        else if (item.calculationMethod) {
          ret = true;
        }
        return ret;
      };

      /**
       * Run a formula that is defined on the item.
       * @param item the 'target' item where the calculation result is set.
       */
      $scope.runFormula = function(item) {
        if (item.calculationMethod && item.calculationMethod.name) {
          var result = $scope.lfData.getFormulaResult(item);
          item._value = result;
        }
      };

      /**
       * Check if an answer is required
       * @param item an item in the lforms form items array
       * @returns {boolean}
       */
      $scope.isAnswerRequired = function(item) {
        var ret=false;
        if (item.answerCardinality &&
            item.answerCardinality.min &&
            item.answerCardinality.min >= 1) {
          ret = true
        }
        return ret;
      };

      /**
       * Check if multiple answers are allowed
       * @param item an item in the lforms form items array
       * @returns {boolean}
       */
      $scope.hasMultipleAnswers = function(item) {
        var ret=false;
        if (item.answerCardinality &&
            item.answerCardinality.max &&
            (item.answerCardinality.max >= 1 || item.answerCardinality.max ==-1) ) {
          ret = true
        }
        return ret;
      };

      /**
       * Check data type and answer cardinality
       * @param item an item in the lforms form items array
       * @returns {string}
       */
      $scope.getFieldType = function(item) {
        var ret='';
        if (item.header) {
          ret=''
        }
        // if the BMI target item's dataType is "REAL", which is treated as type=number in angular,
        // then the value is not displayed in the field. It seems like a bug in angular.
        // But for now just make it not a number type.
        else if (item.formula != undefined && !jQuery.isEmptyObject(item.formula)) {
          ret = "ST"
        }
        else if (item.answerCardinality && item.answerCardinality.max) {
          ret = item.dataType + item.answerCardinality.max
        }
        else {
          ret = item.dataType
        }
        return ret;

      };

      /**
       * Check if there's a unit list
       * @param item an item in the lforms form items array
       * @returns {string}
       */
      $scope.checkUnits = function(item) {
        var ret;
        if (item.units && jQuery.isArray(item.units)) {
          ret = 'list'
        }
        else {
          ret = 'none'
        }
        return ret;
      };

      /**
       * Get the CSS class for items in the targets of a skip logic
       * @param item an item in the lforms form items array
       * @returns {string|*}
       */
      $scope.getSkipLogicClass = function(item) {
        var widgetData = $scope.lfData;
        return widgetData.getSkipLogicClass(item);
      };

      /**
       * Check if the item has coding instructions
       * @param item an item in the lforms form items array
       * @returns {string}
       */
      $scope.hasCodingInstructions = function(item) {
        var ret;
        if (item.codingInstructions && item.codingInstructions.length > 0) {
          ret = true;
        }
        return ret;
      };

      /**
       * Get formatted coding instructions
       * @param item an item in the lforms form items array
       * @returns {string}
       */
      $scope.getCodingInstructions = function(item) {
        var ret = '';
        if (item.codingInstructions) {
          ret = "(" + item.codingInstructions + ")"
        }
        return ret;
      };


      /**
       * Check if the item or the group is repeatable
       * i.e. questionCardinality.max > 1
       * Note: questionCardinality.min should always be 1. 0 is meaningless imho.
       * @param item an item in the lforms form items array
       * @returns {boolean}
       */
      $scope.isRepeatable = function(item) {
        var ret = false;
        if (item.questionCardinality &&
            (item.questionCardinality.max == -1 || item.questionCardinality.max >1) ) {
          ret = true;
        }
        return ret;
      };

      /**
       * Get the sequence number for the current repeating item
       * @param item an item in the lforms form items array
       * @returns {string}
       */
      $scope.getRepeatingSN = function(item) {
        var ret = '';
        if ($scope.isRepeatable(item)) {
          var sn = item._idPath.slice(1);
          ret = sn.replace(/\//g,'.');
        }
        return ret;
      };

      /**
       * Watch on the values of each item
       * When in a deep watch mode, angular makes a copy of the watched object.
       * Only the input values need to be watch. Not the entire lfData,
       * which could be huge depends on the actual form data.
       * todo: performance optimization!!!
       */
      $scope.$watch(
        //get the values and watch on those values only
        function () {
          return $scope.lfData && $scope.lfData.itemList ? $scope.lfData.itemList.map(function(item) {return item._value;}) : null;
        },
        function() {
          $scope.watchOnValueChange();
        },
        true
      );

      $scope.watchOnValueChange = function() {
        var widgetData = $scope.lfData;
        if (widgetData) {
          widgetData.watchOnValueChange();
        }
      };

      /**
       *  Returns the list options hash needed by the autocomplete-lhc
       *  directive.
       * @param questionInfo the data structure for the question on the form
       */
      $scope.autocompLhcOpt = function(questionInfo) {
        var maxSelect = questionInfo.answerCardinality ? questionInfo.answerCardinality.max : 1;
        if (maxSelect !== '*') {
          if (maxSelect == -1) // -1 or "-1"
            maxSelect = '*';
          else if (typeof maxSelect === 'string')
            maxSelect = parseInt(maxSelect);
        }

        var ret = {
          matchListValue: questionInfo.dataType === "CNE",
          maxSelect: maxSelect,
         };

        var url = questionInfo.externallyDefined;
        if (url) {
          ret.url = url;
          ret.autocomp = true;
          ret.nonMatchSuggestions = false;
        }
        else {
          var listItems = [], answers = [];

          // 'answers' might be null even for CWE
          if (questionInfo.answers) {
            if (angular.isArray(questionInfo.answers)) {
              answers = questionInfo.answers;
            }
            else if (questionInfo.answers !== "" && $scope.lfData.answerLists) {
              answers = $scope.lfData.answerLists[questionInfo.answers];
            }
          }

          // Just check the first answer to see if there's a label
          // (Labels should be on all answers if one has a label.)
          var hasLabel;
          if (answers.length > 0 && answers[0].label &&
              typeof answers[0].label === 'string' && answers[0].label.trim()) {
            hasLabel = true;
          }
          ret.addSeqNum = !hasLabel

          // Modify the display label (answer text) for each answer.
          var defaultValue;
          for(var i= 0, iLen = answers.length; i<iLen; i++) {
            var answerData = angular.copy(answers[i]);
            var label = answerData.label ? answerData.label + ". " + answerData.text : answerData.text;
            answerData.text = label;
            listItems.push(answerData);

            // check the current selected value
            if (questionInfo._value && questionInfo._value.text == label && questionInfo._value.code == answers[i].code) {
              defaultValue = questionInfo._value.text;
            }
          }

          ret.listItems = listItems;
          if (defaultValue === undefined) {
            // See if there is a default value defined for the question.
            defaultValue = questionInfo.defaultAnswer;
          }
          if (defaultValue !== undefined && defaultValue !== null)
            ret.defaultValue = defaultValue;
        }

        return ret;
      };


      /**
       *  Returns the list options hash needed by the autocomplete-lhc
       *  directive for the units field.
       * @param questionInfo the data structure for the question on the form
       */
      $scope.unitsAutocompLhcOpt = function(questionInfo) {
        var listItems = [], answers = questionInfo.units, ret ={};

        // Modify the label (question text) for each question.
        var defaultValue;
        for (var i= 0, ilen = answers.length; i<ilen; i++) {
          var answerData = answers[i];
          listItems.push({text: answerData.name,
                       value: answerData.name,
                       code: answerData.code})
          if (answerData.default)
            defaultValue = answerData.name;
        }

        ret = {
          listItems: listItems,
          matchListValue: true
        };
        if (defaultValue !== undefined)
          ret.defaultValue = defaultValue;

        return ret;
      };

      /**
       * Get the CSS class on each item row
       * @param item an item in the lforms form items array
       * @returns {string}
       */
      $scope.getRowClass = function(item) {
        var eleClass = '';
        if (item._displayLevel_ > 0) {
          eleClass = 'panel_l' + item._displayLevel_;
        }
        if ($scope.isAnswerRequired(item)) {
          eleClass += ' test_required';
        }
        if (item.header) {
          eleClass += ' panel_header';
        }
        if (item.newlyAdded) {
          eleClass += ' newly_added';
        }
        if (item.inTransition) {
          eleClass += ' in_transition';
        }
        if (item.layout == 'horizontal') {
          eleClass += ' horizontal';
        }

        return eleClass;
      };

      /**
       *  Get the CSS class for tree lines at the current level.
       *  Unlimited levels are supported, although the screen size limits the number of the levels that can be shown.
       * @param level the tree level index from left/root to right starting with 0
       * @param lastStatusList the list that contains the last sibling status the item on each level starting from root
       * @return {string} 'line1', 'line2', 'line3', or 'no_display'
       */
      $scope.getTreeLevelClass = function(level, lastStatusList) {
        var ret ='';
        // leaf node
        if (level === lastStatusList.length-1) {
          if (lastStatusList[level]) {
            ret = 'line2'
          }
          else {
            ret = 'line3';
          }
        }
        // non-leaf node
        else {
          if (lastStatusList[level] === undefined) {
            ret = 'no_display';
          }
          else if (lastStatusList[level]) {
            ret = '';
          }
          else {
            ret = 'line1';
          }
        }
        return ret;
      };

      /**
       *  Get the CSS class for the extra row that holds the field for "Please Specify" value
       *  The class name depends on the tree level class that this row id depending on.
       * @param level the tree level index from left/root to right starting with 0
       * @param lastStatusList the list that contains the last sibling status the item on each level starting from root
       * @return 'line1', 'line2', 'line3', or 'no_display'
       */
      $scope.getExtraRowTreeLevelClass = function(level, lastStatusList) {
        var ret = '', cssClass = $scope.getTreeLevelClass(level, lastStatusList);
        switch(cssClass) {
          case 'line1':
            ret = 'line1';
            break;
          case 'line2':
            ret = '';
            break;
          case 'line3':
            ret = 'line1';
            break;
          case '':
            ret = ''
            break;
          case 'no_display':
            ret = 'no_display';
            break;
          default:
            ret = '';
        }
        return ret;
      };

      /**
       * Add a repeating item or a repeating group
       * @param item an item in the lforms form items array
       */
      $scope.addOneRepeatingItem = function(item) {
        var objWidgetData = $scope.lfData;

        objWidgetData.addRepeatingItems(item);

        // scroll to the newly added item/group
        var prevHash = $location.hash();
        $location.hash(item._codePath+item._idPath);
        $anchorScroll();
        // restore the previous hash. otherwise the url displayed in browser will have the anchor value added
        $location.hash(prevHash);

        setTimeout(function() {
          $scope.removeNewlyAddedFlag();
        }, 10);
        setTimeout(function() {
          $scope.removeInTransitionFlag();
        }, 3000);
      };

      /**
       * Remove the newly shown flag for CSS transition effect
       */
      $scope.removeNewlyAddedFlag = function() {
        //console.log('in remove newly added flag')
        var objWidgetData = $scope.lfData;
        for (var i= 0, iLen=objWidgetData.items.length; i<iLen; i++) {
          if (objWidgetData.items[i].newlyAdded)     {
            objWidgetData.items[i].newlyAdded = false;
            objWidgetData.items[i].inTransition = true;
          }
        }
        $scope.$apply();
      };

      /**
       * Remove the flag for CSS transition effect.
       */
      $scope.removeInTransitionFlag = function() {
        //console.log('in remove newly added flag')
        var objWidgetData = $scope.lfData;
        if (objWidgetData) {
          for (var i= 0, iLen=objWidgetData.items.length; i<iLen; i++) {
            if (objWidgetData.items[i].inTransition)     {
              objWidgetData.items[i].inTransition = false;
            }
          }
          $scope.$apply();
        }
      };

      /**
       * Remove one repeating item in a group
       * @param item an item in the lforms form items array
       */
      $scope.removeOneRepeatingItem = function(item) {
        $scope.lfData.removeRepeatingItems(item);
      };

      // temp. for testing
      $scope.switchLayout = function(item) {
        if (item.layout == 'horizontal') {
          item.layout = 'vertical';
        }
        else {
          item.layout = 'horizontal';
        }

        $scope.lfData._resetFieldsForHorizontalTableLayout();
      };

      /**
       * Check if there's only one repeating item in a group
       * (so that the 'remove' button won't show on this item)
       * @param item an item in the lforms form items array
       * @returns {boolean}
       */
      $scope.hasOneRepeatingItem =function(item) {
        var recCount = $scope.lfData.getRepeatingItemCount(item);
        return recCount > 1 ? false : true;
      };

      /**
       * Check if the current horizontal table has one row only
       * @param item an item in the lforms form items array
       * @returns {boolean}
       */
      $scope.hasOneRepeatingRow = function(item) {
        var ret = false;
        var tableInfo = $scope.lfData._horizontalTableInfo[item._codePath + item._parentIdPath_];
        if (tableInfo && tableInfo.tableRows && tableInfo.tableRows.length === 1) {
          ret = true;
        }

        return ret;
      };


      /**
       * Check if the current item is the last item within one or more
       * repeating items (or groups) and return those containing repeating
       * items (or groups)
       * @param item an item in the lforms form items array
       * @return {boolean}
       */
      $scope.isLastItemInRepeatingItems = function(index) {
        return $scope.lfData.isLastItemInRepeatingItems(index);
      };


      /**
       * Check if the question needs an extra input
       * @param item an item in the lforms form items array
       * @returns {*}
       */
      $scope.needExtra = function(item) {
        var objWidgetData = $scope.lfData;
        var extra = objWidgetData.needExtra(item);
        return extra;
      };

      // for debug only. to be removed.
      $scope.onclick = function() {
        debugger
        var i = 1;
      };

      /**
       * Handle navigation keys
       * @param event keypress event
       */
      $scope.handleNavigationKeyEvent = function(event) {

        // supported arrow keys
        var arrow = $scope.lfData.Navigation.ARROW;

        // only when control key is also pressed
        if (event.ctrlKey &&
            jQuery.inArray(event.keyCode, [arrow.LEFT, arrow.UP, arrow.RIGHT, arrow.DOWN]) >= 0 ) {

          var objWidgetData = $scope.lfData;

          var nextId = event.target['id'], nextElement;
          // find the next element, bypass the invisible elements
          do {
            // get the DOM element id of next field
            nextId = objWidgetData.Navigation.getNextFieldId(event.keyCode, nextId);
            // get the next DOM element by ID
            nextElement = document.getElementById(nextId);
          } while (nextId && (!nextElement || !jQuery(nextElement).is(":visible")));

          // set the focus
          if (nextElement) {
            var currentElement = event.target;
            setTimeout(function() {
              nextElement.focus();
            }, 1);
            currentElement.blur();
          }
        }
      }
    }]);
