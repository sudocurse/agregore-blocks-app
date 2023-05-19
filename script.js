function navigate(link) {
    window.location.href = link;
}

function makeInputElement(value) {
    let input = document.createElement("input");
    input.setAttribute("class", "add-block-input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Enter URL");
    input.setAttribute("value", value);
    return input;
}

class Block {
    constructor(link) {
        this.data = link;

        this.func = navigate.bind(this, link);
        this.drawEdit = this.drawEdit.bind(this);
        this.saveEdit = this.saveEdit.bind(this);
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

        let blockElement = event.target.parentElement.parentElement;

        let input = makeInputElement(this.data);

        blockElement.replaceChild(input, blockElement.firstChild);

        let confirmButton = document.createElement("a");
        confirmButton.setAttribute("href", "#");
        confirmButton.setAttribute("class", "confirm-edit-button");
        confirmButton.append(document.createTextNode("Save ✔️"));

        // find overlay in block element
        let overlay = blockElement.getElementsByClassName("overlay")[0];
        overlay.replaceChild(confirmButton, overlay.firstChild);

        blockElement.removeEventListener("click", this.func);

        confirmButton.addEventListener("click", this.saveEdit);
    }

    saveEdit(event) {
        event.stopPropagation();
        // get input
        let blockElement = event.target.parentElement.parentElement;
        let input = blockElement.getElementsByTagName("input")[0];
        this.data = input.value;
        this.func = navigate.bind(this, this.data);
        while (blockElement.firstChild) {
            blockElement.removeChild(blockElement.firstChild);
        }
        drawBlocks();
    };
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
            blocks.push(block);
            drawBlocks();

            input.value = "";
        }
    }

    draw() {
        /* this one is a little different */
        let blockElement = document.createElement("div");
        blockElement.setAttribute("class", "block add-block");

        // prepend text input field
        let input = makeInputElement("");

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
    return new Block(link);
}


let blocks = [];

function drawBlocks(){
    let shelf = document.getElementById("shelf");
    while (shelf.firstChild) {
        shelf.removeChild(shelf.firstChild);
    }
    for (let block of blocks) {
        // draw the block
        shelf.append(block.draw());
    }
}

window.onload = function run() {
    let rootDiv = document.getElementById("root");
    rootDiv.textContent = "My Collection";

    let shelf = document.createElement("div");
    shelf.setAttribute("id", "shelf");
    rootDiv.append(shelf);

    let addBlock = new AddBlock();
    blocks.push(addBlock);

    let b = makeBlock("https://www.duckduckgo.com");
    blocks.push(b);

    drawBlocks();
};
