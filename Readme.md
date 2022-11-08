# Html to pdf

## Requirements

- An IDE compatible with Node.js
- A web browser, either Chrome or Firefox.

## Installation

Simply clone or download the project and run `npm i` 

## File architecture

- /src -Contains the src files, you must include any image needed by the html here too.
- /tmp - Folder used to rename files properly and to generate the pdfs.
- /output - Will contain the pdfs generated after the script execution

## Usage

In order to use this tool you must provide your html and all assets related (css, img, etc..) in the /src folder.

Then you can use `npm run toPdf` the script will then start converting the files to pdf.

You will find your converted files in the /output folders.