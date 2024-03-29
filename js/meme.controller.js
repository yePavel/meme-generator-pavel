'use strict'

var gStartPos
const TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend']

function renderMeme() {
    const img = new Image()
    img.src = gMeme.url
    img.onload = () => {
        gCanvas.height = (img.naturalHeight / img.naturalWidth) * gCanvas.width
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        gMeme.lines.forEach((line, currIdx) => {
            drawText(line, line.currPosX, line.currPosY, currIdx)
        });
        drewImoji()
    }
    renderEditorMenu()
}

function drawText(line, posX, posY, currIdx) {
    gCtx.lineWidth = 0.5
    gCtx.fillStyle = line.color
    gCtx.font = `${line.size}px ${line.font}`
    gCtx.textBaseline = 'top'
    gCtx.strokeStyle = line.outlineColor
    gCtx.fillText(line.txt, posX, posY)
    gCtx.strokeText(line.txt, posX, posY)
    addLineBorder(currIdx)
}

function addLineBorder(currIdx) {
    if (gMeme.isDownload) return
    const { lines } = gMeme
    const { selectedLineIdx: idx } = gMeme
    if (!lines[idx]) return
    if (currIdx === idx) {
        var textWidth = gCtx.measureText(lines[idx].txt).width + 3;
        var lineHeight = lines[idx].size * 1.2;

        lines[idx].txtWidth = textWidth
        lines[idx].txtHeight = lineHeight
        gCtx.strokeRect(lines[idx].currPosX, lines[idx].currPosY, textWidth, lineHeight);
    }
}

function onImojiSelect(type) {
    addImoji(`imojis/${type}.png`)
    drewImoji()
}

function drewImoji() {
    const { imojis } = gMeme
    const img = new Image()
    imojis.forEach(imoji => {
        img.src = imoji.url
        gCtx.drawImage(img, imoji.currPosX, imoji.currPosY, imoji.size, imoji.size)
    });
}

function onAddLine() {
    addLine()
}

function onSwitchLine(type, idx) {
    switchLine(type, idx)
    renderMeme()
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    const elBody = document.querySelector('body')
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mouseup', onUp)
    elBody.addEventListener('keydown', onMoveText)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    gStartPos = getEvPos(ev)
    if (!isTxtFrameClicked(gStartPos) && !isImojiClicked(gStartPos)) return
    if (gMeme.dragObject === 'txt') {
        setTxtFrameDrag(true)
    }
    else if (gMeme.dragObject === 'imoji' && gMeme.imojis.length > 0) {
        setImojiDrag(true)
    }
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    const { lines } = gMeme
    const { selectedLineIdx: idx } = gMeme
    const { imojis } = gMeme
    const { selectedImojiIdx: imojIdx } = gMeme
    if (gMeme.dragObject === 'txt') {
        if (!lines[idx].isDrag) return
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        moveTxtFrame(dx, dy)
        gStartPos = pos
    }
    else if (gMeme.dragObject === 'imoji' && gMeme.imojis.length > 0) {
        if (!imojis[imojIdx].isDrag) return
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        moveImoji(dx, dy)
        gStartPos = pos
    }
    renderMeme()
}

function onUp() {
    if (gMeme.dragObject === 'txt') {
        gMeme.dragObject = ''
        setTxtFrameDrag(false)
    }

    else if (gMeme.dragObject === 'imoji' && gMeme.imojis.length >= 1) {
        gMeme.dragObject = ''
        setImojiDrag(false)
    }

    document.body.style.cursor = 'default'
}

function getEvPos(ev) {
    if (TOUCH_EVENTS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        return {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    } else {
        return {
            x: ev.offsetX,
            y: ev.offsetY,
        }
    }
}

function renderEditorMenu() {
    const { lines } = gMeme
    const { selectedLineIdx: idx } = gMeme
    if (!lines[idx]) return
    document.querySelector('.txt-change').value = lines[idx].txt
    document.querySelector('.txt-color').value = lines[idx].color
    document.querySelector('.txt-outline').value = lines[idx].outlineColor
}

function onDeleteLine() {
    const { lines } = gMeme
    const { selectedLineIdx: idx } = gMeme
    lines.splice(idx, 1)
    renderMeme()
}

function onMoveText(ev) {
    const { lines } = gMeme
    const { selectedLineIdx: idx } = gMeme

    switch (ev.code) {
        case 'ArrowDown':
            lines[idx].currPosY += 5
            renderMeme()
            break;
        case 'ArrowUp':
            lines[idx].currPosY -= 5
            renderMeme()
            break;
        case 'ArrowLeft':
            lines[idx].currPosX -= 5
            renderMeme()
            break;
        case 'ArrowRight':
            lines[idx].currPosX += 5
            renderMeme()
            break;
    }
}

function onFontChange() {
    fontChange()
}


function onTextAlignment(dir) {
    const { lines } = gMeme
    const { selectedLineIdx: idx } = gMeme
    lines[idx].textAlign = dir
    alignText()
    renderMeme()
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')

    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => el.classList.remove('open'), 3000)
}

