$(document).ready(function() {
    // SEEDS INITIAL LIST OF BUTTONS AND ADDS BUTTONS TO DOM IN A LOOP
    let topics = ["Movies", "Xbox One Games", "The Office", "Breaking Bad", "Game of Thrones", "Lord of the Rings", "Step Brothers"];
    let settingsExpanded = false;
    generateButtons();
  
    function generateButtons() {
      if (localStorage.getItem("storedTopicsList") !== null) {
        let localStoredList = localStorage.getItem("storedTopicsList");
        localStoredList = JSON.parse(localStoredList);
        topics = localStoredList;
      }
      for(let i = 0; i < topics.length; i++){
        let topicButton = $('<button/>', {
          text: topics[i],
          id: 'btn_'+topics[i],
          value: topics[i],
          class: "searchButton"
        });
        $("#buttonContainer").append(topicButton);
      }
    }
  
    // EVENT HANDLER FOR BUTTON CLICK TO RETRIEVE IMAGES, SET THEIR ATTRIBUTES, AND APPEND THEM TO THE DISPLAY
    $(document).on("click", ".searchButton", function() {
      let baseURL = "https://api.giphy.com/v1/gifs/search?";
      let apiURLAttributes = {
        q: $(this).attr("value"),
        api_key: "Q1BqCjlOpqeUsJvX6DisCpDsg5Tzl5vL",
        limit: $("#queryRecordCount").val()
      };
      let fullQueryURL = baseURL + $.param(apiURLAttributes);
  
      $.ajax({
        url: fullQueryURL,
        method: "GET"
      }).then(function(response) {
        let results = response.data;
        console.log(response);
        for (let i = 0; i < results.length; i++) {
          let gifDiv = $("<div class='gifContainer'>");
          let rating = results[i].rating;
          let pRating = $('<p>').text("Rated: ");
          let ratingImage = $("<img class='ratingIcon'>");
          let imageTitle = results[i].title.toUpperCase();
          let pDownload = $('<p>').text("Download: ");
          let downloadAnchorURL = results[i].images.original.url;
          let downloadAnchor = $("<a/>", {
            href: downloadAnchorURL,
            target: "_blank",
            download: imageTitle
          });
          let downloadImage = $('<img src="assets/images/downloadimage.png" class="downloadImage">');
          let titleParagraph = $('<p class="gifTitle">').text("Title: " + imageTitle);
          switch (rating) {
            case "g":
              ratingImage.attr("src", "assets/images/Rated G.png");
              break;
            case "pg":
              ratingImage.attr("src", "assets/images/Rated PG.png");
              break;
            case "pg-13":
              ratingImage.attr("src", "assets/images/Rated PG-13.png");
              break;
            case "r":
            default:
              console.log("image not found");
          }
          let gifImage = $("<img>");
          gifImage.attr("src", results[i].images.fixed_height_still.url)
            .attr("gifStillURL", results[i].images.fixed_height_still.url)
            .attr("gifAnimatedURL", results[i].images.fixed_height.url)
            .attr("animationStatus", "still")
            .addClass("gif");
          downloadAnchor.append(downloadImage);
          gifDiv.append(titleParagraph, gifImage, pRating, pDownload);
          pRating.append(ratingImage);
          pDownload.append(downloadAnchor);
          $("#gifOutput").prepend(gifDiv);
        }
      });
    });
  
    // EVENT HANDLER FOR CLICKING A GIF TO ANIMATE OR PAUSE ANIMATION
    $(document).on("click", ".gif", function() {
      let animationStatus = $(this).attr("animationStatus");
      if (animationStatus === "still") {
        $(this).attr("src", $(this).attr("gifAnimatedURL"))
        .attr("animationStatus", "animated");
      }
      else {
        $(this).attr("src", $(this).attr("gifStillURL"))
        .attr("animationStatus", "still");
      }
    });
  
    // FUNCTION FOR EXPANDING SEARCH BAR
    $(".header").click(function() {
      $(".content").slideToggle("400");
      if (settingsExpanded === false) {
        $("#expandCollapse").text("Collapse");
        settingsExpanded = true;
      }
      else {
        $("#expandCollapse").text("Expand");
        settingsExpanded = false;
      }
    });
  
    // ADD SEARCH TERM BUTTON
    $("#addItemButton").on("click", function() {
      event.preventDefault();
      let textBoxValue = $("#addItemText").val().trim();
      if ((textBoxValue !== "") && (topics.includes(textBoxValue) === false)) {
        topics.push(textBoxValue);
        topics.sort();
        let stringedSearchArray = JSON.stringify(topics);
        console.log(stringedSearchArray);
        localStorage.setItem("storedTopicsList", stringedSearchArray);
        $("#addItemText").val("");
        $("#buttonContainer").empty();
        generateButtons();
      }
    });
  
    //CLEAR ADDED ITEMS BUTTON
    $("#clearAddedItems").on("click", function() {
      if (confirm("Are you sure you wish to remove all the manually added search terms?") === true){
        localStorage.clear();
        $("#buttonContainer").empty();
        topics = ["Movies", "Xbox One Games", "The Office", "Breaking Bad", "Game of Thrones", "Lord Of The Rings", ];
        generateButtons();
      }
    });
  });

function newFunction() {
    return "keyboards";
}
