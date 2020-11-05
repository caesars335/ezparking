const express = require("express");
const path = require("path");
const body_parser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const saltRounds = 10;

let config = {
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'ezparking'
  };

const app = express();
const con = mysql.createConnection(config);

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/index.html"))
});

app.get("/signUp", function (req, res){
    res.sendFile(path.join(__dirname, "./views/signUp.html"))
});

app.get("/signIn", function (req, res){
    res.sendFile(path.join(__dirname, "./views/signIn.html"))
});

//add user with normal form
app.put("/addUser", function (req, res) {
    const { Username, Password } = req.body

    const sql = "SELECT * FROM account WHERE Username = ?"
    con.query(sql, [Username], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง")
            console.log(err)
        }
        else {
            if (!result[0]) {
                const sql2 = "INSERT INTO `account` ( `Username`, `Password`) VALUES (?, ?);"
                bcrypt.hash(Password, saltRounds, function (err, hash) {
                    con.query(sql2, [Username, hash], function (err2, result2, fields) {
                        if (err2) {
                            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง")
                            console.log(err2)
                        }
                        else {
                            const sql2 = "SELECT * FROM account WHERE Username = ?"
                            con.query(sql2, [Username], function (err2, result2, fields2) {
                                if (err2) {
                                    res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
                                    console.log(err2)
                                } else {
                                    res.send(result2);
                                }
                            })

                        }
                    });
                });
            } else {
                res.send('0')
            }
        }
    })
});

app.post("/login", function (req, res) {
    const { Username, Password1 } = req.body

    const sql = "SELECT * FROM account WHERE Username = ?"
    con.query(sql, [Username, Username], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
            console.log(err)
        }
        else {
            if (result.length > 0) {
                bcrypt.compare(Password1, result[0].Password, function (err, resp) {
                    if (err) {
                        res.status(503).send('Authentication Server error');
                    } else {
                        if (resp) {
                            res.json(result)

                        } else {
                            res.send('0')
                        }
                    }
                });
            } else {
                res.send('0')
            }
        }
    })
});

// <======Starting server======>
const PORT = 9099
app.listen(PORT, function () {
    console.log("Server port is " + PORT);
});