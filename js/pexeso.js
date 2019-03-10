"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const pexeso = document.getElementById('pexeso');
const grid = 4;
const tiles = [];
// interface ImageEventTarget {
//   target: HTMLDivElement;
// }
// Gridtile class
class Tile {
    constructor(tile) {
        // image url
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
    // !!! initialize the imagebase before making the grid
    static init(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = 'https://api.unsplash.com/photos/random?query=supercar';
            if (keyword)
                url = `https://api.unsplash.com/photos/random?query=${keyword}`;
            for (let i = 0; i < 8; i++) {
                let image = yield fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Accept-Version': 'v1',
                        Authorization: 'Client-ID f3cc7453479d252ec931a8004639aae4449b677cc54af88c7553aab80d2e604f'
                    }
                }).then(response => response.json());
                Tile.imageBase.push(image.urls.small);
            }
        });
    }
    /* Generate an image for tile */
    generateImage() {
        let image = document.createElement('div');
        image.className = 'image';
        let random = this.randomImage();
        this.imageUrl = random;
        if (random)
            image.style.backgroundImage = `url(${random})`;
        return image;
    }
    /* Game logic */
    addListener(element) {
        element.addEventListener('click', listener);
        const self = this;
        // event callback function
        function listener(e) {
            e.target.style.opacity = '1';
            let parent = e.target.parentElement;
            // parent null check
            if (parent) {
                if (Tile.challenge.length === 0) {
                    Tile.challenge.push([e.target, parent.id, self.imageUrl]);
                    Tile.uncovered.push(parent.id);
                }
                else {
                    // the previously clicked tile cannot be clicked on again
                    if (Tile.challenge[0][1] !== parent.id) {
                        // check for match to the previously click tile
                        if (self.imageUrl === Tile.challenge[0][2]) {
                            // make sure matching tiles are not clickable anymore
                            parent.removeEventListener('click', listener);
                            let parent2 = Tile.challenge[0][0].parentElement;
                            if (parent2) {
                                parent2.removeEventListener('click', listener);
                                // increment matched tiles
                                Tile.uncovered.push(parent2.id);
                            }
                            // reset
                            Tile.challenge = [];
                            // game over when all used images are matched
                            if (Tile.uncovered.length === Tile.imagesUsed.length) {
                                console.log('Game over');
                            }
                            // hide both uncovered images and reset if previously clicked tile doesn't match current tile
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
        let random = Math.floor(Math.random() * 8);
        let imagePath = Tile.imageBase[random];
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
Tile.imageBase = [];
// array of all images used in the grid
Tile.imagesUsed = [];
// store previously clicked image element, parent id, and image url
Tile.challenge = [];
// store parent ids of image elements
Tile.uncovered = [];
Tile.init().then(() => {
    // Generate gridtiles
    for (let i = 1; i <= Math.pow(grid, 2); i++) {
        let tile = new Tile(i);
        tiles[i - 1] = tile;
    }
    console.log(tiles);
}).catch(err => console.error(err));
