'use strict'

const IMG_KEY = 'currImg'

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'tramp', 'famous'] },
    { id: 2, url: 'img/2.jpg', keywords: ['sweet', 'dog', 'kiss'] },
    { id: 3, url: 'img/3.jpg', keywords: ['sweet', 'dog', 'kids'] },
    { id: 4, url: 'img/4.jpg', keywords: ['sweet', 'cat'] },
    { id: 5, url: 'img/5.jpg', keywords: ['funny', 'kids'] },
    { id: 6, url: 'img/6.jpg', keywords: ['funny'] },
    { id: 7, url: 'img/7.jpg', keywords: ['funny', 'kids'] },
    { id: 8, url: 'img/8.jpg', keywords: ['hat'] },
    { id: 9, url: 'img/9.jpg', keywords: ['funny', 'kids'] },
    { id: 10, url: 'img/10.jpg', keywords: ['funny', 'obama', 'famous'] },
    { id: 11, url: 'img/11.jpg', keywords: ['funny', 'kiss'] },
    { id: 12, url: 'img/12.jpg', keywords: ['famous', 'tv-show'] },
    { id: 13, url: 'img/13.jpg', keywords: ['famous'] },
    { id: 14, url: 'img/14.jpg', keywords: ['famous'] },
    { id: 15, url: 'img/15.jpg', keywords: ['famous'] },
    { id: 16, url: 'img/16.jpg', keywords: ['funny', 'famous', 'patrick'] },
    { id: 17, url: 'img/17.jpg', keywords: ['putin', 'famous'] },
    { id: 18, url: 'img/18.jpg', keywords: ['tv-show'] },
    { id: 19, url: 'img/19.jpg', keywords: ['tv-show', 'scream'] },
    { id: 20, url: 'img/20.jpg', keywords: ['tv-show', 'patrick'] },
    { id: 21, url: 'img/21.jpg', keywords: ['kids', 'dance'] },
    { id: 22, url: 'img/22.jpg', keywords: ['tramp', 'famous'] },
    { id: 23, url: 'img/23.jpg', keywords: ['dog'] },
    { id: 24, url: 'img/24.jpg', keywords: ['oprah', 'famous'] }
]

const gSearchWords = [
    { name: 'Funny', clicks: 0.5, color: 'black' },
    { name: 'Tramp', clicks: 0.7, color: 'red' },
    { name: 'Famous', clicks: 0.6, color: 'green' },
    { name: 'Dog', clicks: 1.2, color: 'blue' },
    { name: 'Kiss', clicks: 0.6, color: 'aqua' },
    { name: 'Cat', clicks: 0.4, color: 'bisque' },
    { name: 'Kids', clicks: 4, color: 'brown' },
    { name: 'Hat', clicks: 0.2, color: 'coral' },
    { name: 'Obama', clicks: 0.7, color: 'cyan' },
    { name: 'Tv_show', clicks: 0.6, color: 'crimson' },
    { name: 'Putin', clicks: 0.4, color: 'gold' },
    { name: 'Sweet', clicks: 0.3, color: 'grey' }
]

function findImgById(imgId) {
    const currImg = gImgs.find(img => img.id === imgId)
    return currImg
}

function getImgs(clickedWord) {
    var imgs = searchByDataList(clickedWord)
    if (imgs) return imgs
    else return gImgs
}

function searchByDataList(clickedWord) {
    var searchValue
    if (clickedWord) searchValue = clickedWord
    else searchValue = document.querySelector('.search').value.toLowerCase()
    var filterdImgs = gImgs.filter(img => {
        return img.keywords.some(word => word.toLowerCase().includes(`${searchValue}`))
    })
    return filterdImgs
}

function sortDataListWords() {
    const newWords = gSearchWords
    return newWords.sort((a, b) => b.clicks - a.clicks).slice(0, 5)
}

function onWordClick(val) {
    renderGallery(val.toLowerCase())
    gSearchWords.forEach(word => {
        if (word.name === val) word.clicks += 0.5
    })
    renderClickWords()
}

function onImgInput(ev) {
    loadImageFromInput(ev)
}

function loadImageFromInput(ev) {
    const reader = new FileReader()

    reader.onload = ev => {
        let img = new Image()
        img.src = ev.target.result
        gImgs.unshift(
            {
                id: gImgs.length + 1,
                url: img.src,
                keywords: ['user-img']
            },)
        img.onload = () => renderGallery()
    }
    reader.readAsDataURL(ev.target.files[0])
}

