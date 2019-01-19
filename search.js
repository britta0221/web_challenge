// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
// = require jquery
// = require jquery_ujs
// = require turbolinks
// = require_tree
// = require welcome.js


//localStorage.clear();

$( document ).ready(function() {
    getFavourited();
});


//
function creatFavouritedList(favourited_result_list){
  var str = '<h1 style=" color:green; font-size:15px">Favourites</h1>';
  var temp_id;
  //alert(JSON.stringify(favourited_result_list));
  favourited_result_list.forEach(function (ele, index) {

      temp_id = HTMLDecode(ele.favourited_item_title).replace(/[^a-zA-Z0-9]+/ig,"");

      str += '<div class="favourited_container" id = "favourited_container">'+
      '<div class="title"><button type="button" class = "saved" name="like" id='+ temp_id+' onclick="likeIt(this);">'+
      '<span class="glyphicon glyphicon-star" >'+"&#9733"+'</span> '+
      '</button> '+ HTMLDecode(ele.favourited_item_title)+ '</div>'+
      '<div class="description">'+HTMLDecode(ele.favourited_item_description)+'</div>'+
      '</div>';

   //alert(temp_id);
 })
  //alert(str);

  $("#favourited-list").html(str);
  var temp = $("#favourited-list").html();
  //alert(temp);

}



//
function getFavourited(){
var url = 'https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000';

    $.ajax({
          type:'GET',
          dataType:'json',
          async: false,
          url: url,
          success: function (data) {

            var favourited_result = [];
            //alert("load favourited successfully!");

            for (var i = 0; i < localStorage.length; i++){
              var id = localStorage.key(i);
              //alert(id);
              for (var j = 0; j < data.length - 1; j++){
                var match_title = data[j]['title'].replace(/[^a-zA-Z0-9]+/ig,"");

                if( id == match_title ){

                  var favourited_result_item = {
                    favourited_item_title: data[j]['title'],
                    favourited_item_description: data[j]['body'],
                  };

                  favourited_result.push(favourited_result_item);
                  //alert(favourited_result);
                  //alert(JSON.stringify(favourited_result_item));

                }
              }

          }
          creatFavouritedList(favourited_result);
        },
          error: function(){
            alert("fail");
          }
      });
      //alert(JSON.stringify(favourited_result));
      //creatFavouritedList(favourited_result);

}


function searchResult(){

  var inputValue = $("#key_word").val();

  //var inputValue = 'takeout';
  //alert(inputValue);
  var url = 'https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000';
  $.ajax({
      type:'GET',
      dataType:'json',
      async: false,
      url: url,
      success: function (data) {

        var search_result = [];

        for ( var i = 0; i < data.length - 1; i++){
          var keyword = data[i]['keywords'];
          if (keyword.indexOf(inputValue) != -1){

            var search_result_item = {
              item_title: data[i]['title'],
              item_description: data[i]['body'],


            };
            search_result.push(search_result_item);
          }
        }
        
        //alert(JSON.stringify(search_result));
        //$("#test").html('werrr');
        createList(search_result);


      },
      error: function () {
          alert(url);
      }
  });

}



function createList(search_result_list){
    var str = '';
    var temp_id;
    var item_class = "notSaved";

    search_result_list.forEach(function (ele, index) {

        temp_id = HTMLDecode(ele.item_title).replace(/[^^a-zA-Z0-9]+/ig,"");
        //check favourited
        if (localStorage.hasOwnProperty(temp_id)){
          item_class = "saved";
        }

        str += '<div class="grid-container" id = "container">'+
        '<div class="title"><button type="button" class = '+item_class+' name="like" id='+ temp_id+' onclick="likeIt(this);">'+
        '<span class="glyphicon glyphicon-star" >'+"&#9733"+'</span> '+
        '</button> '+ HTMLDecode(ele.item_title)+ '</div>'+
        '<div class="description">'+HTMLDecode(ele.item_description)+'</div>'+
        '</div>';
        item_class = "notSaved";
     //alert(temp_class);
     })

    $("#btn-list").html(str);
    //var test = $("#btn-list").html();
    //alert(test);

    //alert(temp_class);

}


function HTMLDecode(text) {
  var temp = document.createElement("div");
  temp.innerHTML = text;
  var output = temp.innerText || temp.textContent;
  temp = null;
  return output;
}


function likeIt(data){

  var myId = data.id;
  //alert(myId);
  if (!localStorage.hasOwnProperty(myId)){
    alert("add!");
    localStorage.setItem(myId,"1");
    //$("#"+myId).toggleClass('saved');

  }else{
    alert("remove!");
    //alert(myId);
    localStorage.removeItem(myId);
    //$("#"+myId).toggleClass('notSaved');
  }
  //$("#"+myId).toggleClass('cs');

  //update favoutited list
  if($("#"+myId).attr("class") == "saved"){
    $("#"+myId).toggleClass('notSaved');
  }
  if($("#"+myId).attr("class") == "notSaved"){
    $("#"+myId).toggleClass('saved');
  }

  getFavourited();
  searchResult();

}

function clearResult(){

  var input_value_now = $("#key_word").val();
  if (input_value_now == ""){
    //alert("收到");
    // var div = document.getElementById("btn-list");
    // div.empty();
    $("#btn-list").empty();

  }

}

$(function(){
    document.onkeydown = function(e){  
      var ev = document.all ? window.event : e;
      if(ev.keyCode==13) {// 如（ev.ctrlKey && ev.keyCode==13）为ctrl+Center 触发
          
          searchResult();

      }
    }
 });

