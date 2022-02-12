const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = 5000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

const initializeDBConnection = require("./data/db.connect");

const verifyToken = require("./middleware/verifyToken");
const errorHandler = require("./middleware/error-handler-middleware");
const routeNoteFound = require("./middleware/route-not-found-middleware");

const notesRouter = require("./routes/notes.route");
const userRouter = require("./routes/user.route");

initializeDBConnection();

app.get("/", (req, res) => {
    res.json({
        success: true
    })
});

app.use("/user", userRouter);
app.use("/notes", verifyToken, notesRouter);

app.use(errorHandler);
app.use(routeNoteFound);

app.listen(process.env.PORT || PORT, () => {
    console.log("Server started");
});

