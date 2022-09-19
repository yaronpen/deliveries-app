### Welcome to my solution

First thing, I really enjoyed solving this task.
The stack I used is nodejs and mysql. I included the sql schema that I created in the project for your convenience.
Regarding the requirements:
1. I didn't really understand how the courier api should work, because if the relevant dates is being loaded each time the projects loads then the dates are not being dynamic. What I've thought about is getting a list of holidays per country that the dates will still be generated dynamically, and it will check if a certain date is available according to the address. Anyway I haven't implemented that solution.
2. Concurrent requests are being dealt in nodejs by the event loop by default so I didn't really know what to do regarding my solution, as events are being process one after another anyway. In any other language I would've just lock the table while being inserted, that way, I would ensure that one record is being insert and the other being rejected. Another soltuion for this will be a message queue, again to ensure records are being inserted one at a time.
3. Another issue I haven't taken care of is duplication of records in the database. I could've just add a unique index on the right field for that.

In order to run this project, you're going to need nodejs and mysql installed on your machine.
Open up a terminal (or cmd if you're a Windows user), navigate to the project's folder and write:
```
npm install
```
then run the main file like this:
```
node app.js
```
This will make the program listen to new requests.

Hope you'll like my soltuion,
Yaron.