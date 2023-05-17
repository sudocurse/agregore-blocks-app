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
            console.log("adding " + link);

        }
    }

    draw() {
        let element = super.draw();
        // prepend text input field
        element.setAttribute("class", "block add-block");
        let input = document.createElement("input");
        input.setAttribute("class", "add-block-input");
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", "Enter URL");
        element.prepend(document.createElement("br"));
        element.prepend(input);

        return element;
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

window.onload = function run() {
    let rootDiv = document.getElementById("root");
    rootDiv.textContent = "My Collection";

    let blocks = [];

    let shelf = document.createElement("div");
    shelf.setAttribute("id", "shelf");
    rootDiv.append(shelf);

    let b = makeAddBlock();
    blocks.push(b);

    b = makeBlock("https://duckduckgo.com/");
    blocks.push(b); // todo position

    blocks.push(makeBlock("https://developer.mozilla.org/"));
    blocks.push(makeBlock("https://www.zombo.com/"));
    blocks.push(makeBlock("ipns://docs.ipfs.tech/"));
    blocks.push(makeBlock("ipns://libp2p.io/"));
    blocks.push(makeBlock("ipfs://bafybeiggiypjr5l5xwjtgbc5hndu3xigcl6arf62mlx5ekhflemjhhifpy"));

    for (let block of blocks) {
        shelf.append(block);
    }
};
