const clientID = `c5870de632974133b726cc61f06ed075`;

/* Pass the embed mode option here */
const viewerConfig = {
  embedMode: "IN_LINE",
};

var file;
var storage = firebase.storage();
var storageRef = storage.ref();

function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/* Wait for Adobe Document Services PDF Embed API to be ready */
document.addEventListener("adobe_dc_view_sdk.ready", function () {
  /* Initialize the AdobeDC View object */
  var adobeDCView = new AdobeDC.View({
    /* Pass your registered client id */
    clientId: clientID,
    /* Pass the div id in which PDF should be rendered */
    divId: "adobe-dc-view",
  });

  const input = document.getElementById("file-picker");
  input.addEventListener("change", listenForFileUpload());

  const saveOptions = {
    autoSaveFrequency: 0,
    enableFocusPolling: false,
    showSaveButton: true,
  };

  // sends the modified document to the DB
  adobeDCView.registerCallback(
    AdobeDC.View.Enum.CallbackType.SAVE_API,
    function (metadata, content, options) {
      var base64PDF = arrayBufferToBase64(content);
      var fileURL = "data:application/pdf;base64," + base64PDF;
      const url = fileURL;
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "fileName", { type: "application/pdf" });
          storageRef
            .child("File2")
            .put(file)
            .then(function (snapshot) {
              console.log("Uploaded a blob or file!");
            });
        });
      return new Promise((resolve, reject) => {
        resolve({
          code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
          data: {},
        });
      });
    },
    saveOptions
  );

  function listenForFileUpload() {
    var fileToRead = document.getElementById("file-picker");
    fileToRead.addEventListener(
      "change",
      function (event) {
        var files = fileToRead.files;
        file = files[0];
        if (files.length > 0) {
          var reader = new FileReader();
          reader.onloadend = function (e) {
            var filePromise = Promise.resolve(e.target.result);
            // Pass the filePromise and name of the file to the previewFile API
            adobeDCView.previewFile({
              content: { promise: filePromise },
              metaData: { fileName: files[0].name },
            });
          };
          reader.readAsArrayBuffer(files[0]);
        }
      },
      false
    );
  }
});
