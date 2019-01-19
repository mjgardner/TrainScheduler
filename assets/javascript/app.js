// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyBwabwVgYqfI5S0bnAB-mf5betK5WpN5Y4",
  authDomain: "train-scheduler-assignme-b1c26.firebaseapp.com",
  databaseURL: "https://train-scheduler-assignme-b1c26.firebaseio.com",
  projectId: "train-scheduler-assignme-b1c26",
  storageBucket: "",
  messagingSenderId: "743565031134"
};
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$(function() {
  $("#submitBtn").on("click", function(event) {
    event.preventDefault();
    var trainName = $("#trainName")
      .val()
      .trim();
    var destination = $("#destination")
      .val()
      .trim();
    var time = $("#time")
      .val()
      .trim();
    var frequencyMin = parseInt(
      $("#frequencyMin")
        .val()
        .trim()
    );

    database.ref().push({
      trainName: trainName,
      destination: destination,
      time: time,
      frequencyMin: frequencyMin,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

  database
    .ref()
    .orderByChild("dateAdded")
    .on(
      "child_added",
      function(snapshot) {
        var sv = snapshot.val();

        var tr = $("<tr>");
        var th = $("<th>")
          .attr("scope", "row")
          .text(sv.trainName);
        var destinationTd = $("<td>").text(sv.destination);
        var frequencyTd = $("<td>").text(sv.frequencyMin);

        var firstTimeConverted = moment(sv.time, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % sv.frequencyMin;
        var minutesAway = sv.frequencyMin - tRemainder;
        var nextArrival = moment().add(minutesAway, "minutes");

        var nextArrivalTd = $("<td>").text(
          moment(nextArrival).format("h:mm a")
        );
        var minutesAwayTd = $("<td>").text(minutesAway);

        tr.append(th, destinationTd, frequencyTd, nextArrivalTd, minutesAwayTd);
        $("#schedule").append(tr);
      },
      function(errorObject) {
        console.log("Database error: " + errorObject.code);
      }
    );
});
