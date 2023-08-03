import mysql  from "mysql2"
import dotenv from "dotenv"
import { query } from "express"

dotenv.config()

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password : '87104@Hk',
  database : 'harshdb'
}).promise()


export async function getAll(){
  const data = await pool.query(`SELECT * FROM ALLdata`)
  return data
}

export async function getEntriesStat(attr,val){
  const data = await pool.query(`SELECT * FROM ALLdata 
  WHERE ${attr} = "${val}"`)

  return data
}

export async function getEntriesMultiple(attr,val,attr2,val2){
  const data = await pool.query(`SELECT * FROM ALLdata 
  WHERE ${attr} = "${val}"
  AND   ${attr2} = "${val2}"`)

  return data
}


export async function AddData(room,floor,start,end){
  await pool.query(`
  INSERT INTO ALLdata (Room_No,Floor_No,Start_time,End_time,Status) VALUES (
    '${room}',
    '${floor}',
    '${start}',
    '${end}',
    'Not Booked'
  )`)
}

export async function checkExist(room,floor,stime,etime){
  const data = await pool.query(`SELECT Status from ALLdata 
    WHERE 
    Room_No= '${room}' AND 
    Floor_No = '${floor}' AND
    Start_time = '${stime}'AND
    End_time = '${etime}'`)

    const status = data[0][0]["Status"]
    console.log(status)
    var flag = 0

    if(status === "Not Booked")
    {
      flag = 1
    }

    else
    {
      flag = 0
    }

    return flag
}

export async function check(room,floor,start,end) {
    
  var quote = `SELECT EXISTS(SELECT * FROM ALLdata 
            WHERE Room_No = "${room}"
            AND Floor_No = "${floor}"
            AND Start_time = "${start}"
            AND End_time = "${end}")`

  const result = await pool.query(quote)
  console.log(result[0][0][`"EXISTS(${quote}")`]);  
}


export async function AddBooking(room,floor,start,end,course,sem)
{
    await pool.query(`UPDATE ALLdata
      SET status = "Booked", subject = "${course}" , Semester ="${sem}"
      WHERE Room_No = "${room}"
      AND Floor_No = "${floor}"
      AND Start_time = "${start}"
      AND End_time = "${end}"`)

}

export async function DelBooking(room,floor,start,end)
{
    await pool.query(`UPDATE ALLdata
      SET status = "Not Booked", subject = "NULL" , Semester ="NULL"
      WHERE Room_No = "${room}"
      AND Floor_No = "${floor}"
      AND Start_time = "${start}"
      AND End_time = "${end}"`)

}

export async function DeleteData(room,floor,start,end)
{
    await pool.query(`DELETE FROM ALLdata 
      WHERE Room_No = "${room}"
      AND Floor_No = "${floor}"
      AND Start_time = "${start}"
      AND End_time = "${end}"`)

}

export async function DelData(room,floor,start,end)
{
    await pool.query(`DELETE from ALLdata
      WHERE Room_No = "${room}"
      AND Floor_No = "${floor}"
      AND Start_time = "${start}"
      AND End_time = "${end}"`)


}

