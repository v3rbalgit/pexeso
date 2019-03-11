"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/* Grid Tile Class */
var Tile = /** @class */ (function () {
    function Tile(tile, wrapper) {
        // image url
        this.imageUrl = '';
        this.element = document.createElement('div');
        this.element.className = 'tile';
        this.element.id = "tile" + tile;
        this.image = this.generateImage();
        this.element.appendChild(this.image);
        this.addListener(this.element);
        if (wrapper)
            wrapper.appendChild(this.element);
    }
    // full the imagebase before making the grid
    Tile.loadImages = function (grid, keyword) {
        return __awaiter(this, void 0, void 0, function () {
            var url, i, image;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = 'https://api.unsplash.com/photos/random';
                        if (keyword)
                            url = "https://api.unsplash.com/photos/random?query=" + keyword;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < (Math.pow(grid, 2)) / 2)) return [3 /*break*/, 4];
                        return [4 /*yield*/, fetch(url, {
                                method: 'GET',
                                mode: 'cors',
                                cache: 'no-cache',
                                credentials: 'same-origin',
                                headers: {
                                    'Accept-Version': 'v1',
                                    Authorization: 'Client-ID f3cc7453479d252ec931a8004639aae4449b677cc54af88c7553aab80d2e604f'
                                }
                            }).then(function (response) { return response.json(); })];
                    case 2:
                        image = _a.sent();
                        Tile.imageBase.push(image.urls.small);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Initialize game
    Tile.init = function () {
        var pexeso = document.getElementById('pexeso');
        var cover = document.querySelector('.cover');
        var intro = document.getElementById('intro');
        var difficulty = document.getElementById('difficulty');
        var topic = document.getElementById('topic');
        var start = document.getElementById('start');
        var loader = document.querySelector('.loader');
        intro.style.display = 'block';
        start.addEventListener('click', function (e) {
            e.preventDefault();
            var gridsize = +difficulty.value;
            var searchTerm = topic.value;
            loader.style.display = 'block';
            // Initialize gridtiles
            Tile.loadImages(gridsize, searchTerm)
                .then(function () {
                // Generate gridtiles
                for (var i = 1; i <= Math.pow(gridsize, 2); i++) {
                    var tile = new Tile(i, pexeso);
                    tile.element.style.flexBasis = Math.floor(100 / gridsize) + "%";
                    Tile.tiles[i - 1] = tile;
                }
                cover.style.zIndex = '-1';
                cover.style.opacity = '0';
                loader.style.display = 'none';
                Tile.timer = Date.now();
            })
                .catch(function (err) { return console.error(err); });
            intro.style.display = 'none';
        });
    };
    // replay game
    Tile.replay = function () {
        var timer = Date.now() - Tile.timer;
        var outro = document.getElementById('outro');
        var cover = document.querySelector('.cover');
        var time = document.getElementById('time');
        var playAgain = document.getElementById('playAgain');
        outro.style.display = 'block';
        cover.style.zIndex = '1';
        cover.style.opacity = '0.4';
        var timeArray = (function (elapsed) {
            var ms = elapsed % 1000;
            var sec = Math.floor(elapsed / 1000) % 60;
            var min = Math.floor(elapsed / 60000);
            return [min, sec, ms];
        })(timer);
        time.textContent = timeArray[0] + ":" + timeArray[1] + "." + timeArray[2];
        playAgain.addEventListener('click', function (e) {
            e.preventDefault();
            outro.style.display = 'none';
            location.reload();
        });
    };
    /* Generate an image for tile */
    Tile.prototype.generateImage = function () {
        var image = document.createElement('div');
        image.className = 'image';
        var random = this.randomImage();
        this.imageUrl = random;
        if (random)
            image.style.backgroundImage = "url(" + random + ")";
        return image;
    };
    /* Recursive helper function */
    Tile.prototype.randomImage = function () {
        var random = Math.floor(Math.random() * Tile.imageBase.length);
        var imagePath = Tile.imageBase[random];
        var filteredArray = Tile.imagesUsed.filter(function (el) { return el === imagePath; });
        if (filteredArray.length < 2) {
            Tile.imagesUsed.push(imagePath);
            return imagePath;
        }
        else {
            return this.randomImage();
        }
    };
    /* Game logic */
    Tile.prototype.addListener = function (element) {
        element.addEventListener('click', listener);
        // capture this
        var self = this;
        // event callback function
        function listener(e) {
            e.target.style.opacity = '1';
            var parent = e.target.parentElement;
            // parent null check
            if (parent) {
                if (Tile.challenge.length === 0) {
                    Tile.challenge.push([e.target, parent.id, self.imageUrl]);
                    Tile.uncovered.push(parent.id);
                }
                else {
                    // the previously clicked tile cannot be clicked on again
                    if (Tile.challenge[0][1] !== parent.id) {
                        // check image URL for a match to the previously click tile
                        if (self.imageUrl === Tile.challenge[0][2]) {
                            // make sure matching tiles are not clickable anymore
                            parent.removeEventListener('click', listener);
                            var parent2 = Tile.challenge[0][0].parentElement;
                            if (parent2) {
                                parent2.removeEventListener('click', listener);
                                // increment matched tiles
                                Tile.uncovered.push(parent2.id);
                            }
                            // reset
                            Tile.challenge = [];
                            // game over when all used images are matched
                            if (Tile.uncovered.length === Tile.imagesUsed.length)
                                Tile.replay();
                        }
                        else {
                            // hide both uncovered images and reset if previously clicked tile doesn't match current tile
                            setTimeout(function () {
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
    };
    // Array of all tiles generated
    Tile.tiles = [];
    // image base
    Tile.imageBase = [];
    // array of all images used in making the grid
    Tile.imagesUsed = [];
    // store previously clicked image element, parent id, and image url
    Tile.challenge = [];
    // store parent ids of matched image elements
    Tile.uncovered = [];
    return Tile;
}());
window.onload = Tile.init;
