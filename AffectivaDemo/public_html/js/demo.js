/* global affdex */

// Construct a PhotoDetector
var detector = new affdex.PhotoDetector();

//Enable detection of all Expressions, Emotions and Emojis classifiers.
detector.detectAllEmotions();
detector.detectAllExpressions();
detector.detectAllEmojis();
detector.detectAllAppearance();

// Add a callback to notify when the detector is initialized and ready for runing.
detector.addEventListener("onInitializeSuccess", function () {
    log('#logs', "The detector has been initialized");
    $("#upload_button").css("visibility", "visible");
});

// Add a callback to receive the results from processing an image.
// The faces object contains the list of the faces detected in an image.
// Faces object contains probabilities for all the different expressions, emotions and appearance metrics
detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {

    drawImage(image);

    $('#results').html("");

    if (faces.length === 0) {
        log('#results', "<br><b style='color: red;'>Number of faces found</b>: " + faces.length);
    }

    if (faces.length > 0) {

        printData("Aspetto", faces[0].appearance);

        printData("Emozioni", faces[0].emotions);

        printData("Espressioni", faces[0].expressions);

        log('#results', "<br><br><b>Emoji</b> " + faces[0].emojis.dominantEmoji);

        drawFeaturePoints(image, faces[0].featurePoints);
    }
});

function printData(title, data) {

    log('#results', "<br><b class='clearfix' style='margin: 10px 0; display: block;'>" + title + "</b>");

    log('#results', "<div class='row'>");
    for (var key in data) {
        var val = data[key].toFixed ? Number(data[key].toFixed(0)) : data[key];
        log('#results', "<div class='col-4' style='display: inline-block;'><span>" + getTranslation(key) + ":</span> <span style='color: gray;'>" + val + "</span></div>");
    }
    log('#results', "</div>");
}

// Add a callback to notify if failed receive the results from processing an image.
detector.addEventListener("onImageResultsFailure", function (image, timestamp, error) {
    log('#logs', 'Failed to process image err=' + error);
});

// Initialize the emotion detector
detector.start();

// Once the image is loaded, pass it down for processing
function imageLoaded(event) {

    var contxt = document.createElement('canvas').getContext('2d');
    contxt.canvas.width = this.width;
    contxt.canvas.height = this.height;
    contxt.drawImage(this, 0, 0, this.width, this.height);

    // Pass the image to the detector to track emotions
    if (detector && detector.isRunning) {
        detector.process(contxt.getImageData(0, 0, this.width, this.height), 0);
    }
}

// Load the selected image
function loadFile(event) {

    $('#results').html("");

    var img = new Image();
    var reader = new FileReader();

    reader.onload = function () {
        img.onload = imageLoaded;
        img.src = reader.result;
    };

    reader.readAsDataURL(event.target.files[0]);
}

// Convienence function for logging to the DOM
function log(node_name, msg) {
    $(node_name).append(msg);
}

// Draw Image to container
function drawImage(img) {

    var contxt = $('#image_canvas')[0].getContext('2d');

    var temp = document.createElement('canvas').getContext('2d');
    temp.canvas.width = img.width;
    temp.canvas.height = img.height;
    temp.putImageData(img, 0, 0);

    var image = new Image();
    image.src = temp.canvas.toDataURL("image/png");

    // Scale the image to 500x375 - the size of the display container.
    contxt.canvas.width = img.width <= 500 ? img.width : 500;
    contxt.canvas.height = img.height <= 375 ? img.height : 375;

    var hRatio = contxt.canvas.width / img.width;
    var vRatio = contxt.canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);

    // Draw the image on the display canvas
    contxt.clearRect(0, 0, contxt.canvas.width, contxt.canvas.height);

    contxt.scale(ratio, ratio);

    image.onload = function () {
        contxt.drawImage(image, 0, 0);
    };
}

// Draw the detected facial feature points on the image
function drawFeaturePoints(img, featurePoints) {

    var contxt = $('#image_canvas')[0].getContext('2d');

    var hRatio = contxt.canvas.width / img.width;
    var vRatio = contxt.canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);

    contxt.strokeStyle = "#FFFFFF";
    for (var id in featurePoints) {
        contxt.beginPath();
        contxt.arc(featurePoints[id].x, featurePoints[id].y, 2, 0, 2 * Math.PI);
        contxt.stroke();
    }
}

function getTranslation(string) {

    switch (string) {
        // Appearance
        case "gender":
            return "Genere";
        case "glasses":
            return "Occhiali";
        case "age":
            return "Età";
        case "ethnicity":
            return "Etnia";
            // Emotions
        case "joy":
            return "Gioia";
        case "sadness":
            return "Tristezza";
        case "disgust":
            return "Disgusto";
        case "contempt":
            return "Disprezzo";
        case "anger":
            return "Rabbia";
        case "fear":
            return "Paura";
        case "surprise":
            return "Sorpresa";
        case "valence":
            return "Valenza";
        case "engagement":
            return "Impegno";
            // Expressions
        case "smile":
            return "Sorriso";
        case "innerBrowRaise":
            return "Sollevamento fronte interna";
        case "browRaise":
            return "Sollevamento fronte";
        case "browFurrow":
            return "Rughe in fronte";
        case "noseWrinkle":
            return "Grinze naso";
        case "upperLipRaise":
            return "Sollevamento labbro superiore";
        case "lipCornerDepressor":
            return "Depressione angolare labbra";
        case "chinRaise":
            return "Sollevamento mento";
        case "lipPucker":
            return "Grinze labbra";
        case "lipPress":
            return "Pressione labbra";
        case "lipSuck":
            return "Aspirazione labbra";
        case "mouthOpen":
            return "Apertura bocca";
        case "smirk":
            return "Smorfia";
        case "eyeClosure":
            return "Chiusura occhi";
        case "attention":
            return "Attenzione";
        case "lidTighten":
            return "Palpebre chiuse";
        case "jawDrop":
            return "Mascella abbassata";
        case "dimpler":
            return "Fossette";
        case "eyeWiden":
            return "Occhi spalancati";
        case "cheekRaise":
            return "Guancia sollevata";
        case "lipStretch":
            return "Labbra tirate";
        default:
            return string;
    }

}