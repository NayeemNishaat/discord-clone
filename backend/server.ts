const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || process.env.API_PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
