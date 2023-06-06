const express = require("express");
const { check, validationResult } = require("express-validator");


const mongoose = require("mongoose");
const NGOUser = require("../models/ngouser");
const Refugeerequest = require("../models/req");
const Refugee = require("../models/refugee");
const RefugeeUser = require("../models/refugee");
const PatronUser = require("../models/patron");

const PatronOffer = require("../models/patronoffer");

// Searching module
const MiniSearch = require("minisearch");


const router = express.Router();
const bodyparser = require("body-parser");
var nodemailer = require("nodemailer");
const { findById } = require("../models/ngouser");

const { request } = require("http");

const { response } = require("express");
var urlencodedparser = bodyparser.urlencoded({ extended: false });
bodyParser = require("body-parser").json();



function ngoAuthMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.usertype == "ngo") {
      return next();
    } else {
      return res.sendStatus(404);
    }
  }
  res.redirect("/auth/login");
}

function patronAuthMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.usertype == "patron") {
      return next();
    } else {
      return res.sendStatus(404);
    }
  }
  res.redirect("/auth/patron-login");
}

// When the New Refugee form is visited
router.get("/refugeeForm", ngoAuthMiddleware, (req, res) => {
  res.render("refugeeFormTemplate.ejs");
});

// When the SUBMIT button on the new refugee form is hit.
router.post("/refugeeForm", ngoAuthMiddleware, (req, res) => {
  let newRefugeeUser = new RefugeeUser({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    gender: req.body.age,
    govID: req.body.govID,
    phone_number: req.body.phone_number,
    email: req.body.email,
    home_address: {
      street: req.body.street,
      locality: req.body.locality,
      city: req.body.city,
      zip: req.body.zip,
    },
  });

  newRefugeeUser.save().then(res.redirect("/ngo_view"));
});

// When the Patron form is visited
router.get("/patronForm", patronAuthMiddleware, (req, res) => {
  res.render("patronForm.ejs", { email: req.user.email });
});

router.get("/refugeeRequestForm", ngoAuthMiddleware, (req, res) => {
  res.render("refugeeRequestForm.ejs");
});

router.post(
  "/newRefugeeRequestRegistration",
  ngoAuthMiddleware,
  async (req, res) => {
    console.log("lol");
    console.log(req.body);
    const refs = await Refugee.aggregate([
      {
        $match: {
          $expr: {
            $in: [
              { firstname: "$firstname", lastname: "$lastname" },
              req.body.refugees,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ])
      .allowDiskUse(true)
      .exec();
    const refugee_ids = refs.map((x) => x["_id"]);
    console.log("ngo id", req.user._id);
    let refRequest = new Refugeerequest({
      NgoId: mongoose.Types.ObjectId(req.user._id),
      refugees: refugee_ids,
      numofppl: refugee_ids.length,
      status: "pending",
    });

    await refRequest
      .save()
      .then((res) => {
        console.log("Save Successful!");
      })
      .catch((err) => {
        throw err;
      });
    res.redirect("/ngo_view");
  }
);

// When the SUBMIT button on the new Patron form is hit.
router.post("/patronForm", (req, res) => {
  PatronUser.findOneAndUpdate(
    { _id: req.user._id },
    {
      name: req.body.firstname + " " + req.body.lastname,
      phone_number: req.body.phone_number,
      address:
        req.body.street +
        " " +
        req.body.locality +
        " " +
        req.body.city +
        " " +
        req.body.zip,
    }
  ).then((success) => {
    res.redirect("/patronOfferForm");
  });

});

router.get("/ngo_view", ngoAuthMiddleware, (req, res) => {
  console.log(req.user);
  Refugeerequest.find({
    NgoId: new mongoose.Types.ObjectId(req.user._id),
    status: "pending",
  })
    .lean()
    .then(async (requests) => {
      console.log(requests);
      for (let i = 0; i < requests.length; i++) {
        const each_names = [];
        requests[i].names = [];
        for (let j = 0; j < requests[i].refugees.length; j++) {
          var string_id = String(requests[i].refugees[j].valueOf());
          await Refugee.findById(string_id).then((res) => {
            each_names.push(res.firstname.concat(" ", res.lastname));
          });
        }
        requests[i].names = each_names;
        const date1 = new Date(requests[i].time);
        const date2 = new Date();
        if (date2 < date1) {
          date2.setDate(date2.getDate() + 1);
        }

        var diff = date2 - date1;
        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        requests[i].time = hh;
      }
      res.render("ngo.view.ejs", { refugee_requests: requests });
    });
});

router.post("/getPatrons", ngoAuthMiddleware, (req, res) => {
  PatronOffer.find({
    noPeople: { $eq: Number(req.body.totalPeople) },
    status: "pending",
  })
    .lean()
    .then(async (response) => {
      console.log("lol");
      console.log(response);
      for (var i = 0; i < response.length; i++) {
        console.log(response[i].patronID);
        await PatronUser.findOne({
          _id: new mongoose.Types.ObjectId(response[i].patronID),
        }).then((res1) => {
          console.log(res1);
          if (res1 != null) response[i].name = res1.name;
        });
      }
      console.log(response);
      res.json({ patrons: response });
    });
});

router.post("/getPatronDetails", ngoAuthMiddleware, (req, res) => {


  const Id = req.body.Id;
  PatronOffer.find({ _id: Id })
    .lean()
    .then(async (offer_details) => {
      console.log(offer_details);
      await PatronUser.findById(
        new mongoose.Types.ObjectId(offer_details[0].patronID)
      ).then((patron_details) => {
        offer_details[0].name = patron_details.name;
        offer_details[0].phone_number = patron_details.phone_number;
        offer_details[0].email = patron_details.email;
        res.json({ patron_details: patron_details });
      });
    });
});

router.get("/findPeople", (req, res) => {
  res.render("findPeople.ejs", {
    matching_data: ["koushik", "dsk", "sashank"],
  });
});

// Used to display Refugee Request Registration
router.get("/newRefugeeRequestRegistration", ngoAuthMiddleware, (res, req) => {
  res.render("refugeeRequestForm.ejs");
});

// Used by 'RefugeeRequest' module
router.post("/searchRefugeesbyName", (req, res) => {
  RefugeeUser.find({}, function (err, findresults) {
    if (err) {
      console.log(err);
    } else {
      let miniSearch = new MiniSearch({
        fields: ["firstname", "lastname"], // fields to index for full-text search
        storeFields: ["_id", "firstname", "lastname"], // fields to return with search results
      });

      miniSearch.addAll(findresults);

      let results = miniSearch.search(req.body.searchkeyword);

      res.json({ data: results });
    }
  });
});



//Find loved one's module

router.get("/findLoved", (req, res) => {
  var resultList = [];

  refugeeFirstName = "Alec";
  refugeeLastName = "Thompson";

  RefugeeUser.find(
    { firstname: refugeeFirstName, lastname: refugeeLastName },
    async function (err, findresults) {
      if (err) {
        console.log(err);
      } else {
        searchLastName = findresults[0].lastname;
        searchStreet = findresults[0].home_address.street;
        searchLocality = findresults[0].home_address.locality;

        var search1Criteria = [searchLastName, searchStreet, searchLocality];
        var search2Criteria = [
          "lastname",
          "home_address.street",
          "home_address.locality",
        ];


        for (var k = 0; k < search2Criteria.length; k++) {
          let temp1 = search2Criteria[k];
          let temp2 = search1Criteria[k];
          console.log(temp1, temp2);
          await RefugeeUser.find({ temp1: temp2 }, function (err, findresults) {
            if (err) {
              console.log(err);
            } else {
              console.log(findresults);
              for (var i = 0; i < findresults.length; i++) {
                console.log(findresults[i]);
                resultList.push(findresults[i]);
              }
              console.log(resultList);
            }
          });
        }
      }
    }
  );
});



router.post("/getRefugees", (req, res) => {
  Refugee.find({}).then((refs) => {
    let miniSearch = new MiniSearch({
      fields: ["firstname", "lastname"], // fields to index for full-text search
      storeFields: ["_id", "firstname", "lastname"], // fields to return with search results
      searchOptions: {
        fuzzy: 0.4,
        prefix: true,
      },
    });
    miniSearch.addAll(refs);
    console.log(req.body["searchKeyWord"]);
    let results = miniSearch.search(req.body["searchKeyWord"]);
    console.log(results);
    res.json({ data: results });
  });
});

// When the New Refugee form is visited
router.get("/patronOfferForm", patronAuthMiddleware, (req, res) => {
  PatronUser.findById(req.user._id).then((patron) => {
    if (patron.name == undefined) {
      return res.redirect("./patronForm");
    } else {
      return res.render("patronOfferForm.ejs");
    }
  });
});

router.post("/patronOfferForm", patronAuthMiddleware, async (req, res) => {
  console.log(req.body);

  let patronoff = new PatronOffer({
    patronID: new mongoose.Types.ObjectId(req.user._id),
    noPeople: req.body.age,
    addressOfAccomodation: {
      street: req.body.street,
      locality: req.body.locality,
      city: req.body.city,
      zip: req.body.zip,
    },
    status: "pending",
  });
  await patronoff.save().then(() => {
    console.log("save successfull.");
  });

  res.redirect("/patronOfferForm");
});



router.post("/assignRequest", (req, res) => {
  Refugeerequest.findOneAndUpdate(
    { _id: req.body.refugeeReqId },
    {
      assigned: new mongoose.Types.ObjectId(req.body.patronOfferId),
      status: "complete",
    }
  ).then((response) => {
    PatronOffer.findOneAndUpdate(
      { _id: req.body.patronOfferId },
      { status: "complete" }
    ).then((poRes) => {
      return res.sendStatus(200);
    });
  });
});

module.exports = router;
