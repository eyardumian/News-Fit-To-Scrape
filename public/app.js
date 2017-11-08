// Grab the articles as json
$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    // var title = data[i].title;
    // var link = data[i].link;
    // $("#title").append("<h3> data-id='" + data[i]._id + "'>" + data[i].title + "</h3>");
    // $("#link").append(" data-id=' " + data[i]._id + "'>" + data[i].link)
    //  $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
// $("#articles").append("<div class='panel panel-default'><div class='panel-heading'> <p data-id='" + data[i]._id + "'>" + data[i].title + "</p></div>" + "<div class='panel-body'><a href='" + data[i].link + "'>Link to Article</p>"); }
$("#articles").append("<div class='panel panel-default'><div class='panel-heading'> <p data-id='" + data[i]._id + "'>" + data[i].title
 + "</p></div>" + "<div class='panel-body'><a href='" + data[i].link + "'>Link to Article" + "</div>");  }

});

$(document).on("click", "p", function() {
  // Empty the notes
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // var noteTitle = $("#newTitle").val();
  // var noteBody = $("#newBody").val();

  // Ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
    // data: {
    //   title: noteTitle,
    //   body: noteBody
    // }
  })
    // Adds note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<div id='noteTitle' >" + data.title + "</div>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id = 'savenote'> Save Note </button>");
      $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");
      // If there's a note in the article
      if (data.note) {

        // Place the title of the note in the title input
        // $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        // $("#bodyinput").val(data.note.body);

        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);

      }
    });
});


// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // $("#savedNotes").append("<p  data-id=" + data[i]._id + "><span data-id=" +
      //   data[i]._id + ">" + data[i].title + "</span><span class=deleter>X</span></p>");

      $("#notes").empty();
    });

  // Remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");

});

// onclick event to delete an article
$(document).on("click", "#deletenote", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/delete/" + thisId
  }).done(function(data) {
    $("#notes").empty();
  });
  $("#titleinput").val("");
  $("bodyinput").val("");
});
