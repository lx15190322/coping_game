var ros; //initiliaize ros
var topic; 
var choice; 
var items = [];
var answer = [];
var result = [];
var num = [1];
window.onload = prepare;
var w; 
var h;
var temp1;
var temp2; 
var alldone = 0;

function prepare(){
    document.body.addEventListener('touchmove', function(e){ e.preventDefault(); }); //disable scroll
	w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    document.getElementById("next").style.left = w - 300; 
    document.getElementById("next").style.top = h - 150;

    h = h - 100; 

    document.getElementById("destination1").style.left = w - 400; 
    document.getElementById("destination1").style.top = h - 350;
    
    document.getElementById("destination2").style.left = w - 400; 
    document.getElementById("destination2").style.top = h - 350;

    //document.getElementById("destination").addEventListener('touchenter', itemEnter, false);

    //w move right by decreasing number , move left by increasig number
    //h move up by increasing number, move down by decreasing number
	document.getElementById("needle").style.left = w - 1000; 
	document.getElementById("needle").style.top = h - 330;
    dragSetup("needle");
    //console.log(pillowX + " , " + pillowY);

    document.getElementById("next").style.left = w - 250; 
    document.getElementById("next").style.top = h - 20;
    
   /* document.getElementById("goal").style.left = w - 900; 
    document.getElementById("goal").style.top = h - 15;

    document.getElementById("goal1").style.left = w- 900; 
    document.getElementById("goal1").style.top = h + 25;

    document.getElementById("debug").style.left = w - 900; 
    document.getElementById("debug").style.top = h - 200;*/

   
    //connecting to ROS
    ros = new ROSLIB.Ros({
        //url : 'ws://ice_newt:9090'
        url : 'ws://192.168.7.70:9090'
    });

    ros.on('connection', function(){
        console.log('Connected to websocket server.');
    });

    ros.on('error', function(error){
        console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function() {
        console.log('Connection to websocket server closed.');
    });
    
}

// dragSetup(name) is for setting up the first location of the draggable items
function dragSetup(name){
    items.push(name);
    var dm = document.getElementById(name);
    dm.addEventListener('touchmove', touchmove, false);
}

function touchmove(event){
    var touch = event.targetTouches[0];
    var name = event.target.id;
    choice = name; //varaible to keep track of who is holding what 
   // document.getElementById("debug").innerHTML = choice + ": " + event.target.style.left + " , " + event.target.style.top;
   // document.getElementById("debug").innerHTML = event.target.style.left + ", " + event.target.style.top;

    var xmin = 882 + 'px'; 
    var xmax = 950 + 'px';
    var ymin = 140 + 'px';
    var ymax = 450 + 'px';	

    if (name == "needle"){
        event.target.style.left = (touch.pageX) + 'px';
        event.target.style.top = (touch.pageY) + 'px';
	//document.getElementById("debug").innerHTML = choice + ": " + event.target.style.left + " , " + event.target.style.top;
    }


    if (event.target.style.left >= xmin && event.target.style.left <= xmax ){ //check if x is in the box
       if (event.target.style.top >= ymin && event.target.style.top <= ymax ){ //check if y is in the box
          //document.getElementById("goal").innerHTML = choice + " in the box!";
	    if (result.length == 1) {
		document.getElementById("needle").style.opacity = 0;
		document.getElementById("destination1").style.opacity = 0;
		document.getElementById("destination2").style.opacity = 0;

		if (alldone < 1) {
			alert ("You are correct!");
			alldone = 1;
			document.getElementById("next").style.display = "inline";
		}
	    }

            var check = false; 
            for (i = 0; i < result.length; i ++){
                if (result[i] == choice){
                    check = true;
                }
            }
            if (check == false){
                result.push(choice);
            }
            result.sort();
        }
    }
    else{
       //document.getElementById("goal").innerHTML = choice + " out of the box!";
        remove(choice);
        result.sort();
    }

   event.preventDefault();
}

function checkAnswer(){
    if (compare()){
        /*
        var message = new ROSLIB.Message({
            data: "Moved correctly "
        });
        topic.publish(message);
        */
        alert("correct");
        display_next();

    }
    else{
        /*
        var message = new ROSLIB.Message({
            data: "Moved incorrectly "
        });
        topic.publish(message);
        */
        alert("incorrect");
    }
   
}

function compare(){
    console.log("result: " + result);
    console.log("answer: " + answer);
    if (result.length != answer.length){
        return false; 
    }
    else{
        for (i = 0; i < answer.length; i++){
            if (answer[i] != result[i]){
                return false; 
            }
        }
        return true; 
	
    }
}

function remove(name){
    for (i = 0; i < result.length; i++){
        if (result[i] == choice){
            result.splice(i, 1);
        }
    }
    if (result.length != 0){
        result.sort();
    }
}

function display_next() {

	document.getElementById("next").style.visibility = "visible";

}
