# Change Log

[jump to latest](#version-324)<br>
[jump to stable](#version-324)

## Version 3.2.4

Release date: 2024-11-16  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/306988544?tag=3.2.4)

This patch includes:

- Added support for tables and todo lists

## Version 3.2.3

Release date: 2024-10-21  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/292879043?tag=3.2.3)

This patch includes:

- Added a button to close the currently opened note
- Fixed a bug where the outline of navbar buttons was hidden behind the main notebook area

## Version 3.2.2

Release date: 2024-10-16  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/290562074?tag=3.2.2)

This patch includes:

- Updated the style of the buttons in the top editor bar to match the rest of the UI elements

## Version 3.2.1

Release date: 2024-10-16  
[Docker image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/290420378?tag=3.2.1)

This patch includes:

- Fixed a bug where you couldn't collapse a folder if you were viewing a file that existed within the folder
  - This isn't necessarily a bug but it's annoying so I fixed it
- Removed some debug statements that was spamming the console

## Version 3.2.0

Release date: 2024-10-16  
[Docker image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/290410572?tag=3.2.0)

This minor update includes:

- Added functionality to expand/collapse all subdirectories when clicking if you hold `alt` (Windows) or `option` (Mac)
- Added functionality to automatically expand the path of directories when navigating to a file (using search or a link)

## Version 3.1.0

Release date: 2024-10-16  
[docker image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/290358564?tag=3.1.0)

This minor update includes:

- Added a download button for downloading the raw file
- Fixed a bug where if you typed too fast the cursor would jump to the start of the editor
- Updated the save code to work more reliably for drawings
- Updated the save code to be more performant

## Version 3.0.4

Release date: 2024-10-15  
[docker image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/289910793?tag=3.0.4)

This patch includes:

- Reduced the amount of autosaving that occurs when editing Excalidraw files ([credit](https://github.com/cindyxli))
  - Autosaves now happen 2 seconds after a user stops editing OR immediately if they click outside the main editor

## Version 3.0.3

Release date: 2024-10-15  
[docker image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/289764222?tag=3.0.3)

This patch includes:

- Added support for Excalidraw [libraries](https://libraries.excalidraw.com/?target=_blank&referrer=http%3A%2F%2Flocalhost%3A5173%2Fwuguishifu%2Ftest-dir%2FDrawing+Test.excalidraw&useHash=true&token=ladBBXBnOCBDb5sbd6Lr-&theme=dark&version=2&sort=default)
- Fixed bug where opening an Excalidraw file from a previous version would crash the app

## Version 3.0.2

Release date: 2024-10-14  
[docker image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/288681236?tag=3.0.2)

This patch includes:

- Fixed a bug where navigating away from a drawing using the notebook button would clear the drawing
- Fixed a bug where the adding a new text file would actually add a drawing file
- Reduced the amount of Excalidraw app state that's saved, reducing the amount of saves

## Version 3.0.1

Release date: 2024-10-13  
[docker image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/288650200?tag=3.0.1)

This patch includes:

- fixed bug with renaming excalidraw files
- fixed bug with search not showing the last character of the file extension

## Version 3.0.0

Release date: 2024-10-13  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/288635835?tag=3.0.0)

This major update includes:

- Added an Excalidraw integration so you can make drawings
- Added a check to make sure the user is not trying to move a folder into one of its subfolders
- Updated the look of links
- Updated how navigating to different documents is handled internally which should improve the UI and reduce potential flashing

## Version 2.1.3

Release date: 2024-10-13  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/288417029?tag=2.1.3)

This patch includes:

- Fixed a bug where environmental variables set as "true" were not correctly parsed as booleans

## Version 2.1.2

Release date: 2024-10-13  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/288415649?tag=2.1.2)

This patch includes:

- Various UI improvements
- Updated how document links are parsed and displayed (preparation for supporting different file types)

## Version 2.1.1

Release date: 2024-10-12  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/288404327?tag=2.1.1)

This patch includes:

- Fixed a security vulnerability where users could make usernames like `.` and `/` and obtain access to the filesystem ([credit](https://github.com/willsunnn))

## Version 2.1.0

Release date: 2024-10-06  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/284955974?tag=2.1.0)

This minor update includes:

- Fixed issue where renaming the file you're currently editing would not navigate you to the new file
- Fixed weird behavior with creating a new file sending you to the wrong place
- Added `Ctrl-u`, `Ctrl-i`, and `Ctrl-b` commands when not in vim mode for underline, italic, and bold

## Version 2.0.0

Release date: 2024-10-05  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/284563412?tag=2.0.0)

This major update includes:

- Rendering is now done through [`react-markdown`](https://github.com/remarkjs/react-markdown), so performance should be a lot better
- A few things have been removed and will be added later. This includes:
  - Tags
  - Named code blocks
- Documents can now be linked to other documents via the syntax `[[/path/to/document|optional name]]`

## Version 1.3.5

Release date: 2024-10-04  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/284095496?tag=1.3.5)

This patch includes:

- Updated the style of the GitHub links
- Updated search to match the full path of the file
- Internal linking to other documents via `[[/path/to/file]]`

## Version 1.3.4

Release date: 2024-10-01  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/282660691?tag=1.3.4)

This patch includes:

- Fixed bug preventing `<c-u>` and `<c-d>` from working in vim mode
- Moved the vim command panel to fixed at bottom of the screen

## Version 1.3.3

Release date: 2024-10-01  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/282161492?tag=1.3.3)

This patch includes:

- Changed the toggle switches to toggle buttons for showing/hiding the editor and the preview planes

## Version 1.3.2

Release date: 2024-10-01  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/282149269?tag=1.3.2)

This patch includes:

- Added the file path to the title area of the editor

## Version 1.3.1

Release date: 2024-10-01  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/282135101?tag=1.3.1)

This patch includes:

- Remove the warning message caused by radix UI trying to control how I write my code

## Version 1.3.0

Release date: 2024-10-01  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/282125111?tag=1.3.0)

This minor update includes:

- Pressing shift-shift anywhere in the editor brings up the file search (fully keyboard accessible)
- Clicking on the version number brings up the changelog

## Version 1.2.1

Release date: 2024-10-01  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/282079236?tag=1.2.1)

This patch includes:

- Search results will now highlight the part that matches the query
- Search also checks the directory path

## Version 1.2.0

Release date: 2024-09-30  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/282016484?tag=1.2.0)

This minor update includes:

- Search bar for files
- GitHub link and version below the recently deleted tab
- Option to hide/show the sidebar
- Folders collapse by default

## Version 1.1.5

Release date: 2024-09-29  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/281310791?tag=1.1.5)

This patch includes:

- Changed the alignment of folder name and dropdown icon in the sidebar

## Version 1.1.3

Release date: 2024-09-29  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/281305305?tag=1.1.3)

This patch includes:

- Added a toggle for show/hide the editor in the settings modal

## Version 1.1.2

Release date: 2024-09-29  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/281304075?tag=1.1.2)

This patch includes:

- Removed the file and folder icons, they were a bit too noisy imo
- Made the sidebar scrollable
- Made file/folder names ellipsis if required

## Version 1.1.1

Release date: 2024-09-29  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/281248276?tag=1.1.1)

This patch includes:

- Any `.git` folders are no longer included in the file structure in the frontend. If you want to back up your files with git (in a user's directory), you will no longer see the git folder.

## Version 1.1.0

Release date: 2024-09-29  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/281214000?tag=1.1.0)

This minor update includes:

- Tags
- Named code blocks
- Syntax highlighting in code blocks
- Ability to hide/show the editor*

\*This may cause the editor to be hidden by default if you update from a previous version because of a limitation with cookies. I'm going to fix this in the future so that new settings that should be default on won't be defaulted to off.

## Version 1.0.1

Release date: 2024-09-29  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/281106134?tag=1.0.1)

This patch includes:

- Changes to the tab header
- Installation instructions in the README

## Version 1.0.0

Release date: 2024-09-28  
[Docker Image](https://github.com/wuguishifu/tungsten/pkgs/container/tungsten/280922869?tag=1.0.0)

Initial release! This release includes:

- Authentication support
- Note editor
- Note preview
- Vim input support
