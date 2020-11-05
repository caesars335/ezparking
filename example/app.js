// <======Import packages======>
const express = require("express");
const path = require("path")
const body_parser = require("body-parser");
const multer = require("multer");
const nodemailer = require('nodemailer');
const mysql = require("mysql");
const favicon = require('serve-favicon');
const config = require("./dbConfig.js");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const passport = require("passport");
const cookieSession = require("cookie-session");
const key = require("./config/key");
const bcrypt = require('bcrypt');
const { json, text } = require("body-parser");
const saltRounds = 10;
// const config = require("./dbConfig")


// <======Put packages to use======>
const app = express();
const con = mysql.createConnection(config);



// <======Apply folders======>
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/upload'));
app.use(favicon(path.join(__dirname, 'public', 'img', 'logoTitle.ico')));

const storageOption = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/Image/')
        // ./views/statusSpecifiedDetail.html
    },
    filename: function (req, file, cb) {

        cb(null, Date.now() + "_" + file.originalname);

    }
});

const upload = multer({ storage: storageOption }).single("filetoupload")


//<===================middle==============>

//cookie
app.use(cookieSession({
    // maxAge: 1000*60*60,
    maxAge: 1000 * 60 * 60,
    keys: [key.cookie.secret]
}));

//<=========== Middleware ==========>
app.use(body_parser.urlencoded({ extended: true })); //when you post service
app.use(body_parser.json());
// init passport for se/derialization
app.use(passport.initialize());
// session
app.use(passport.session());
// authen
app.use("/auth", authRoutes);
// profle
app.use("/profile", profileRoutes);

// config สำหรับของ gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'checkmail557@gmail.com', // your email
        pass: 'checkmashare' // your email password
    }
});

// <======GET method for calling pages======>

//Root
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/index.html"))
});

// about
app.get("/about_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/about.html"))
})

//
app.get("/check_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/checkpage.html"))
});

// createTrip
app.get("/createTrip_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/createTrip.html"))
})

// currentTrip
app.get("/currentTrip_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/currentTrip.html"))
})

// detailTrip
app.get("/detailTrip_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/detailTrip.html"))
})

// detailTripHistory
app.get("/detailTripHistory_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/detailTripHistory.html"))
})

// divideExpense
app.get("/divideExpense_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/divideExpense.html"))
})

// divideExpenseDetail
app.get("/divideExpenseDetail_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/divideExpenseDetail.html"))
})

// divideSpecifiedExpense
app.get("/divideSpecifiedExpense_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/divideSpecifiedExpense.html"))
})

// editHistory
app.get("/editHistory_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/editHistory.html"))
})

// editInfo
app.get("/editInfo_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/editInfo.html"))
})

// joinTrip
app.get("/joinTrip_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/joinTrip.html"))
})

// member
app.get("/member_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/member.html"))
})

// memberDetail
app.get("/memberDetail_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/memberDetail.html"))
})

// memberManageTrip
app.get("/memberManageTrip_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/memberManageTrip.html"))
})

// memberStatus
app.get("/memberStatus_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/memberStatus.html"))
})

// notification
app.get("/notification_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/notification.html"))
})

// signin
app.get("/signin_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/signin.html"))
})

// statusSharingDetail
app.get("/statusSharingDetail_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/statusSharingDetail.html"))
})

// statusSpecifiedDetail
app.get("/statusSpecifiedDetail_page", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/statusSpecifiedDetail.html"))
})


//add user with normal form
app.put("/Adduser/normal", function (req, res) {
    const { Username, Password, UserEmail } = req.body

    const sql = "SELECT * FROM user WHERE Username = ? OR UserEmail =?"
    con.query(sql, [Username, UserEmail], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง")
            console.log(err)
        }
        else {
            if (!result[0]) {
                const sql2 = "INSERT INTO `user` ( `Username`, `Password`,`UserEmail`,SignupWith ) VALUES (?, ?, ?, ?);"
                bcrypt.hash(Password, saltRounds, function (err, hash) {
                    con.query(sql2, [Username, hash, UserEmail, 0], function (err2, result2, fields) {
                        if (err2) {
                            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง")
                            console.log(err2)
                        }
                        else {
                            const sql2 = "SELECT * FROM user WHERE Username = ? OR UserEmail =?"
                            con.query(sql2, [Username, Username], function (err2, result2, fields2) {
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

//login with normal
app.post("/login/normal", function (req, res) {
    const { Username, Password1 } = req.body

    const sql = "SELECT * FROM user WHERE Username = ? OR UserEmail =?"
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

//changepassword with normal
app.post("/password/change", function (req, res) {
    const { Password, Newpassword, UserID } = req.body

    const sql = "SELECT * FROM user WHERE UserID =? AND SignupWith = ?"
    con.query(sql, [UserID, 0], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
            console.log(err)
        }
        else {
            if (result.length > 0) {
                bcrypt.compare(Password, result[0].Password, function (err, resp) {
                    if (err) {
                        res.status(503).send('Authentication Server error');
                    } else {
                        console.log(resp)
                        if (resp) {
                            const sql2 = "UPDATE user SET Password = ? WHERE UserID =?"
                            bcrypt.hash(Newpassword, saltRounds, function (err, hash) {
                                con.query(sql2, [hash, UserID], function (err2, result2, fields) {
                                    if (err2) {
                                        res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง")
                                        console.log(err2)
                                    }
                                    else {
                                        const sql2 = "SELECT * FROM user WHERE UserID =?"
                                        con.query(sql2, [UserID], function (err2, result2, fields2) {
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
                });
            } else {
                res.send('1')
            }
        }
    })
});

//login with google form
app.put("/Adduser/google/", function (req, res) {
    const { Username, UserEmail } = req.body

    const sql = "SELECT * FROM user WHERE Username = ? OR UserEmail =?"
    con.query(sql, [Username, UserEmail], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง")
            console.log(err)
        }
        else {
            if (!result[0]) {
                const sql2 = "INSERT INTO `user` ( `Username`,`UserEmail`,SignupWith ) VALUES (?, ?, ?);"
                con.query(sql2, [Username, UserEmail, 1], function (err2, result2, fields) {
                    if (err2) {
                        res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง")
                        console.log(err)
                    }
                    else {
                        const sql3 = "SELECT * FROM user WHERE Username = ? OR UserEmail =?"
                        con.query(sql3, [Username, Username], function (err3, result3, fields3) {
                            if (err3) {
                                res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
                                console.log(err3)
                            } else {
                                res.send(result3);
                            }
                        })
                    }
                })
            } else {
                res.send(result)
            }
        }
    })
});




app.post("/createTrip", function (req, res) {
    //TODO: After create trip then call api userInTrip for insert user and trip to same Table in database


    var { Tripname, TripHost, TripCode } = req.body
    const sql1 = 'SELECT TripCode FROM `trip`';
    con.query(sql1, function (err, resultA, fields) {
        if (err) {
            res.status(500).send("Server error")
            console.log(err)
        }
        else {

            res.send(test(TripCode, resultA, Tripname, TripHost,));



        }

    })



});

function test(TripCode, resultA, Tripname, TripHost) {
    var keepTripcode = TripCode
    var text
    const StartDate = new Date();
    // res.json(resultA)
    // console.log(resultA)
    // console.log(resultA[0].TripCode+'aaaaaaaaaaaaa')
    var Duplicate
    for (let i = 0; i < resultA.length; i++) {
        // console.log(keepTripcode+"        "+resultA[0])
        // console.log(resultA)
        if (keepTripcode == resultA[i].TripCode) {
            Duplicate = true

        }
    }

    // console.log(TripCode+'ddddddddd')
    console.log(Duplicate)

    if (Duplicate != true) {

        const sql = "INSERT INTO trip(TripCode,StartDate,TripName,TripActivation,TripHost,TripStatus) VALUES (?,?,?,?,?,?)";
        con.query(sql, [TripCode, StartDate, Tripname, 0, TripHost, 0], function (err, result, fields) {
            if (err) {
                res.status(500).send("Server error");
                console.log(err)
            }
            else {
                // res.send('success');
            }
        });
        return text = 'สร้าางทริปเสร็จสั้น';
    }
    else {
        console.log('Duplicete')
        return text = 'ไม่สามาครทำรายการได้กรุณาตรวจสอบรหัสทริปอีกครั้ง';
    }
}

//<======= tripidByhost =======>
// get trip by triphost for list all of triphost was create trip and select the lastest one and then call api UserInTrip
app.get("/tripidByhost/:triphost", function (req, res) {
    var triphost = req.params.triphost;
    const sqlTrip = "SELECT TripID FROM `trip` WHERE TripHost = ? ORDER by TripID DESC";
    con.query(sqlTrip, [triphost], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result[0].TripID);
            // console.log(result[0].TripID)

        }
    });
});

//<====== UserInTrip =======>
// This api can usr for user join trip and who create trip 

app.post("/UserInTrip", function (req, res) {
    // call result from api /tripidByhost/:triphost 
    const { TripID, UserID, TripCode, Collector } = req.body

    const slq = "INSERT INTO `userintrip` ( TripID, UserID,TripCode,Collector) VALUES (?, ?, ?, ?);";
    con.query(slq, [TripID, UserID, TripCode, Collector], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log('error')
        }
        else {
            const slq1 = "SELECT * FROM `userintrip`ORDER BY UserInTrip DESC";
            con.query(slq1, function (err, result1, fields) {
                if (err) {
                    // console.log(err)
                    res.status(500).send("Server error");
                }
                else {
                    // console.log(result1)
                    // console.log(result1[0])
                    res.json(result1[0])
                }
            });

        }
    });
});



//<======= Manage Money for trip =======>
// to upload bill of service money

app.post("/uploadBill", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.status(500).send("Upload failed");
            console.log(err)
            return;
        }
        res.send(req.file.filename);
        console.log(req.file.filename);
    })
});

// insert(keep) trip cost and make log
app.post("/ManageTripMoney", function (req, res) {
    // date = new Date();
    const TranDate = new Date();
    var { TripID, PublicMoney, ServiceName, ServiceMoney, PictureBill, TypePaid, EditorName } = req.body
    const sql = "INSERT INTO `transaction` (`TripID`, `TranDate`, `PublicMoney`, `ServiceName`, `ServiceMoney`, `PictureBill`, `TypePaid`, `EditorName`) VALUES (?,?,?,?,?,?,?,?);";
    con.query(sql, [TripID, TranDate, PublicMoney, ServiceName, ServiceMoney, PictureBill, TypePaid, EditorName], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
        }
    });
});

// <====== get trip infor =======>
app.get("/TripInfor/:tripid", function (req, res) {
    var tripid = req.params.tripid;
    const sqlTrip = "SELECT TripCode,StartDate,TripStatus,TripName FROM `trip` WHERE TripID =?";
    con.query(sqlTrip, [tripid], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            // console.log(result[0].TripID)
        }
    });
});

// <====== get Transaction infor =======>
app.get("/Transaction/:tripid", function (req, res) {
    //TypePaid 0 is public 1 is private
    var tripid = req.params.tripid;
    const sql = "SELECT  usr.Username , date_format(tran.TranDate,'%d-%m-%Y %H:%i:%S') as TranDate,tran.ServiceName,tran.ServiceMoney,tran.TypePaid FROM transaction tran, user usr WHERE  tran.Tripid=? AND tran.EditorName= usr.UserID";
    con.query(sql, [tripid], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            // console.log(result[0].TripID)

        }
    });
});

app.get("/MemberinTrip/:tripid", function (req, res) {
    //TypePaid 0 is public 1 is private
    var tripid = req.params.tripid;
    const sql = "SELECT usr.Username,usr.UserID FROM userintrip ut , user usr WHERE ut.UserID=usr.UserID AND ut.TripID=?";
    con.query(sql, [tripid], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            // console.log(result[0].TripID)

        }
    });
});

app.get("/Collector/:tripid", function (req, res) {
    //TypePaid 0 is public 1 is private
    var tripid = req.params.tripid;
    const sql = "SELECT Collector FROM `userintrip` WHERE TripID=?";
    con.query(sql, [tripid], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            // console.log(result[0].TripID)

        }
    });
})

// laod data of which one user in trip
app.get("/CurrentTrip/:userid", function (req, res) {
    //TypePaid 0 is public 1 is private
    var userid = req.params.userid;
    const sql = "SELECT  ut.TripID,tp.TripName ,DATE_FORMAT(tp.StartDate,'%d/%m/%Y') AS StartDate  FROM userintrip ut, user usr, trip tp WHERE  ut.TripID=tp.TripID AND usr.UserID=ut.UserID AND ut.UserID=? and tp.TripActivation=0 ORDER BY tp.StartDate DESC";
    con.query(sql, [userid], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            // console.log(result[0].TripID)

        }
    });
})

//joinTrip
app.post("/JoinTrip", function (req, res) {
    // const TranDate = new Date();
    const { TripID, UserID, TripCode, Collector } = req.body
    var dup
    var text
    const sql1 = "SELECT UserID FROM `userintrip` WHERE TripID=?";
    con.query(sql1, [TripID], function (err, resultJ, fields) {
        if (err) {
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            for (let i = 0; i < resultJ.length; i++) {
                if (resultJ[i].UserID == UserID) {
                    dup = true
                }
            }
            if (dup != true) {
                const sql = "INSERT INTO `userintrip` ( TripID, UserID,TripCode,Collector) VALUES (?, ?, ?, ?);";
                con.query(sql, [TripID, UserID, TripCode, Collector], function (err, result, fields) {
                    if (err) {
                        res.status(500).send("Server error");
                        console.log(err)
                    }
                    else {
                        text = '0'

                    }
                });
            }
            else {
                text = '1'
            }
            res.send(text)
        }
    });



});

app.get("/checktrip/:tripcode", function (req, res) {
    //TypePaid 0 is public 1 is private
    var tripcode = req.params.tripcode;
    const sql = "SELECT TripID FROM `userintrip` WHERE TripCode=?";
    con.query(sql, [tripcode], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            // console.log(result[0].TripID)

        }
    });
})



// detailTrip
app.get("/detailTrip/:userid", function (req, res) {
    //TypePaid 0 is public 1 is private
    var userid = req.params.userid;
    const sql = "SELECT  ut.TripID,tp.TripName ,DATE_FORMAT(tp.StartDate,'%d/%m/%Y') AS StartDate  FROM userintrip ut, user usr, trip tp WHERE  ut.TripID=tp.TripID AND usr.UserID=ut.UserID AND ut.UserID=? and tp.TripActivation=1 ORDER BY tp.StartDate DESC";
    con.query(sql, [userid], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            // console.log(result[0].TripID)

        }
    });
})

//end trip 
app.put("/endtrip", function (req, res) {
    const tripid = req.body.tripid;
    const endDate = new Date();
    const sql = "UPDATE `trip` SET `EndDate` = ?,`TripActivation` = '1' WHERE `trip`.`TripID` = ?;"
    con.query(sql, [endDate, tripid], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        }
        else {
            res.send("currentTrip_page");
        }
    })
});

//<===========mail send =========>
app.get("/sendmail/:subject/:detail", function (req, res) {
    const subject = req.params.subject;
    const detail = req.params.detail;
    let mailOptions = {
        from: 'checkmail557@gmail.com',                // sender
        to: 'mashareproject@gmail.com',                // list of receivers
        subject: subject,              // Mail subject
        html: detail   // HTML body
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
        }else {
            console.log(info); 
        res.send('0')
        }

    });
});

// <====== get public money from history for particular trip =======>
app.get("/detailTripPublicMoney/:tripid", function (req, res) {
    var tripid = req.params.tripid;
    const sqlTrip = "SELECT SUM(ServiceMoney) AS 'totalPrivateMoney' FROM `transaction` WHERE TripID =? AND TypePaid=0";
    con.query(sqlTrip, [tripid], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            // console.log(result[0].TripID)
        }
    });
});

// <====== get private money from history for particular trip =======>
app.get("/detailTripPrivateMoney/:tripid", function (req, res) {
    var tripid = req.params.tripid;
    const sqlTrip = "SELECT SUM(ServiceMoney) AS 'totalPrivateMoney' FROM `transaction` WHERE TripID =? AND TypePaid=1";
    con.query(sqlTrip, [tripid], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            // console.log(result[0].TripID)
        }
    });
});

app.get("/detailTripTableMoney/:tripid", function (req, res) {
    //TypePaid 0 is public 1 is private
    var tripid = req.params.tripid;
    const sql = "SELECT ServiceName, ServiceMoney, TypePaid FROM `transaction` WHERE TripID=?";
    con.query(sql, [tripid], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
            // console.log(result[0].TripID)

        }
    });
});


// <======Starting server======>
const PORT = 9099
app.listen(PORT, function () {
    console.log("Server port is " + PORT);
});