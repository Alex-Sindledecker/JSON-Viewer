//Allow tab indentation to work with text areas
$("#json-text-area").on("keydown", function(e){
    $("#invalid-format-msg").hide();
    
    let keycode = e.keyCode || e.which;

    if (keycode == 9 ) { //tab keycode
        e.preventDefault();

        let cursorPos = document.getElementById("json-text-area").selectionStart;
        let text = $("#json-text-area").val();

        $("#json-text-area").val(text.slice(0, cursorPos) + "    " + text.slice(cursorPos));
        document.getElementById("json-text-area").selectionStart = cursorPos + 4;
        document.getElementById("json-text-area").selectionEnd = cursorPos + 4;
    }
});

function isJson(item) {
    //Sourced from https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not
    let value = typeof item !== "string" ? JSON.stringify(item) : item;    
    try {
      value = JSON.parse(value);
    } catch (e) {
      return false;
    }
      
    return typeof value === "object" && value !== null;
  }

$("#json-render-button").click(() => {
    if (isJson($("#json-text-area").val())){
        
    } else {
        $("#invalid-format-msg").show();
    }
});