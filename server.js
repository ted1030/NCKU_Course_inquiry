const express = require('express')
const request = require('request')
const fs = require('fs');
const app = express()
const port = 1000
const bodyParser = require('body-parser')//post
const http = require('http')
const cheerio = require('cheerio')
const url = "http://course-query.acad.ncku.edu.tw/qry/qry002.php?syear=0108&sem=1&dept_no=A9"
const url2 = "http://course-query.acad.ncku.edu.tw/qry/qry_a9_register_num_02.php"
const json2html = require('node-json2html');

//
var WebSocketServer = require('ws').Server;
//

app.use(bodyParser.urlencoded({extended:true}));//to support URL-encided bodies
app.use(express.static(__dirname));

app.listen(port, '127.0.0.1', function () {
});

var data = [], register = [], regcode = []
var data_s = ""
request(url, (err, res, body) => {  
  const $ = cheerio.load(body, { decodeEntities: false });
  $(".course_y0").each(function () { data.push( $(this).text().split('\n') ) } )
  data = data.map(d => {
    var t = []
    t[0] = d[6]//code
    t[1] = d[11]//type
    t[2] = d[13]//eng
    t[3] = d[14]//name
    t[4] = d[16][0]//credit
    t[5] = d[16].substr(1,3)//teacher
    t[6] = d[18]//remain
    t[7] = d[17]
    t[8] = 0    //register num
    t[9] = 0
    t[10] = d[19]//time
    t[11] = d[20].replace(/\s+/g, "")//place
    t[12] = d[7]//full code
    return t
  })
    
  request(url2, (err, res, body) => {
    const $ = cheerio.load(body, { decodeEntities: false });
    $("tbody > tr :nth-child(8)").each(function () { register.push($(this).text()) })
    $("tbody > tr :nth-child(4)").each(function () { regcode.push($(this).text()) })
    var offset = 0
    for (var i in register){
      if (data[i][0] != regcode[Number(i)+offset])
        offset++
      data[i][8] = register[Number(i)+offset]
      data[i][9] = Number(data[i][6] / data[i][8] * 100).toFixed(1) + '%'
      if (data[i][6]/data[i][8] > 1)
        data[i][9] = '100.0%'
    }
    data.forEach(d => {
      data_s += "<tr>"
      d.forEach(e => {data_s += "<td>" + e + "</td>"})
      data_s += "</tr>"
    })
  })
})

app.post("/data", function (req, res) {
  res.send(data_s)
})

app.post("/save", function (req, res) {
  fs.writeFile('course.json', req.body.data, function (err) { if (err) console.log(err) })
})

app.post("/load", function (req, res) {
  fs.readFile('course.json', function(err, data){
    res.send(data);
  })
})




//var server = http.createServer().listen(port)
//
//var w = new WebSocketServer({server});
//
/* w.on('connection', function (ws){
  ws.on('message', function (data) {
    if (data.substr(0,1) == "a"){
      ws.send(num+"a"+year);
    }
    else if (data.substr(0, 1) == "y"){
      c.query("UPDATE`user` SET`year` = '" + data.substr(1) + "' WHERE`user`.`id` = '" + id + "'", function (error, d, fields) {
        if (error) {
          throw error;
        }
      })
    }
    else if (data.substr(0, 1) == "n"){
      c.query("UPDATE`user` SET`num` = '" + data.substr(1) + "' WHERE`user`.`id` = '" + id + "'", function (error, d, fields) {
        if (error) {
          throw error;
        }
      })
    }
  });
  ws.on('close', function (data) {
    id = 0
  })
});

 */





