const pexeso: HTMLElement | null = document.getElementById('pexeso');

const grid: number = 4;

const tiles: Array<Tile> = [];

// interface ImageEventTarget {
//   target: HTMLDivElement;
// }

// Gridtile class
class Tile {
  // div with id containing the image element
  element: HTMLDivElement;
  // image element
  image: HTMLDivElement;
  // image url
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

  private static imageBase: Array<string> = [];

  // array of all images used in the grid
  private static imagesUsed: Array<string> = [];

  // store previously clicked image element, parent id, and image url
  private static challenge: Array<[HTMLDivElement, string, string]> = [];

  // store parent ids of image elements
  private static uncovered: Array<string> = [];

  // !!! initialize the imagebase before making the grid
  static async init(keyword?: string): Promise<void> {
    let url = 'https://api.unsplash.com/photos/random?query=supercar';
    if (keyword) url = `https://api.unsplash.com/photos/random?query=${keyword}`;

    for (let i = 0; i < 8; i++) {
      let image = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Accept-Version': 'v1',
          Authorization: 'Client-ID f3cc7453479d252ec931a8004639aae4449b677cc54af88c7553aab80d2e604f'
        }
      }).then(response => response.json());
      Tile.imageBase.push(image.urls.small);
    }
  }

  /* Generate an image for tile */
  private generateImage(): HTMLDivElement {
    let image: HTMLDivElement = document.createElement('div');
    image.className = 'image';
    let random: string = this.randomImage();
    this.imageUrl = random;
    if (random) image.style.backgroundImage = `url(${random})`;
    return image;
  }

  /* Game logic */
  private addListener(element: HTMLDivElement): void {
    element.addEventListener('click', listener);
    const self = this;

    // event callback function
    function listener(e: Event): void {
      (<HTMLDivElement>e.target).style.opacity = '1';
      let parent = (<HTMLDivElement>e.target).parentElement;

      // parent null check
      if (parent) {
        if (Tile.challenge.length === 0) {
          Tile.challenge.push([<HTMLDivElement>e.target, parent.id, self.imageUrl]);
          Tile.uncovered.push(parent.id);
        } else {
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

  // Recursive helper function
  private randomImage(): string {
    let random = Math.floor(Math.random() * 8);
    let imagePath = Tile.imageBase[random];
    let filteredArray = Tile.imagesUsed.filter(el => el === imagePath);

    if (filteredArray.length < 2) {
      Tile.imagesUsed.push(imagePath);
      return imagePath;
    } else {
      return this.randomImage();
    }
  }
}

Tile.init().then(() => {
  // Generate gridtiles
  for (let i = 1; i <= grid ** 2; i++) {
    let tile: Tile = new Tile(i);
    tiles[i - 1] = tile;
  }
  console.log(tiles);
}).catch(err => console.error(err));
