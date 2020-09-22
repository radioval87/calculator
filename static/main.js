const API_V1_prefix = "/api/v1/"
var HOST = window.location.href;
var processURL = HOST + API_V1_prefix + "create";

var state = false       // ON/OFF
var ScreenData = [];    // A list for the calculator-like input     
var seq = [];           // A list for storing ScreenData lists
var i = 0;              // Iterator for seq list
var operation = {operand1:"", oper:"", operand2:""};    // Data transmitted to server

function power(val){        //Power ON/OFF
    if (val == 1){
        state = true;
        wipe();
    }
    else{
        state = false;
        wipe();
        Screen.value = "";
    }
}
 
function Bfunction(val){                                        //Numerical buttons function
    if (state==true && ScreenData.length < 12){
        Screen = document.getElementById("screen");
        if ((ScreenData[0]==0 && ScreenData[1]!='.')){          //Changes a lonely zero into a digit
            ScreenData=[];
            ScreenData.push(val);
            Screen.value = ScreenData.join("");                 //Screen output
        }
        
        else if ((ScreenData[0]!=0 || ScreenData[1]=='.')){     //Prevents 001-like inputs
            ScreenData.push(val);
            Screen.value = ScreenData.join("");
        }

        else{                                                   //Normal cases
            ScreenData.push(val);
            Screen.value = ScreenData.join("");
        }
    seq[i]=(ScreenData.join(""));                               //Saves the entire value of ScreenData
    console.log(seq)
    }
}

function dotFunction(){                                                 //Dot-separator logic                                      
    if (state==true && ScreenData.length < 12){
        Screen = document.getElementById("screen");
        if (ScreenData.length >0 && ScreenData.includes('.')==false){   //Prevents from dots as a first symbol and multiple dots
            ScreenData.push('.');
            Screen.value = ScreenData.join("");
            console.log(seq)
        }
    }
}

function wipe(){                                                //CE-button. It's used to clear ScreenData and the Screen
    if (state==true){
        Screen = document.getElementById("screen");
        ScreenData = [];
        Screen.value = "0";
        operation = {operand1:"", oper:"", operand2:""}
        i=0
    }
}

function calcFunction(action){                                  //Operators logic
    if (seq[0].length>0 && operation["oper"].length == 0){      //Checks for a first operand ready
        operation["operand1"] = Number(ScreenData.join(""));
        operation["oper"] = action;
        i++;                                                    
        ScreenData = [];
        console.log(operation);
    }   
}

function equals(){

    if (seq[0].length>0 && seq[1].length>0){                                        //Checks for both operands ready

        operation["operand2"] = Number(ScreenData.join(""));

        var xhr = new XMLHttpRequest();                                             //Some interface for server operations
        xhr.open("POST", processURL);                                               
        xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8");
        xhr.send(JSON.stringify(operation));                                        //sends json-version of operation dictionary to server(Python)

        xhr.onreadystatechange = (e) => {
            if(xhr.readyState === XMLHttpRequest.DONE) {                            //necessary checks
                var status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    var jsonBody = JSON.parse(xhr.response);                        //collects answer
                    Screen.value = jsonBody["value"];
                    i=0;
                    seq=[];
                    seq[0]=String(jsonBody["value"]);
                    console.log(operation);
                    operation = {operand1:seq[0], oper:"", operand2:""}
                    ScreenData = [seq[0]];
                    console.log(operation);
                    console.log(seq); 
                } 
                else {
                    console.log("error ", xhr.status);
                }
            }
        }
    }
}


