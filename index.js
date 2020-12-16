const clientID = `c5870de632974133b726cc61f06ed075`;

  /* Pass the embed mode option here */
const viewerConfig = {
  embedMode: "IN_LINE"
};

/* Wait for Adobe Document Services PDF Embed API to be ready */
document.addEventListener("adobe_dc_view_sdk.ready", function () {
  /* Initialize the AdobeDC View object */
  var adobeDCView = new AdobeDC.View({
      /* Pass your registered client id */
      clientId: clientID,
      /* Pass the div id in which PDF should be rendered */
      divId: "adobe-dc-view",
  });

  const input = document.getElementById('file-picker');
  input.addEventListener('change', listenForFileUpload());

  function listenForFileUpload() {
    var fileToRead = document.getElementById("file-picker");
    fileToRead.addEventListener("change", function(event) {
       var files = fileToRead.files;
       if (files.length > 0) {
          var reader = new FileReader();
          reader.onloadend = function(e) {
              var filePromise = Promise.resolve(e.target.result);
              // Pass the filePromise and name of the file to the previewFile API
              adobeDCView.previewFile({
                   content: {promise: filePromise},
                   metaData: { fileName: files[0].name }
              })
          };
          reader.readAsArrayBuffer(files[0]);
        }
      }, false);
  }















  /* Invoke the file preview API on Adobe DC View object */
//   adobeDCView.previewFile({
//       /* Pass information on how to access the file */
//       content: {
//           /* Location of file where it is hosted */
//           location: {
//               url: "https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf",
//               /*
//               If the file URL requires some additional headers, then it can be passed as follows:-
//               header: [
//                   {
//                       key: "<HEADER_KEY>",
//                       value: "<HEADER_VALUE>",
//                   }
//               ]
//               */
//           },
//       },
//       /* Pass meta data of file */
//       metaData: {
//           /* file name */
//           fileName: "Bodea Brochure.pdf"
//       }
//   }, viewerConfig);
});