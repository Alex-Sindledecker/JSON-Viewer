//Allow tab indentation to work with text areas
$("#json-text-area").on("keydown", function(e){
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