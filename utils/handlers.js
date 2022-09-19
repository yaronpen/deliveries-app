import { generalQuery } from './db.js';
import { format_response, rangeDates, getDatesInRange } from './helpers.js';
import {
  addressInsert,
  timeslots,
  selectTimeslots,
  selectDelivers,
  updateDelivery,
  deleteDeliverySQL,
  selectDailyDeliveriesQuery,
  selectWeekly,
  addressApiUri,
  addressKey,
  minHour, 
  maxHour,
  maxTimeSlots
} from './queries.js';

export const addressHandler = async (req, res) => {
  try {
    const search_term = req.body.searchTerm;
    const url = `${addressApiUri}?text=${search_term}&apiKey=${addressKey}`;
    const stored_results = await request(url, 'get');

    const doc = await format_response(stored_results);
    const addressInsertQuery = addressInsert;
    const result = await generalQuery(addressInsertQuery, doc);
    const address_id = result[0]?.insertId;
    const { start_date, end_date } = await rangeDates();
    const date_array = await getDatesInRange(start_date, end_date);
    let hour = minHour;

    const slots = date_array.reduce((acc, value) => {
      const date = value.toISOString().split('T');
      // ensuring only five timeslots a day (according to specification), so each day will have 10 deliveies max
      while (hour < maxHour) {
        const row = [address_id, date[0], hour];
        acc.push(row);
        hour++;
      }
      hour = minHour;

      return acc;
    }, [])
    const timeslotsQuery = timeslots;
    await generalQuery(timeslotsQuery, [slots]);

    res.json({ status: 200, formatted_address: doc[0] });
  } catch (error) {
    res.json({ error: error.message });
  }

}

export const timeslotsHandler = async (req, res) => {
  try {
    const formatted_address = req.body.formatted_address;
    const sql = selectTimeslots;
    const results = await generalQuery(sql, [formatted_address])

    const returned_obj = results[0]?.reduce((acc, value) => {
      const num_deliver = maxTimeSlots - value.deliveries;
      const halfway_date = value.date;
      const year = halfway_date.toLocaleString("default", { year: "numeric" });
      const month = halfway_date.toLocaleString("default", { month: "2-digit" });
      const day = halfway_date.toLocaleString("default", { day: "2-digit" });
      const delivery_date = `${year}-${month}-${day}`;
      const row = { timeslot_id: value.timeslot_id, date: delivery_date, hour: value.hour, deliveries_available: num_deliver }

      acc.push(row)
      return acc;
    }, []);

    res.json({ ...returned_obj })
  } catch (error) {
    res.json({ error: error.message });
  }
}

export const deliveriesHandler = async (req, res) => {
  try {
    const timeslot_id = req.body.timeslotId;
    const user = req.body.user;

    const sql = selectDelivers;
    const results = await generalQuery(sql, [timeslot_id]);

    let delivery_id = 0;
    let output_message = 'Time slot is already fully booked';
    //ensuring no more then 2 deliveries per timeslot
    if (results[0][0]?.deliveries < maxTimeSlots) {
      const deliveryInsertQuery = `insert into deliveries (timeslot_id, status, user) values (?, ?, ?)`;
      const delivery_results = await generalQuery(deliveryInsertQuery, [timeslot_id, 0, user])
      delivery_id = delivery_results[0]?.insertId;
      output_message = 'Delivery booked successfuly';
    }
    res.json({ status: 200, result: 'OK', message: output_message, deliveryId: delivery_id });
  } catch (error) {
    res.json({ error: error.message });
  }
}

export const completeDeliveryHandler = async (req, res) => {
  try {
    const delivery_id = req.params.delivery_id;
    const updateDeliveryQuery = updateDelivery;
    const result = await generalQuery(updateDeliveryQuery, [delivery_id]);
    let result_text = '';
    if (result[0]?.affectedRows > 0) {
      result_text = 'Delivery marked complete';
    }
    else {
      result_text = 'Delivery not found';
    }
    res.json({ status: 200, result: result_text })
  } catch (error) {
    res.json({ error: error.message });
  }
}

export const deleteDelivery = async (req, res) => {
  try {
    const delivery_id = req.params.delivery_id;
    const deleteDeliveryQuery = deleteDeliverySQL;
    const result = await generalQuery(deleteDeliveryQuery, [delivery_id]);
    let result_text = '';

    if (result[0].affectedRows > 0) {
      result_text = 'Delivery deleted successfully';
    }
    else {
      result_text = 'Delivery not found';
    }
    res.json({ status: 200, result: result_text });
  } catch (error) {
    res.json({ error: error.message });
  }
}

export const getDailyDeliveries = async (req, res) => {
  try {
    const current_date = new Date();
    const formatted_current = current_date.toISOString().split('T');
    const selectDailyDeliveries = selectDailyDeliveriesQuery;
    const result = await generalQuery(selectDailyDeliveries, [formatted_current[0]]);
    const deliveries = result[0];
    res.json({ status: 200, deliveries });
  } catch (error) {
    res.json({ error: error.message });
  }
}

export const getWeeklyDeliveries = async (req, res) => {
  try {
    const { start_date, end_date } = await rangeDates()
    const formatted_current = start_date.toISOString().split('T');
    const formatted_end = end_date.toISOString().split('T');
    const selectWeeklyQuery = selectWeekly;
    const result = await generalQuery(selectWeeklyQuery, [formatted_current[0], formatted_end[0]]);
    const weekly_deliveries = result[0]
    res.json({ status: 200, weekly_deliveries })
  } catch (error) {
    res.json({ error: error.message });
  }
}