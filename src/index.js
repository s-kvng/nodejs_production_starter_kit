import express from "express";
import logger from "./utils/logger.js";
import morgan from "morgan";

// instantiate express
const app = express();
const port = process.env.PORT || 3000;

// enable express access the data from the client
app.use(express.json());

// custom formatter for the logging
const morganFormat = ":method👍 :url :status :response-time✅ ms";
// morgan middleware ... logs info about every request that hits the server
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let teaData = [];
let nextId = 1;

// fetch all teas
app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

// add a new tea
app.post("/teas", (req, res) => {
  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

// get a specific tea
app.get("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (tea) {
    res.status(200).send(tea);
  } else {
    res.status(404).send("Tea not found!!");
  }
});

// update tea
app.put("/teas/:id", (req, res) => {
  let tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("Tea not found");
  }

  // get name from the request body
  const { name, price } = req.body;

  tea = { id: tea.id, name: name || tea.name, price: price || tea.price };
  let findIndex = teaData.findIndex((t) => t.id === parseInt(tea.id));
  console.log(findIndex);
  teaData[findIndex] = tea;

  res.status(200).send(teaData);
});

// Delete the tea
app.delete("/teas/:id", (req, res) => {
  const index = teaData.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send("Teas not found");
  teaData.splice(index, 1);
  return res.status(204).send("Deleted");
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
