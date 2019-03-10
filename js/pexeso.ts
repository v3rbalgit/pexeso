const pexeso: HTMLElement | null = document.getElementById('pexeso');

const grid: number = 4;

const tiles: Array<Tile> = [];

class Tile {
  element: HTMLDivElement;
  image: HTMLElement;

  constructor(tile: number) {
    this.element = document.createElement('div');
    this.element.className = 'tile';
    this.element.id = `tile${tile}`;
    this.image = this.generateImage();
    this.element.appendChild(this.image);
    if (pexeso) pexeso.appendChild(this.element);
  }

  static imagesUsed: Array<string> = [];

  protected generateImage(): HTMLElement {
    let image: HTMLImageElement = document.createElement('img');
    let random = randomImage();
    if (random) image.setAttribute('src', random);
    return image;
  }
}

function randomImage(): string {
  let random = Math.floor(Math.random() * 8) + 1;
  let imagePath = `img/cars${random}.jpg`;
  let filteredArray = Tile.imagesUsed.filter(el => el === imagePath);
  if (filteredArray.length < 2) {
    Tile.imagesUsed.push(imagePath);
    return imagePath;
  } else {
    return randomImage();
  }
}

for (let i = 1; i <= grid**2; i++) {
  let element: Tile = new Tile(i);
  tiles[i] = element;
}
