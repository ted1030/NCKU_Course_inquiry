var url = "http://class-qry.acad.ncku.edu.tw/syllabus/online_display.php?syear=0108&sem=1&co_no="
var table = [], filter = []
for (var i = 0; i<9 ;i++)
  table.push([0,0,0,0,0])
$(document).ready(function(){  
    $.ajax({
      method: "post",
      url: "./data",
      data: {
        hi: 100
      },
      success: function(data) {
        $("#data").append(data)
        $("#data tr").not("#title").each(function(){
          var d = [0,1,2,4,5,10] ,d2 = [6,7,8,9]
          $("td", this).eq(0).html('<button type = "button" class="btn btn-danger btn-sm" >X</button>'+$("td", this).eq(0).text())
          $(".btn-danger").css({"left":"-30px","position":"relative"})
          $("td", this).eq(12).css("display", "none")
          $("td", this).eq(3).html("<a target='_blank' href = '" + url + $("td", this).eq(12).text() + "'>" + $("td", this).eq(3).text() + "</a><a style='float:right;' target='_blank' href='https://www.facebook.com/groups/637099219647956/search/?query=" + $("td", this).eq(3).text() +"'>fb</a>")
          $("a", this).css("color", "#152e63")
          for (i in d)
            $("td", this).eq(d[i]).css("text-align", "center")
          for (i in d2) 
            $("td", this).eq(d2[i]).css("text-align", "right")
        })
      }
    })
  $("#load").click(function () {//load
    $.ajax({
      method: "post",
      url: "./load",
      data: {
        hi: 100
      },
      success: function (data) {
        filter = JSON.parse(data)
        $("#data tr").not("#title").each(function (){
          for (i in filter){
            if ($(':nth-child(1)', this).eq(0).text().substring(1) == filter[i])              
              return
          }
          $(this).remove()
        })
      }
    })
  })  
  $("#save").click(function () {//save
    filter.length = 0
    $("#data tr").not("#title").each(function () {
      filter.push($('td:nth-child(1)', this).text().substring(1))
    })
    $.ajax({
      method: "post",
      url: "./save",
      data: {data: JSON.stringify(filter)}      
    })
  })
  $("#data").on("click",".btn-danger",function () {//delete
    console.log($(this).html())
    $(this).parent().parent().remove()
  })  
  $("#eng").click(function () {//刪除英文
    $("#data tr").not("#title").each(function (e) {
      if ($(':nth-child(3)', this).html() == "Y")
        $(this).remove()
    })
  })
  $("#reg").click(function () {//刪除非數字
    $("#data tr").not("#title").each(function (){
      if (isNaN(Number($(':nth-child(9)', this).text())))
        $(this).remove()
    })
    var so = $("#data tr").not("#title").get().sort(function (x,y){      
      return Number($(':nth-child(9)', y).text()) - Number($(':nth-child(9)', x).text())
    })
    $.each(so, function (index, row) {
      $("#data").children('tbody').not("#title").append(row);
    })
  })
  $("#time").click(function(){//選擇空堂
    $("#filter").toggle();
  })
  $("#s tr td").click(function (e) {//空堂變色
    e.stopPropagation()
    $(this).css("background","linear-gradient(50deg,#2096ff,#05ffa3)");
    var a = $(this).parent().index(), b = this.cellIndex
    if (a < 4)
      a++
    if (table[a][b] == 1){
      $(this).css("background","linear-gradient(50deg,#ffd86f,#fca062)");
      table[a][b] = 0
    }
    else
      table[a][b] = 1
  })
  $("#filter").on("click", "#ok", function () {//過濾
    $("#filter").hide();
    $("#data tr").not("#title").each(function (e) {
      var time = $(':nth-child(10)', this).html()
      if (time[3] == "N" || time[5] == 9 || time == "未定"){
        $(this).remove() 
        return
      }      
      if (table[time[3]][time[1] - 1] == 0)
        $(this).remove()     
      if (time.length < 6)
        return
      if (table[time[5]][time[1] - 1] == 0)
        $(this).remove() 
    })
  })
  
})


