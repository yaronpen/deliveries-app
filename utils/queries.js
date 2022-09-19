export const addressInsert = `insert IGNORE into address (formatted, address_line1, address_line2, country, street, postcode) values (?, ?, ?, ?, ?, ?)`;

export const timeslots = `insert ignore into timeslots (address_id, date, hour) values ?;`;

export const selectTimeslots = `
  select 
    timeslot_id,
    address_id,
    date,
    hour,
    (select count(delivery_id) from deliveries.deliveries where deliveries.timeslot_id = timeslots.timeslot_id) as deliveries
  from 
    deliveries.timeslots
  where 
    timeslots.address_id in (select address_id from deliveries.address where formatted = ?)
    order by 
      date,
      timeslot_id;
`;

export const selectDelivers = `
select 
  timeslot_id,
  (select count(delivery_id) from deliveries.deliveries where deliveries.timeslot_id = timeslots.timeslot_id) as deliveries
from 
  deliveries.timeslots
where 
  timeslot_id = ?;
`;

export const updateDelivery = `update deliveries.deliveries set status = 1 where delivery_id = ?`;

export const deleteDeliverySQL = `delete from deliveries where delivery_id = ?`;

export const selectDailyDeliveriesQuery = `
    select 
      timeslots.timeslot_id,
      (select formatted from deliveries.address where address.address_id = timeslots.address_id) as address,
      date,
      hour,
      case when deliveries.status = 1 then 'delivered' else 'not delivered' end as status,
      deliveries.user
    from 
      deliveries.timeslots 
      inner join deliveries.deliveries on timeslots.timeslot_id = deliveries.timeslot_id
    where 
      date = ?;
`;

export const selectWeekly = `
    select 
      timeslots.timeslot_id,
      (select formatted from deliveries.address where address.address_id = timeslots.address_id) as address,
      date,
      hour,
      case when deliveries.status = 1 then 'delivered' else 'not delivered' end as status,
      deliveries.user
    from 
      deliveries.timeslots 
      inner join deliveries.deliveries on timeslots.timeslot_id = deliveries.timeslot_id
    where 
      date between ? and ?;
  `;

export const addressApiUri = `https://api.geoapify.com/v1/geocode/search`;

export const addressKey = `b3ae82a3607c46e2ac057488d71f73c0`;

export const minHour = 10;

export const maxHour = 15;

export const maxTimeSlots = 2;