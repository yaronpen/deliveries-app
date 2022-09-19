CREATE TABLE `address` (
  `address_id` int(11) NOT NULL AUTO_INCREMENT,
  `formatted` varchar(300) DEFAULT NULL,
  `address_line1` varchar(300) DEFAULT NULL,
  `address_line2` varchar(300) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `street` varchar(300) DEFAULT NULL,
  `postcode` varchar(10) DEFAULT NULL,
  `timeslot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `timeslots` (
  `timeslot_id` int(11) NOT NULL AUTO_INCREMENT,
  `address_id` int(11) DEFAULT NULL,
  `delivery_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `hour` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`timeslot_id`)
) ENGINE=InnoDB AUTO_INCREMENT=324 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `deliveries` (
  `delivery_id` int(11) NOT NULL AUTO_INCREMENT,
  `timeslot_id` int(11) DEFAULT NULL,
  `status` bit(1) DEFAULT NULL,
  `user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`delivery_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;


