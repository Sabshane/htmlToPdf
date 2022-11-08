const fs = require("fs");
const path = require("path");
const srcPath = path.join(__dirname, "src");
const tmpPath = path.join(__dirname, "tmp");
const puppeteer = require("puppeteer");

// Defining a higher MaxListeners value
// to avoid problems when converting many files.
require("events").EventEmitter.defaultMaxListeners = 50;

async function generatePdf(file) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(
    "file:///Users/horde/Projets/puppeteerToPdf/tmp/" + file + ".html",
    { waitUntill: "networkidle2" }
  );
  await page.pdf({
    path: "output/" + file + ".pdf",
    format: "A4",
    printBackground: true,
  });
  await browser.close;
}
//Function to parse files in the src folder
async function getHtmlFiles() {
  try {
    console.log("Retrieving files from :" + srcPath);
    let extension = ".html";
    let imgExtensions = [".png", ".PNG", ".jpg", ".JPG", ".gif", ".GIF"];
    let allFiles = await fs.promises.readdir(srcPath);
    let imgFiles = allFiles.filter((el) =>
      imgExtensions.includes(path.extname(el))
    );
    let htmlFiles = allFiles.filter((el) => path.extname(el) === extension);
    await moveAssets(imgFiles);
    for (const file of htmlFiles) {
      console.log("Generating pdf for " + file + " file.");
      await reSaveFile(file).then((clearedName) => {
        generatePdf(clearedName).then(() => {
          console.log("Clearing file: " + clearedName + ".html");
          clearTmpFolder(clearedName + ".html");
        });
      });
    }
  } catch (error) {
    console.error(`erreur ${error}`);
  }
}

// Function to move assets to the tmp file
// in order for the images to be correctly
// linked in the html.

async function moveAssets(assetsArray) {
  await assetsArray.map((asset) => {
    console.log("Moving asset: " + asset);
    fs.copyFileSync(
      srcPath + "/" + asset,
      tmpPath + "/" + asset,
      undefined,
      function (err) {
        if (err) {
          throw err;
        } else {
          console.log("Successfully moved the file!" + "(" + asset + ")");
        }
      }
    );
  });
}
// Function to move files to the tmp foler
// with a proper name.

async function reSaveFile(file) {
  let fileContent = fs.readFileSync("./src/" + file);
  //format string properly
  let newFileName = file
    .split(" ")
    .slice(0, -1)
    .join("")
    .replace(/[^0-9a-z]/gi, "")
    .toLowerCase();
  fs.writeFileSync("tmp/" + newFileName + ".html", fileContent, function (err) {
    if (err) throw err;
  });
  return newFileName;
}
// Function to clear the /tmp folder
// after the pdf is generated.

async function clearTmpFolder(tmpFile) {
  fs.unlink(path.join(tmpPath + "/" + tmpFile), (err) => {
    if (err) throw err;
  });
}

getHtmlFiles();
