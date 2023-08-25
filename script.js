function navigate(link) {
    window.location.href = link;
}

function makeInputElement (value) {
  const input = document.createElement('input')
  input.setAttribute('class', 'add-block-input')
  input.setAttribute('type', 'text')
  input.setAttribute('placeholder', 'Enter URL')
  input.setAttribute('value', value)
  return input
}

class Block {
  constructor (link) {
    this.data = link

    this.func = navigate.bind(this, link)
    this.drawEdit = this.drawEdit.bind(this)
    this.saveEdit = this.saveEdit.bind(this)
    this.deleteBlock = this.deleteBlock.bind(this)
  }

  draw () {
    const blockElement = document.createElement('div')
    blockElement.setAttribute('class', 'block')
    blockElement.append(document.createTextNode(this.data))

    // on click
    blockElement.addEventListener('click', this.func)

    // edit button overlay
    const overlay = document.createElement('div')
    overlay.setAttribute('class', 'overlay')

    const editButton = document.createElement('a')
    editButton.setAttribute('href', '#')
    editButton.setAttribute('class', 'edit-button')
    editButton.append(document.createTextNode('✏️'))

    editButton.addEventListener('click', this.drawEdit)

    const deleteButton = document.createElement('a')
    deleteButton.setAttribute('href', '#')
    deleteButton.setAttribute('class', 'delete-button')
    deleteButton.append(document.createTextNode('❌'))

    deleteButton.addEventListener('click', this.deleteBlock)

    overlay.append(editButton)
    overlay.append(deleteButton)

    blockElement.append(overlay)
    return blockElement
  }

  drawEdit (event) {
    event.stopPropagation()

    const blockElement = event.target.parentElement.parentElement

    const input = makeInputElement(this.data)

    blockElement.replaceChild(input, blockElement.firstChild)

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

  saveEdit (event) {
    event.stopPropagation()
    // get input
    const blockElement = event.target.parentElement.parentElement
    const input = blockElement.getElementsByTagName('input')[0]
    this.data = input.value
    this.func = navigate.bind(this, this.data)
    while (blockElement.firstChild) {
      blockElement.removeChild(blockElement.firstChild)
    }
    saveBlocks()
    drawBlocks()
  };

  deleteBlock (event) {
    event.stopPropagation()
    blocksToDraw.splice(blocksToDraw.indexOf(this), 1)
    saveBlocks()
    drawBlocks()
  }
}

class AddBlock extends Block {
  constructor () {
    super()
    this.data = 'Add Block +'
    this.func = function () {
      const input = document.getElementsByClassName('add-block-input')[0]
      const link = input.value
      if (!link) {
        return
      }
      makeAndSaveNewBlock(link)
      drawBlocks()

      input.value = ''
    }
  }

  draw () {
    /* this one is a little different */
    const blockElement = document.createElement('div')
    blockElement.setAttribute('class', 'block add-block')

    // prepend text input field
    const input = makeInputElement('')

    blockElement.append(input)
    blockElement.append(document.createElement('br'))

    const addButton = document.createElement('a')
    addButton.setAttribute('class', 'add-block-button')
    addButton.append(document.createTextNode(this.data))
    addButton.addEventListener('click', this.func)

    blockElement.append(addButton)

    return blockElement
  }
}

function makeAndSaveNewBlock (link, position = -1) {
  // make the block object out of a link
  blocksToDraw.push(new Block(link))
  saveBlocks()
}

function drawBlocks () {
  const shelf = document.getElementById('shelf')
  while (shelf.firstChild) {
    shelf.removeChild(shelf.firstChild)
  }
  shelf.append(new AddBlock().draw())
  for (const block of blocksToDraw) {
    // draw the block
    shelf.append(block.draw())
  }
}

function saveBlocks() {
    let data = [];
    for (let block of blocksToDraw) {
        data.push(block.data);
    }
    localStorage.setItem("blocks", JSON.stringify(data));
}

function loadBlocks() {
    let data = JSON.parse(localStorage.getItem("blocks"));
    if (data) {
        for (let link of data) {
            blocksToDraw.push(new Block(link));
        }
        drawBlocks();
    } else {
        makeAndSaveNewBlock("https://ipfs-search.com/");
    }
}

const blocksToDraw = []

function initializeRoot () {
  const rootDiv = document.getElementById('root')
  rootDiv.textContent = 'My Collection'

  const shelf = document.createElement('div')
  shelf.setAttribute('id', 'shelf')
  rootDiv.append(shelf)
}

window.onload = function run () {
  initializeRoot()
  loadBlocks()
  drawBlocks()
}
