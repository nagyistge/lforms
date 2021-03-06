# Change log

This project follows [Semantic Versioning](http://semver.org/).

## [11.1.1]  2017-04-14
- Used a different library (element resize detector) for checking 
  the container element's size, which can handle multiple rendered
  forms on a page.

## [11.1.0]  2017-03-27
### Added
- Added a viewMode option to the form and to the individual items to 
  control the layout  

## [11.0.5]  2017-03-20
### Fixed
- Fixed a bug in URL data type parsing.
  
## [11.0.4]  2017-03-06
### Changed
- Added a resize event listener on the container element to make the form 
  responsive in cases where container's size changes without a change in
  window size.
  
## [11.0.3]  2017-03-03
### Changed
- Changed some background color on section headers and buttons
- Made the form responsive to the container's size, not the screen's size

## [11.0.2]  2017-03-02
### Fixed
- Default values are now handled for questions whose answers are presented as
  radio buttons.  
- Also eliminated an unnecessary copy of answer data for the case when there is
  no label value for the answers.
- Corrected missing fonts in the pre-compiled version.
- Fixed display issues with the icon buttons.

## [11.0.1]  2017-02-24
### Changed
- Fixed the styles for forms where a question contains questions of sections

## [11.0.0]  2017-02-08
### Changed
- Redesigned the form template to make it responsive

## [10.0.0]   2016-12-06
### Changed
- Changed OBX4 value calculation method in HL7 messages. 

## [9.0.2]   2016-12-05
### Changed
- Updated a test form, and added a test to make sure a problem with the
  autocompletion stays fixed.

## [9.0.1]   2016-11-22
### Changed
- Changed the default style of TITLE row to be same as section headers. 

## [9.0.0]   2016-11-17
### Changed
- Updated the autocomplete-lhc package to version 10, in which URLs for search
  autcompleters now take a "maxList" parameter (in place of, but with opposite
  meaning to, the "autocomp" parameter).  Forms with URLs for search lists might
  need to be updated, or more likely the servers handling the URLs will need to
  be changed to handle the new parameter, which is the reason for the major
  version increment on this package.  The [Clinical Table Search
  Service](https://clin-table-search.lhc.nlm.nih.gov) supports the new
  autocomplete-lhc version with the addition of newer API URLs (v3 and higher).

## [8.1.2]   2016-11-08
### Fixed
- Fixed a bug in getting form data without questions that have empty values.

## [8.1.1]   2016-11-02
### Changed
- Changed a FHIR data processing function's name.

## [8.1.0]   2016-10-28
### Added
- Added preliminary support for generating FHIR DiagnosticReport data and merging
  it back into a form.
  
## [8.0.0]   2016-09-21
### Changed
- Updated the design and docs of the data control function.

## [7.6.1]   2016-09-21 
### Fixed
- Renamed the CSS class 'empty-question' to 'lf-empty-question' to avoid
  possible confusion.

## [7.6.0]   2016-08-12
### Added
- Added support for setting the code systems for the form and for questions.

## [7.5.0]   2016-08-09
### Added
- Added support for a new data type, NR (numeric range).

## [7.4.1]   2016-08-08 
### Fixed
- Prevented HTML tags in listColHeaders from rendering, to reduce the risk
  of XSS attacks.

## [7.4.0]   2016-08-05
### Added
- Added an option to hide the Units column/field.

## [7.3.0]   2016-08-04 
### Added
- A listColHeaders option for specifying column headers to appear over the lists
  for search fields (lists specified with "externallyDefined").

## [7.2.0]   2016-08-01
### Added
- Added an optional codingInstructionsFormat field on item level to specify 
  the format of coding instructions for each individual item.

### Fixed
- Added a missing polyfill.js file that should have been in 7.1.1.

## [7.1.1]   2016-07-29
### Changed
- Uncoded CWE values rendered as HL7 are now placed into OBX5.9.
- Adjusted formatting of HL7 output to allow the message lines to wrap after a
  repeat. 

## [7.1.0]   2016-07-21
### Added
- The code system of an answer list can now be specified in "answerCodeSystem"
  on individual items in a form definition.

## [7.0.0]   2016-07-13
### Added
- User data validations based on dataType and restrictions

### Changed
- Use a single namespace, LForms, for all LForms functions and objects. 

## [6.1.3]   2016-06-13
### Fixed
- Another CSS fix for IE.  This is a fix for the placeholder text for textareas,
  and should have been fixed as a part of the 6.1.1 changes, but was missed.

## [6.1.2]   2016-06-09
### Fixed
- Updated the autocomplete-lhc dependency (to 9.0.1) to get some fixes.

## [6.1.1]   2016-06-02
### Fixed
- Two CSS fixes for IE.

## [6.1.0]   2016-05-13
### Added
- Added a function to export user data in HL7 segments (in progress).

## [6.0.2]   2016-05-10
### Fixed
- Turned on "minification" of the distribution version of the JavaScript.

## [6.0.1]   2016-05-04
### Fixed
- Updated Protractor to work with new version of Firefox, and updated some
  tests to work with the new Protractor.

## [6.0.0]   2016-04-21
### Added
- A getFormData function to get complete form definition data, including
  user input data.
- Events are emitted when a repeating item or section is added or removed.
  
### Changed
- The existing getFormData function is renamed to getUserData.

## [5.7.0]   2016-04-19
### Added
- A 'list' template.
- A 'matrix' layout for section items, in addition to 'horizontal' and
  'vertical'.
- A attribute 'answerLayout' in the 'displayControl' field for items 
  that have answers.
- A 'displayControl' field in 'templateOptions' at the form level.
  
### Changed
- All existing template names are combined into a new 'table' template
- The existing 'layout' field is renamed as 'questionLayout' and moved 
  into the 'displayControl' field.

## [5.6.1]   2016-04-01
### Changed
- Field hints for search autocompleters were changed to read "Search for... "
  rather than "Select... " because for search autocompleters the user does not
  see a list until the first couple of characters are typed.

## [5.6.0]   2016-03-29
### Removed
- WidgetUtil.preprocessRIData.  This was an internal API, so it should not be
  a breaking change for anyone but ourselves.

