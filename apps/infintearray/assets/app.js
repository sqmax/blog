var body,
    div,
    stat,
    msg,
    control,
    array;

var statmsg="";
var total = 0;
var sum = 0;
var avg = 0;

var on = true;

// Main class:
(function(){
    init();
    
})();

function init(){
    statmsg = total;
    insertArrayInput();
    statPanel();
    EventListeners();
    
}

function EventListeners(){
    $('.smallbox').on("keypress",function(e){

        if($(this).next().is('input')){
            sum += parseInt(e.which)-48;
            $(this).next().focus();
        } else {
            insertNewInput();
            $(this).next().focus();
            sum += parseInt(e.which)-48;
            EventListeners();
        }
        calculation();
        statPanel();
    });
}

function calculation(){
    statmsg = total;
    avg = sum/total;
}

function insertArrayInput(){
    show('insert');
    body = $('body');
    div = $('<div id="array"></div>');
    array = inputTextCreation('text',3);
    div.append(array);
    body.append(div);
}

function insertNewInput(){
    div.append(inputTextCreation('text',1));
}

function inputTextCreation(prefix,num){
    var res = '';
    for(var i = 0; i < num ; i++)
        res+='<input class="smallbox" type="text" id="'+prefix+(total+i)+'" name="'+prefix+(total+i)+'">';    
    //show(res);
    total+=num;
    return res;
}

function statPanel(){
    $('#stat').remove();
    stat = $('<div id="stat"></div>');
    msg = $('<div id="msg">Total cells: '+statmsg+' Sum: '+sum+' Avg: '+avg+'</div>');
    stat.append(msg);
    body.append(stat);
}


function show(msg){
    console.log(msg);
}

function post(msg){
    $('#msg').html(msg);
}