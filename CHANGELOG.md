ChangeLog
=========
#### 2.8.0

- Added new snippets and highlighting for the new APIs

#### 2.7.1

- Security patches

#### 2.7.0

- Completely revamped the snippets for continuity and completeness.
- Added missing or incorrect snippet and autocomplete info.

#### 2.5.2

-   Update 1.33 to VSCode broke the extension. Can no longer compile the
    active window. No longer will try to search for .src just compile
    first one. Will work like used to now.  MUST HAVE .src file ACTIVE to
    compile.

#### 2.5.1

-   Fixed issue when multiple .src files are present in the
    folder/workspace only the first one alphabetically would compile.
    Now if only one exists will find and compile that one regardless of
    what file is active. If more than one src file is found in the
    folder it will compile the active window. User needs to make sure
    they have the correct .src file active when compiling.

#### 2.4.0

-   Fixed issue in which the console did not auto-scroll to the bottom
    so any compiler success/fail message as well as any compiler issues
    did not show.

#### 2.3.1

-   Fixed issue in which the compiler success/fail message as well as
    any compiler issues did not show in the console.

#### 2.2.0

-   Patched security flaw introduced by flatmap-stream malware.

#### 2.1.0

-   Fixed error when trying to build with only a file open.
    Workspace/folder is required.

#### 2.0.2

-   Autosaves all workspace files and selects the src before building.
    -   This allows autosaving to be turned off and initiating the build
        from any file AND any window.
        -   (No more trying to compile the output window or iri file)

#### 2.0.1

-   Added missing syntax colorization and snippets
-   Added more detailed description to each snippet
-   Added and fixed the tab to complete portions of each snippet
-   Complete revamp and expansion of Intellisense.

