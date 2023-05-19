function makeInputElement(value) {
    let input = document.createElement("input");
    input.setAttribute("class", "add-block-input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", value);
    return input;
}

class Block {
    constructor(link) {
        this.data = link;

        this.func = function() {
            window.location.href = link;
        };
    }

    draw() {
        let blockElement = document.createElement("div");
        blockElement.setAttribute("class", "block");
        blockElement.append(document.createTextNode(this.data));

        // on click
        blockElement.addEventListener("click", this.func);

        // edit button overlay
        let overlay = document.createElement("div");
        overlay.setAttribute("class", "overlay");

        let editButton = document.createElement("a");
        editButton.setAttribute("href", "#");
        editButton.setAttribute("class", "edit-button");
        editButton.append(document.createTextNode("✏️"));

        editButton.addEventListener("click", this.drawEdit);

        overlay.append(editButton);

        blockElement.append(overlay);
        return blockElement;
    }

    drawEdit(event) {
        event.stopPropagation();
    }
}

class AddBlock extends Block {
    constructor() {
        super();
        this.data = "Add Block +";
        this.func = function() {
            let input = document.getElementsByClassName("add-block-input")[0];
            let link = input.value;
            if (!link) {
                return;
            }
            let block = new Block(link);
            blocks.push(block.draw());
            drawBlocks();

            input.value = "";
        }
    }

    draw() {
        /* this one is a little different */
        let blockElement = document.createElement("div");
        blockElement.setAttribute("class", "block add-block");

        // prepend text input field
        let input = makeInputElement("Enter URL");

        blockElement.append(input);
        blockElement.append(document.createElement("br"));

        let addButton = document.createElement("a");
        addButton.setAttribute("class", "add-block-button");
        addButton.append(document.createTextNode(this.data));
        addButton.addEventListener("click", this.func);

        blockElement.append(addButton);

        return blockElement;
    }
}

function makeBlock(link, position=-1) {
    // make the block object out of a link
    let block = new Block(link);

    // draw the block
    return block.draw();
}

function makeAddBlock() {
    let block = new AddBlock();
    return block.draw();
}

let blocks = [];

function drawBlocks(){
    let shelf = document.getElementById("shelf");
    for (let block of blocks) {
        shelf.append(block);
    }
}

window.onload = function run() {
    let rootDiv = document.getElementById("root");
    rootDiv.textContent = "My Collection";

    let shelf = document.createElement("div");
    shelf.setAttribute("id", "shelf");
    rootDiv.append(shelf);

    let b = makeAddBlock();
    blocks.push(b);

    b = makeBlock("https://www.duckduckgo.com");
    blocks.push(b);

    drawBlocks();
};
