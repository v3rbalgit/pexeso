/* Grid Tile Class */
class Tile {
  // div with id containing the image element
  element: HTMLDivElement;
  // image element
  image: HTMLDivElement;
  // image url
  imageUrl = '';

  constructor(tile: number, wrapper: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'tile';
    this.element.id = `tile${tile}`;
    this.image = this.generateImage();
    this.element.appendChild(this.image);
    this.addListener(this.element);
    if (wrapper) wrapper.appendChild(this.element);
  }

  // Array of all tiles generated
  static tiles: Array<Tile> = [];

  // game timer
  static timer: number;

  // image base
  static imageBase: Array<string> = [];

  // array of all images used in making the grid
  static imagesUsed: Array<string> = [];

  // store previously clicked image element, parent id, and image url
  static challenge: Array<[HTMLDivElement, string, string]> = [];

  // store parent ids of matched image elements
  static uncovered: Array<string> = [];

  // full the imagebase before making the grid
  static async loadImages(grid: number, keyword?: string): Promise<void> {
    let url = 'https://api.unsplash.com/photos/random';
    if (keyword) url = `https://api.unsplash.com/photos/random?query=${keyword}`;

    for (let i = 0; i < (grid ** 2) / 2; i++) {
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

  // Initialize game
  static init(): void {
    const pexeso = <HTMLDivElement>document.getElementById('pexeso');
    const cover = <HTMLDivElement>document.querySelector('.cover');
    const intro = <HTMLDivElement>document.getElementById('intro');
    const difficulty = <HTMLSelectElement>document.getElementById('difficulty');
    const topic = <HTMLInputElement>document.getElementById('topic');
    const start = <HTMLInputElement>document.getElementById('start');
    const loader = <HTMLDivElement>document.querySelector('.loader');

    intro.style.display = 'block';

    start.addEventListener('click', e => {
      e.preventDefault();
      let gridsize: number = +difficulty.value;
      let searchTerm: string = topic.value;
      loader.style.display = 'block';

      // Initialize gridtiles
      Tile.loadImages(gridsize, searchTerm)
        .then(() => {
          // Generate gridtiles
          for (let i = 1; i <= gridsize ** 2; i++) {
            let tile: Tile = new Tile(i, pexeso);
            tile.element.style.flexBasis = `${Math.floor(100 / gridsize)}%`;
            Tile.tiles[i - 1] = tile;
          }
          cover.style.zIndex = '-1';
          cover.style.opacity = '0';
          loader.style.display = 'none';
          Tile.timer = Date.now();
        })
        .catch(err => console.error(err));

      intro.style.display = 'none';
    });
  }

  // replay game
  static replay(): void {
    let timer: number = Date.now() - Tile.timer;
    const outro = <HTMLDivElement>document.getElementById('outro');
    const cover = <HTMLDivElement>document.querySelector('.cover');
    const time = <HTMLSpanElement>document.getElementById('time');
    const playAgain = <HTMLInputElement>document.getElementById('playAgain');

    outro.style.display = 'block';
    cover.style.zIndex = '1';
    cover.style.opacity = '0.4';

    let timeArray: number[] = (function(elapsed: number): number[] {
      let ms = elapsed % 1000;
      let sec = Math.floor(elapsed / 1000) % 60;
      let min = Math.floor(elapsed / 60000);

      return [min, sec, ms];
    })(timer);

    time.textContent = `${timeArray[0]}:${timeArray[1]}.${timeArray[2]}`;

    playAgain.addEventListener('click', e => {
      e.preventDefault();
      outro.style.display = 'none';
      location.reload();
    });
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

  /* Recursive helper function */
  private randomImage(): string {
    let random = Math.floor(Math.random() * Tile.imageBase.length);
    let imagePath = Tile.imageBase[random];
    let filteredArray = Tile.imagesUsed.filter(el => el === imagePath);

    if (filteredArray.length < 2) {
      Tile.imagesUsed.push(imagePath);
      return imagePath;
    } else {
      return this.randomImage();
    }
  }

  /* Game logic */
  private addListener(element: HTMLDivElement): void {
    element.addEventListener('click', listener);
    // capture this
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
            // check image URL for a match to the previously click tile
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
              if (Tile.uncovered.length === Tile.imagesUsed.length) Tile.replay();
            } else {
              // hide both uncovered images and reset if previously clicked tile doesn't match current tile
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

window.onload = Tile.init;
