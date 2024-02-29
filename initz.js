
const sqlite3 = require('sqlite3');


const db = new sqlite3.Database('database.db');

db.run("CREATE TABLE users (\
    id INTEGER PRIMARY KEY AUTOINCREMENT,\
    email TEXT,\
    phone TEXT,\
    password TEXT\
);\
",(rr) => {
    console.log("user created!!!")
});

db.close()