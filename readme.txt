  ____    ___                            ____                                  
 /\  _ \ /\_ \                          /\  _ \                                
 \ \ \_\ \//\ \      __     ____      __\ \ \_\_\    __     __     _ __  ____  
  \ \  _ < \ \ \   / __ \  /\_   \  / __ \ \ \ __  / __ \ / __ \  /\  __\  __\ 
   \ \ \_\ \\_\ \_/\ \_\ \_\/_/  /_/\  __/\ \ \/  \\  __//\ \_\ \_\ \ \/\__   \
    \ \____//\____\ \__/ \_\ /\____\ \____\\ \____/ \____\ \__/ \_\\ \_\/\____/
     \/___/ \/____/\/__/\/_/ \/____/\/____/ \/___/ \/____/\/__/\/_/ \/_/\/___/ 

                               JavaScript Toolkit
                      Version 1.1.0-s.1, January 1st, 2013
                               www.blazegears.com



  Contents
--------------------------------------------------------------------------------
    I. About
   II. Getting Started
  III. License
   IV. Credits
    V. Version History



  I. About
--------------------------------------------------------------------------------

  BlazeGears is a small JavaScript library, which aims to ease the development
  of modern websites and address some of the shortcomings of the language.
  
  The library's main features are:
    - Class declaration,
    - HTML templating,
    - date and number formatting,
    - managing variables stored in URLs,
    - form generation and validation,
    - pagination management,
    - and XML request management.
  
  It's known to work in Chrome, Firefox 2+, and Internet Explorer 6+.



  II. Getting Started
--------------------------------------------------------------------------------

  All the files that are required to use BlazeGears can be found in the
  "Modules" directory. The first file that must be included is
  "BlazeGears.js", which contains the most essentials functions that will be
  required by the other classes.
  
  The second file that's supposed to be included is "BlazeGears.BaseClass.js",
  which is the superclass for all the standard BlazeGears classes. However, if
  you're not planning to use any of these classes, the BaseClass can be
  omitted as well.
  
  After this, the rest of the classes can be included as well. Please note
  that the classes won't automatically include their superclasses or
  dependencies, since JavaScript doesn't provide a proper way to do this. The
  superclasses and the dependencies are listed in the documentation.
  
  The style sheet and template files are not required to be included at all.
  These files are only provided as a reference for customization, their
  compressed content is already present in the JavaScript files.
  
  A selection of basic examples is bundled with BlazeGears, each showcasing
  the use of a feature. These examples are included in the documentation and
  are available in plain text format, too.



  III. License
--------------------------------------------------------------------------------

  BlazeGears is licensed under the zlib/libpng license. The full license text
  is available at: http://www.blazegears.com/license.txt



  IV. Credits
--------------------------------------------------------------------------------

  BlazeGears was designed and coded by Gabor Soos.
  
  Appreciation and many thanks go to the following people:
  
    - Marcel Hellkamp, the creator of the BottlePy Framework and its Simple
      Template (http://bottlepy.org), which was the main inspiration for the
      BlazeGears Templating Language.
    
    - Justin Tulloss, the programmer behind the Cobra Library
      (https://github.com/JustinTulloss/cobra), which highly influenced the
      development of my own class declaration interface.
    
    - Greg Valure, the developer of Natural Docs (http://www.naturaldocs.org),
      who made it possible to present my horrible documentation in such a neat
      way.



  V. Version History
--------------------------------------------------------------------------------

  - Version 1.1.0-s.1, January 1st, 2013
    - Made a mistake in the change log of the previous version, the method
      that supersedes the BlazeGears.BGTL.parse method is called
      compileTemplate, not parseTemplate.
  
  - Version 1.1.0-s, December 31st, 2012
    - Superseded the BlazeGears.cloneArray function with the
      BlazeGears.cloneObject alias.
    - Superseded the BlazeGears.escape function with the BlazeGears.escapeHtml
      alias.
    - Superseded the BlazeGears.generateFlash function with the
      BlazeGears.renderFlash alias.
    - Superseded the BlazeGears.getEntity function with the
      BlazeGears.getEntityValue alias.
    - Superseded the BlazeGears.isObject function with the
      BlazeGears.isAnonymousObject alias.
    - Superseded the BlazeGears.updateEntity function with the
      BlazeGears.setEntityValue alias.
    - Superseded the BlazeGears.BGTL.parse method with the
      BlazeGears.BGTL.compileTemplate alias.
    - Superseded the BlazeGears.Form.generate method with the
      BlazeGears.Form.render alias.
    - Superseded the BlazeGears.FragVars.getFragVars method with the
      BlazeGears.FragVars.getFragVarValues alias.
    - Superseded the BlazeGears.FragVars.setFragVars method with the
      BlazeGears.FragVars.setFragVarValues alias.
    - Superseded the BlazeGears.Paginator.generate method with the
      BlazeGears.Paginator.render alias.
    - Deprecated the BlazeGears.Class function.
    - Deprecated the BlazeGears.Singleton function.
    - Added the BlazeGears.isBoolean method, which determines if a variable is
      a boolean.
    - Added the BlazeGears.BGTL.TemplateInterface class, which is used for
      documenting the members of the parsed templates.
    - Added the BlazeGears.Classes namespace, which supersedes the class
      declaring functionality of the BlazeGears namespace.
    - Added the BlazeGears.Classes.ClassInterface and
      BlazeGears.Classes.SingletonInterface classes, which are used for
      documenting the default members available for declared classes.
    - Added the BlazeGears.Formats.enableUTCTime method, which can be used to
      switch between the UTC and local time zone.
    - Fixed the bug where the BlazeGears.isInArray method would incorrectly
      handle the recursive searches.
    - Fixed the bug where the variable type determining functions would return
      an incorrect result if the variable's constructor included the sought
      object's name.
    - Fixed the bug where constructing the first FragVars object anytime other
      than during page loading would break the page.
    - Fixed the bug where mixing the order of regular and static members
      during class declaration would delete some members.
    - Fixed the bug where the padding and casing modifiers wouldn't work on
      some Unix date format specifiers.
    - Fixed the bug where the Unix century specifiers would generate a
      different value than the date command.
    - Fixed the bug where the %c Unix date format specifier would use the
      incorrect padding character.
    - Moved the BlazeGears.Form.Field, BlazeGears.Form.Option, and
      BlazeGears.FragVars.FragVar classes to their own separate files.
    - Removed some variables accidentally introduced into the global scope.
    - Removed most of the eval'd functionality, so the code can be minified
      using some more aggressive compilation methods.
    - The main features of library are now unit tested.
  
  - Version 1.0.3-s, July 21st, 2012
    - Reverted the fix made to the BlazeGears.createEntity function in the
      previous release, because the original functionality was correct.
    - Fixed the bug where the static version of the BlazeGears.Class.__super__
      method wouldn't do anything, when it can't find the sought method. Now
      it will throw an error in such a case.
  
  - Version 1.0.2-s, July 17th, 2012
    - Fixed the bug where the BlazeGears.Class.__super__ method wouldn't do
      anything, when it can't find the sought method. Now it will throw an
      error in such a case.
    - Fixed the bug where the BlazeGears.createEntity method wouldn't do
      anything, if the suggested entity ID was already in use. Now it will
      throw an error in such a case.
  
  - Version 1.0.1-s.1, February 3rd, 2012
    - Updated the readme and license files.
  
  - Version 1.0.1-s, January 29th, 2012
    - Fixed the declaration of BlazeGears.Formats, which is now a singleton.
    - Fixed the bug where declaring an instance and a static member of the
      same name would let them coexist, instead of overwriting the prior
      member.
    - Fixed the bug where the BlazeGears.Class.__super__ method would never
      return anything.
  
  - Version 1.0.0-s, August 29th, 2011
    - The first public release.
