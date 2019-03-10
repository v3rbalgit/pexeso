"use strict";
const pexeso = document.getElementById('pexeso');
const grid = 4;
const tiles = [];
class Tile {
    constructor(tile) {
        this.element = document.createElement('div');
        this.element.className = 'tile';
        this.element.id = `tile${tile}`;
        this.image = this.generateImage();
        this.element.appendChild(this.image);
        if (pexeso)
            pexeso.appendChild(this.element);
    }
    generateImage() {
        let image = document.createElement('img');
        let random = randomImage();
        if (random)
            image.setAttribute('src', random);
        return image;
    }
}
Tile.imagesUsed = [];
function randomImage() {
    let random = Math.floor(Math.random() * 8) + 1;
    let imagePath = `img/cars${random}.jpg`;
    let filteredArray = Tile.imagesUsed.filter(el => el === imagePath);
    if (filteredArray.length < 2) {
        Tile.imagesUsed.push(imagePath);
        return imagePath;
    }
    else {
        return randomImage();
    }
}
for (let i = 1; i <= Math.pow(grid, 2); i++) {
    let element = new Tile(i);
    tiles[i] = element;
}
