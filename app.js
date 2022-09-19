import express from 'express';
import path from 'path';
import * as dotenv from 'dotenv';
import { 
  addressHandler, 
  timeslotsHandler, 
  deliveriesHandler, 
  completeDeliveryHandler, 
  deleteDelivery, 
  getDailyDeliveries, 
  getWeeklyDeliveries 
} from './utils/handlers.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, `public`)));
app.use(express.urlencoded({ extended: true }));

app.post(`/resolve-address`, addressHandler);

app.post(`/timeslots`, timeslotsHandler);

app.post(`/deliveries`, deliveriesHandler);

app.patch(`/deliveries/:delivery_id/complete`, completeDeliveryHandler);

app.delete(`/deliveries/:delivery_id`, deleteDelivery)

app.get(`/deliveries/daily`, getDailyDeliveries);

app.get(`/deliveries/weekly`, getWeeklyDeliveries);

// app.get(`/deliveris/weekly`, weeklyDelivery);

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
})