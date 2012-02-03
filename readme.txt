  ____    ___                            ____                                  
 /\  _ \ /\_ \                          /\  _ \                                
 \ \ \_\ \//\ \      __     ____      __\ \ \_\_\    __     __     _ __  ____  
  \ \  _ < \ \ \   / __ \  /\_   \  / __ \ \ \ __  / __ \ / __ \  /\  __\  __\ 
   \ \ \_\ \\_\ \_/\ \_\ \_\/_/  /_/\  __/\ \ \/  \\  __//\ \_\ \_\ \ \/\__   \
    \ \____//\____\ \__/ \_\ /\____\ \____\\ \____/ \____\ \__/ \_\\ \_\/\____/
     \/___/ \/____/\/__/\/_/ \/____/\/____/ \/___/ \/____/\/__/\/_/ \/_/\/___/ 

                               JavaScript Toolkit
                      Version 1.0.1-s.1, February 3rd, 2012
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
  you're not planning to use any of these classes, the BaseClass can be omitted
  as well.
  
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
  
    - Marcel Hellkamp, the creator of the BottlePy Framework and its' Simple
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

  - Version 1.0.1-s.1, February 3rd, 2012
    - Updated the readme and license files.
  
  - Version 1.0.1-s, January 29th, 2012
    - Fixed the declaration of BlazeGears.Formats, which is now a singleton.
    - Fixed the bug where declaring an instance and a static member of the same
      name would let them coexist, instead of overwriting the prior member.
    - Fixed the bug where the BlazeGears.Class.__super__ method would never
      return anything.
  
  - Version 1.0.0-s, August 29th, 2011
    - The first public release.
