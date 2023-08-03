import express from "express";
import bodyParser from "body-parser";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import alert from 'alert'
import {AddData,getEntriesMultiple,getEntriesStat,checkExist,AddBooking,DelBooking,getAll,DeleteData} from "./DataBases/database.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)




const port = 3000
const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))




app.get("/" , (req,res) => {
  res.render("main.ejs")
})
// BOOKING PAGE CODE AND CHANGING STATUS TO BOOKING (HOME PAGE)
app.get("/class/book", (req,res)=>{
  res.render("BookClass.ejs")
})

app.post("/class/book", async (req,res) =>{

  var Floor = req.body.Floor
  var Room  = req.body.class
  var Start = req.body.stime
  var End = req.body.etime
  var Course = req.body.course
  var Sem = req.body.sem

  const flag = checkExist(Room,Floor,Start,End)
  flag.then(function(result){
    if(result===1)
    {
      console.log("YESSSS");
      AddBooking(Room,Floor,Start,End,Course,Sem)
      alert("BOOKING SUCCESSFUL")
    }
    else
    {
      console.log("NOOOOOOOooo")
      alert("Already Booked")
    }

  })

  res.redirect("/class/book")
})

// DELETE BOOKING STREAM
app.get("/class/del", (req,res)=>{
  res.render("DelBook.ejs")
  
})

app.post("/class/del", async (req,res) =>{

  var Floor = req.body.Floor
  var Room = req.body.class
  var Start = req.body.stime
  var End = req.body.etime
  
  const flag = checkExist(Room,Floor,Start,End)
  flag.then(function(result){
    if(result===0)
    {
      console.log("YESSSS");
      DelBooking(Room,Floor,Start,End)
      alert("BOOKING DELETED")
    }
    else
    {
      alert("NOT BOOKED YET")
    }

  })

  res.redirect("/class/del")
})




// DATA PAGE CODE AND PUUTING INTO DATABASE (/DATA STREAM)
app.get("/data" , async (req,res) =>{
  res.render("DataBaseEntry.ejs")
})

app.post("/data", (req,res) => {
  var Floor = req.body.Floor
  var Room = req.body.class
  var Start = req.body.stime
  var End = req.body.etime

  AddData(Room,Floor,Start,End)
  alert("Entry Succesfully made to the Database")
  res.redirect("/data")
})

app.get("/data/del" , async (req,res) =>{
  res.render("DelDataBaseEntry.ejs")
  
})

app.post("/data/del", (req,res) => {
  var Floor = req.body.Floor
  var Room = req.body.class
  var Start = req.body.stime
  var End = req.body.etime

  DeleteData(Room,Floor,Start,End)
  alert("Slot Deleted the Database")
  res.redirect("/data/del")
})




// SHOW BOOKED ENTRY PAGES (BASED ON STATUS)
app.get("/show/stat",(req,res) => {
  res.render("stat.ejs")
})

app.post("/show/stat", (req,res) =>{
  var stat = req.body.status
  if(stat === "all")
  {
    const data = getAll("Status",stat)
    data.then(function(result){

      res.render("stat.ejs", {Result : result})

    })
  }
  else{  
    const data = getEntriesStat("Status",stat)
    data.then(function(result){

      res.render("stat.ejs", {Result : result})

    })
  }

})

// SHOW BOOKED ENTRY PAGES (BASED ON STATUS AND FLOOR)
app.get("/show/floor",(req,res) => {
  res.render("floor.ejs")
})

app.post("/show/floor", (req,res) =>{
  var floor = req.body.floor
  var stat = req.body.status

  if(stat === "*")
  {
    const data = getEntriesStat("Floor_No",floor)
    data.then(function(result){
      res.render("floor.ejs", {Result : result})
    })
  }
  else
  {  
    const data = getEntriesMultiple("Floor_No",floor,"Status",stat)
    data.then(function(result){

    res.render("floor.ejs", {Result : result})
    
  })
  }
  
})



app.listen(port , function(){
  console.log(`Server started at ${port}`);
})