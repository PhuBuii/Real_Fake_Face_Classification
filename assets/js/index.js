var selectedImage;

var fileUpload = document.getElementById("file-upload");
var imagePreview = document.getElementById("image-preview");
var predictionPreview = document.getElementById("prediction-preview");

function selectFile() {
  fileUpload.click();
}

fileUpload.addEventListener("change", function () {
  var file = fileUpload.files[0];
  previewImage(file);
});

function previewImage(file) {
  selectedImage = file;
  var reader = new FileReader();

  reader.onload = function (e) {
    var image = new Image();
    image.src = e.target.result;

    image.onload = function () {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");

      var maxWidth = imagePreview.offsetWidth;
      var maxHeight = imagePreview.offsetHeight;

      var width = image.width;
      var height = image.height;

      if (width > maxWidth || height > maxHeight) {
        var scale = Math.min(maxWidth / width, maxHeight / height);
        width *= scale;
        height *= scale;
      }

      canvas.width = width;
      canvas.height = height;

      context.drawImage(image, 0, 0, width, height);
      imagePreview.innerHTML = "";
      imagePreview.appendChild(canvas);
    };
  };

  reader.readAsDataURL(selectedImage);
}

function checkImage() {
  if (!selectedImage) {
    alert("Please upload an image first.");
    return;
  }

  var formData = new FormData();
  formData.append("image", selectedImage);

  // Send image data to the server for prediction using AJAX
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/predict", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var result = JSON.parse(xhr.responseText);
      var predictionResult = document.getElementById("prediction-result");
      predictionResult.innerHTML = "Prediction: " + result.prediction;

      var predictionImage = new Image();
      predictionImage.src = result.image_url;
      predictionPreview.innerHTML = "";
      predictionPreview.appendChild(predictionImage);
    }
  };
  xhr.send(formData);
}
