const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Middlewares
app.use(express.json());
app.use(cors());
app.use(limiter);

// Routes
// GET with two required parameters (startDate and endDate)
app.get('/api/getPriceHistory/:startDate/:endDate', async (req, res) => {
  const startDay = req.params.startDate;
  const endDay = req.params.endDate;

  try {
    let response = await fetch(
      `https://api.coindesk.com/v1/bpi/historical/close.json?start=${startDay}&end=${endDay}`
    );
    let result = await response.json();

    let data = result.bpi;
    let newData = {};

    for (const x in data) {
      newData[x] = data[x] * 1000;
    }

    res.json(newData);
  } catch (error) {
    res.json(error);
  }
});

app.get('*', function (req, res) {
  res.send(
    'Sorry, but your specified start date is invalid. Please check and try again.'
  );
});

// Starting Server
app.listen(PORT, () => console.log(`Server is runing on ${PORT}`));
