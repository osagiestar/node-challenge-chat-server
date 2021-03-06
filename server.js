  const express = require("express");
  const cors = require("cors");
  const bodyParser = require("body-parser");
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const messages = require("./messages.json");

  //This array is our "data store".
  //We will start with one message in the array.
  //Note: messages will be lost when Glitch restarts our server.

  // const messages = [welcomeMessage];

  // Base route path //
  app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
  });

  // Gets all the messages as a JSON array //
  app.get("/messages/", (request, response) => {
    response.json(messages);
  });

  // Obtains the chat message based on the Id //
  app.get("/message/:id", (request, response) => {
    const Id = request.params.id; // <- {Id:value}

    const findMessage = messages.find((e) => e.id == Id);

    if (findMessage) {
      response.json(findMessage);
    } else {
      response.send("Message not found");
    }
  });

  // Allows the assignment of a new message Id by increment of 1 //
  let newId = 22;
  app.post("/message/", (req, res) => {
    // const timeSent = new Date();
    const message = {};
    message.id = newId;
    message.from = req.body.from;
    message.text = req.body.text;
    message.timeSent = req.body.timeSent; 
    //OR message.timeSent = new Date(); //

    // destructuring the above code //
    //  const message = {} ;
    //  message.id = newId;
    // const { from, text } = req.body;
    // message.from = from;
    // message.text = text;
    // messages.push(message);

    // Gives a status code and message for empty or missing text from property //
    if (message.from != "" && message.text != "") {
      messages.push(message);
      newId++;
      // res.json(message)
      res.send("Messages added successfully");
    } else {
      // res.status(400).send("Message is not valid!");
      res.sendStatus(400); // alternative using standard code message //
    }
    console.log(message);
  });

  // A message can be deleted based on the defined Id //
  app.delete("/message/:Id", (req, res) => {
    const { Id } = req.params;
    messages.forEach((e) => {
      if (e.id == Id) {
        messages.splice(e, 1);
      }
    });
    res.send("Message deleted");
  });

  // Search for messages based on the text input //
  app.get("/messages/search", (request, response) => {
    const search = request.query.term;
    response.json(
      messages.filter((message) =>
        message.text.toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  // Slice method to read only the most recent 10 messages //
  app.get("/messages/latest", (request, response) => {
    response.json(messages.slice(-10));
  });

  // Start Listening on : 3002 //
  app.listen(process.env.PORT || 3002, function () {
    console.log("Server is listening on port 3002. Ready to accept requests!");
  });


// References //
// For level 4: 
// https://stackoverflow.com/questions/47355150/how-do-i-format-timestamp-as-mm-dd-yyyy-in-postman //
// https://learning.postman.com/docs/sending-requests/intro-to-collections/ //
// https://dannydainton.com/2018/05/21/hold-on-wait-a-moment/ //