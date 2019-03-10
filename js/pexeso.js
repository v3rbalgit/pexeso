"use strict";
const pexeso = document.getElementById('pexeso');
const grid = 4;
const tiles = [];
// interface ImageEventTarget {
//   target: HTMLDivElement;
// }
// Gridtile class
class Tile {
    constructor(tile) {
        // image
        this.imageUrl = '';
        this.element = document.createElement('div');
        this.element.className = 'tile';
        this.element.id = `tile${tile}`;
        this.image = this.generateImage();
        this.element.appendChild(this.image);
        this.addListener(this.element);
        if (pexeso)
            pexeso.appendChild(this.element);
    }
    /* Generate an image for the tile */
    generateImage() {
        let image = document.createElement('div');
        image.className = 'image';
        let random = this.randomImage();
        this.imageUrl = random;
        if (random)
            image.style.backgroundImage = `url(${random})`;
        return image;
    }
    /* Generate event listener */
    addListener(element) {
        element.addEventListener('click', listener);
        const self = this;
        function listener(e) {
            e.target.style.opacity = '1';
            let parent = e.target.parentElement;
            if (parent) {
                if (Tile.challenge.length === 0) {
                    Tile.challenge.push([e.target, parent.id, self.imageUrl]);
                    Tile.uncovered.push(parent.id);
                }
                else {
                    if (Tile.challenge[0][1] !== parent.id) {
                        if (self.imageUrl === Tile.challenge[0][2]) {
                            parent.removeEventListener('click', listener);
                            let parent2 = Tile.challenge[0][0].parentElement;
                            if (parent2) {
                                parent2.removeEventListener('click', listener);
                                Tile.uncovered.push(parent2.id);
                            }
                            Tile.challenge = [];
                            if (Tile.uncovered.length === Tile.imagesUsed.length) {
                                console.log('Game over');
                            }
                        }
                        else {
                            setTimeout(() => {
                                e.target.style.opacity = '0';
                                Tile.challenge[0][0].style.opacity = '0';
                                Tile.challenge = [];
                                Tile.uncovered.pop();
                            }, 1000);
                        }
                    }
                }
            }
        }
    }
    // Recursive helper function
    randomImage() {
        let random = Math.floor(Math.random() * 8) + 1;
        let imagePath = `img/cars${random}.jpg`;
        let filteredArray = Tile.imagesUsed.filter(el => el === imagePath);
        if (filteredArray.length < 2) {
            Tile.imagesUsed.push(imagePath);
            return imagePath;
        }
        else {
            return this.randomImage();
        }
    }
}
// array of all images in the grid
Tile.imagesUsed = [];
// store previously click image
Tile.challenge = [];
// store parent ids of images element
Tile.uncovered = [];
// Generate gridtiles
for (let i = 1; i <= Math.pow(grid, 2); i++) {
    let tile = new Tile(i);
    tiles[i - 1] = tile;
}
