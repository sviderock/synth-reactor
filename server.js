const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
express.static.mime.types["wasm"] = "application/wasm";
function allFilesSync(dir, fileList = []) {
  fs.readdirSync(dir).forEach(file => {
    if (file !== '.DS_Store') {
      const filePath = path.join(dir, file);
      fileList.push(
        fs.statSync(filePath).isDirectory() ? { [file]: allFilesSync(filePath) } : file
      );
    }
  });
  return fileList;
}

app.use(express.static('./'));
app.use(express.static('dist'));

app.get('/recorderWorker.js', (request, response) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.send(`${__dirname}/node_modules/recorderjs/recorderWorker.js`);
});

app.get('/getSamples', (request, response) => {
  response.header("Access-Control-Allow-Origin", "*");
  const fileslist = allFilesSync(`${__dirname}/static/samples`);
  response.send({ fileslist });
});

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on', port);
});
