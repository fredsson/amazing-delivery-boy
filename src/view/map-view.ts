import { Application, Assets, Sprite, Texture } from "pixi.js";
import { EventPublisher } from "../util/event-publisher";

import * as bikeRoute1 from '../../assets/maps/bike-route1.json';
import { Camera } from "../util/camera";

class TileView {
  private sprites: Sprite[] = [];

  constructor(
    eventPublisher: EventPublisher,
    app: Application,
    camera: Camera,
    private position: {x: number, y: number},
    textures: {plot: Texture, house?: Texture}
  ) {
    this.sprites = [
      new Sprite(textures.plot),
    ];

    if (textures.house) {
      this.sprites.push(new Sprite(textures.house));
    }

    const screenSpace = camera.toScreenSpace(this.position);
    this.sprites.forEach(s => {
      s.x = screenSpace.x;
      s.y = screenSpace.y;

      app.stage.addChild(s);
    });

    eventPublisher.on<void>('CameraTargetChanged', () => {
      const screenSpace = camera.toScreenSpace(this.position);
      this.sprites.forEach(s => {
        s.x = screenSpace.x;
        s.y = screenSpace.y;
      })

    });
  }
}


export class MapView {
  private tiles: TileView[] = [];
  constructor(private app: Application, private eventPublisher: EventPublisher) {
  }

  public async init(camera: Camera): Promise<void> {
    return Promise.all([
      Assets.load('assets/gfx/plots.json'),
      Assets.load('assets/gfx/house_1.png')
    ]).then(([plotSheet, houseTexture]) => {
      for (let i = 0; i < bikeRoute1.width; i++) {
        for (let j = 0; j < bikeRoute1.width; j++) {
          const tileType = bikeRoute1.tiles[(i*bikeRoute1.width) + j];
          const tileStartPosition = {
            x: (j * 512),
            y: (i * 512)
          };
          if (tileType === 1) {
            this.tiles.push(new TileView(this.eventPublisher, this.app, camera, tileStartPosition, {
              plot: plotSheet.textures['plots1.png']
            }));
          } else if (tileType === 2) {
            this.tiles.push(new TileView(this.eventPublisher, this.app, camera, tileStartPosition, {
              plot: plotSheet.textures['plots0.png'],
              house: houseTexture
            }));
          }
        }
      }
    });
  }
}
