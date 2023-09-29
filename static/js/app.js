//Validates JSON
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

//Example JSON
/*

{
    "a": 5,
    "b": {
        "p": 10,
        "q": "hello",
        "r": {
            "f": "q",
            "z": 8
        }
    },
    "c": "tucker is stupid",
    "d": "tucker is alledgedly",
    "e": {
        "a": "good boy",
        "list": [1, 2, 3, 4, "hello"]
    }
}

{
    "x": 5,
    "y": 10
}

*/

/*

*/

//Stores JSON as a tree structure to make HTML generation easier
class JSONTree{

    /* 
    JSON Tree Node: 
    {
        type: <"object", "array", "string", "number">
        key: <string>
        value: <string or number>
        children: <[JSON Tree Node]>
    }
    */

    #makeTreeNode = (type, key, value, children) => { return { type: type, key: key, value: value, children: children } };

    constructor(jsonObject){
        this.root = this.buildNodes(jsonObject, null, 0);
    }

    getType(jsonValue){
        if (Array.isArray(jsonValue)) return "array";
        if (jsonValue.constructor === Object) return "object";
        if (typeof jsonValue === "string") return "string";
        if (typeof jsonValue === "number") return "number";

        throw "UNEXPECTED TYPE ERROR";
    }

    //Builds the tree recursivly
    buildNodes(jsonValue, jsonName, depth){
        const t = this.getType(jsonValue);
        const k = jsonName;
        let v = null;
        let c = [];

        if (t === "object"){
            Object.keys(jsonValue).forEach(key => {
                let node = this.buildNodes(jsonValue[key], key, depth + 1);
                c.push(node);
            });
        } else if (t === "array"){
            for (let i = 0; i < jsonValue.length; i++){
                let value = jsonValue[i];

                let node = this.buildNodes(value, i.toString(), depth + 1);
                c.push(node);
            }
        } else {
            v = jsonValue;
        }

        return this.#makeTreeNode(t, k, v, c);
    }

    buildNodes2(root, rootName){
        let ty = this.getType(root);
        let key = rootName;
        let value = null;
        let children = [];
    }

    //TODO: Add non-recursive tree building function here
}


//Builds the html for the json tree recursivly
let _jsonHtmlBlockId = 0; //Id for blocks
function buildJSONHtmlRecursive(root, depth){
    //Shorthand methods
    const block = (name) => `<img src="/img/${name}.gif" class="json-grid-item"/>`;
    const button_block = (name) => `<img src="/img/${name}.gif" class="json-grid-item button-block"/>`;

    //Div start
    let html = `<div id="json-block-id-${_jsonHtmlBlockId}"><span class="tree-span">`;

    //Add spacing
    for (let i = 0; i < depth; i++){
        html += block("s");
    }

    //Add blocks depending on the type
    switch (root.type){
        case "object":
            html += button_block("elbow-minus") + block("object");
            break;
        case "array":
            html += button_block("elbow-minus") + block("array");
            break;
        case "string":
            html += block("s") + block("green");
            break;
        case "number":
            html += block("s") + block("blue");
            break;
    }

    //Add key and/or value if they exist
    if (root.key)
        html += root.key;
    if (root.value)
        html += `: ${root.value}`;

    //End the span
    html += "</span>"

    //Recurse over each child
    root.children.forEach(item => {
        _jsonHtmlBlockId += 1;
        html += buildJSONHtmlRecursive(item, depth + 1);
    });

    //End div
    return html + "</div>";
}

//Creats an easy to read, interactive HTML version of the json
function renderJSON(){
    //Parse the json and create a tree from the result
    let json = JSON.parse($("#json-text-area").val());
    let jt = new JSONTree(json);

    _jsonHtmlBlockId = 0; //Reset the block id
    let htmlJSON = buildJSONHtmlRecursive(jt.root, 0);

    $("#viewer").html(htmlJSON);

    //Whenever one of the +/- buttons is pressed.
    $(".button-block").click(function(){
        let divParentId = $(this).parent().parent().attr("id");
        
        //Toggle show/hide children elements
        $(`#${divParentId} > div`).toggle(100);
    
        //Toggle +/- of the button
        const curr = $(this).attr("src");
        $(this).attr("src", curr === "/img/elbow-minus.gif" ? "/img/elbow-plus.gif" : "/img/elbow-minus.gif");
    });
}

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

//Validate and render JSON
$("#json-render-button").click(() => {
    if (isJson($("#json-text-area").val())){
        renderJSON();
    } else {
        $("#invalid-format-msg").show();
    }
});