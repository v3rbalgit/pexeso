const pexeso: HTMLElement | null = document.getElementById('pexeso');

const grid: number = 4;

const tiles: Array<Tile> = [];

// interface ImageEventTarget {
//   target: HTMLDivElement;
// }

// Gridtile class
class Tile {
  // div containing the image element
  element: HTMLDivElement;
  // image element
  image: HTMLDivElement;
  // image
  imageUrl = '';

  constructor(tile: number) {
    this.element = document.createElement('div');
    this.element.className = 'tile';
    this.element.id = `tile${tile}`;
    this.image = this.generateImage();
    this.element.appendChild(this.image);
    this.addListener(this.element);
    if (pexeso) pexeso.appendChild(this.element);
  }

  // array of all images in the grid
  static imagesUsed: Array<string> = [];

  // store previously click image
  static challenge: Array<[HTMLDivElement, string, string]> = [];

  // store parent ids of images element
  static uncovered: Array<string> = [];

  /* Generate an image for the tile */
  generateImage(): HTMLDivElement {
    let image: HTMLDivElement = document.createElement('div');
    image.className = 'image';
    let random: string = randomImage();
    this.imageUrl = random;
    if (random) image.style.backgroundImage = `url(${random})`;
    return image;
  }

  /* Generate event listener */
  addListener(element: HTMLDivElement): void {
    element.addEventListener('click', listener);
    const self = this;

    function listener(e: Event): void {
      (<HTMLDivElement>e.target).style.opacity = '1';
      let parent = (<HTMLDivElement>e.target).parentElement;

      if (parent) {
        if (Tile.challenge.length === 0) {
          Tile.challenge.push([(<HTMLDivElement>e.target), parent.id, self.imageUrl]);
          Tile.uncovered.push(parent.id);
        } else {
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
            } else {
              setTimeout(() => {
                (<HTMLDivElement>e.target).style.opacity = '0';
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
}

// Recursive helper function
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

// Generate gridtiles
for (let i = 1; i <= grid ** 2; i++) {
  let tile: Tile = new Tile(i);
  tiles[i - 1] = tile;
}
