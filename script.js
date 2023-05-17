class Block {
    constructor(link) {
        this.data = link;

        this.func = function() {
            window.open(this.data, "_blank");
        };
    }

    draw() {
        let blockElement = document.createElement("div");
        blockElement.setAttribute("class", "block");
        blockElement.append(document.createTextNode(this.data));

        // on click
        blockElement.addEventListener("click", this.func);
        return blockElement;
    }
}

function makeBlock(link, position=-1) {
    // make the block object out of a link
    let block = new Block(link);

    // draw the block
    return block.draw();
}

window.onload = function run() {
    let rootDiv = document.getElementById("root");
    rootDiv.textContent = "My Collection";

    let blocks = [];
    let b = makeBlock("Add New Block"); // todo: add some functionality
    blocks.push(b);

    b = makeBlock("https://duckduckgo.com/");
    blocks.push(b); // todo position

    blocks.push(makeBlock("https://developer.mozilla.org/"));
    blocks.push(makeBlock("https://www.zombo.com/"));
    blocks.push(makeBlock("ipns://docs.ipfs.tech/"));
    blocks.push(makeBlock("ipns://libp2p.io/"));

    let shelf = document.createElement("div");
    shelf.setAttribute("id", "shelf");
    rootDiv.append(shelf);

    for (let block of blocks) {
        shelf.append(block);
    }
};
