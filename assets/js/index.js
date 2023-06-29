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
// JavaScript
window.addEventListener("scroll", function () {
  var navbar = document.getElementById("navbar");
  var aboutSection = document.getElementById("about");
  var demoSection = document.getElementById("detect");
  var navLinks = navbar
    .getElementsByClassName("menu")[0]
    .getElementsByTagName("a");
  var navLogo = navbar
    .getElementsByClassName("logo")[0]
    .getElementsByTagName("a");

  if (
    window.scrollY >= demoSection.offsetTop - 70 &&
    window.scrollY < aboutSection.offsetTop - 70
  ) {
    navbar.classList.add("scrolled");
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].classList.add("active");
    }
    for (var i = 0; i < navLogo.length; i++) {
      navLogo[i].classList.add("active");
    }
  } else {
    navbar.classList.remove("scrolled");
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].classList.remove("active");
    }
    for (var i = 0; i < navLogo.length; i++) {
      navLogo[i].classList.remove("active");
    }
  }
});

// Lấy tất cả các liên kết trong navbar
var menuLinks = document.querySelectorAll("a");

// Lặp qua từng liên kết và thêm sự kiện click
menuLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định khi click

    // Lấy ID của phần tử đích từ thuộc tính href của liên kết
    var targetId = link.getAttribute("href");

    // Lấy phần tử đích từ ID
    var targetElement = document.querySelector(targetId);

    // Tính toán vị trí cuộn đến
    var targetOffset = targetElement.offsetTop;

    // Cuộn trang đến vị trí đích với hiệu ứng mượt
    window.scrollTo({
      top: targetOffset,
      behavior: "smooth",
    });
  });
});
