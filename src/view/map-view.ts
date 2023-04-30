import { Application, Assets, Sprite, Texture } from "pixi.js";
import { EventPublisher } from "../util/event-publisher";
import { MoveEvent } from "../model/player";

import * as bikeRoute1 from '../../assets/maps/bike-route1.json';

class TileView {
  private sprites: Sprite[] = [];

  constructor(
    eventPublisher: EventPublisher,
    app: Application,
    private position: {x: number, y: number},
    textures: {plot: Texture, house?: Texture}
  ) {
    this.sprites = [
      new Sprite(textures.plot),
    ];

    if (textures.house) {
      this.sprites.push(new Sprite(textures.house));
    }

    this.sprites.forEach(s => {
      s.x = position.x;
      s.y = position.y;

      app.stage.addChild(s);
    });

    eventPublisher.on<MoveEvent>('PlayerMoved', event => {
      this.sprites.forEach(s => {
        s.x = this.position.x - event.x;
        s.y = this.position.y - event.y;
      });
    });
  }
}


export class MapView {
  private tiles: TileView[] = [];
  constructor(private app: Application, private eventPublisher: EventPublisher) {
  }

  public async init(): Promise<void> {
    return Promise.all([
      Assets.load('assets/gfx/plots.json'),
      Assets.load('assets/gfx/house_1.png')
    ]).then(([plotSheet, houseTexture]) => {
      for (let i = 0; i < bikeRoute1.width; i++) {
        for (let j = 0; j < bikeRoute1.width; j++) {
          const tileType = bikeRoute1.tiles[(i*bikeRoute1.width) + j];
          const tileStartPosition = {
            x: (j * 512) + (this.app.screen.width / 2),
            y: (i * 512) + (this.app.screen.height / 2)
          };
          if (tileType === 1) {
            this.tiles.push(new TileView(this.eventPublisher, this.app, tileStartPosition, {
              plot: plotSheet.textures['plots1.png']
            }));
          } else if (tileType === 2) {
            this.tiles.push(new TileView(this.eventPublisher, this.app, tileStartPosition, {
              plot: plotSheet.textures['plots0.png'],
              house: houseTexture
            }));
          }
        }
      }
    });
  }
}
