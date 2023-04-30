import { AnimatedSprite, Application, Assets, Texture } from "pixi.js";
import { EventPublisher } from "../util/event-publisher";
import { MoveEvent } from "../model/player";
import { Direction } from "../util/commons";

type PlayerAnimation = 'bike_left' | 'bike_right' | 'bike_up' | 'bike_down';

const animationNameByMoveDirection: Record<Direction, PlayerAnimation | undefined>  = {
  'Left': 'bike_left',
  'Right': 'bike_right',
  'Up': 'bike_up',
  'Down': 'bike_down',
  'None': undefined
};

export class PlayerView {
  private animations?: Record<PlayerAnimation, Texture[]>;
  private currentAnimation: PlayerAnimation | undefined;
  private sprite?: AnimatedSprite;

  constructor(private app: Application, private eventPublisher: EventPublisher) {
  }

  public async init(): Promise<void> {
    const center = {
      x: this.app.screen.width / 2,
      y: this.app.screen.height / 2
    };
    return Assets.load('assets/gfx/bike_boy.json').then(sheet => {
      if (sheet.data) {
        this.animations = Object.keys(sheet.data.animations).reduce((total, animKey) => {
          const frames = sheet.data.animations[animKey].map((f: string) => Texture.from(f));
          total[animKey as PlayerAnimation] = frames;
          return total;
        }, {} as Record<PlayerAnimation, Texture[]>);

        this.sprite = new AnimatedSprite(this.animations['bike_left']);
        this.sprite.x = center.x;
        this.sprite.y = center.y;
        this.app.stage.addChild(this.sprite);
        this.sprite.animationSpeed = 0.2;

        this.eventPublisher.on<MoveEvent>('PlayerMoved', event => {
          if (!this.sprite) {
            return;
          }

          this.changeAnimation(this.sprite, event.direction);
        });

      }
    });
  }

  public destroy() {
    if (this.sprite) {
      this.app.stage.removeChild(this.sprite);
    }
  }

  private changeAnimation(sprite: AnimatedSprite, direction: Direction) {
    const animationToChangeTo = animationNameByMoveDirection[direction];
    if (animationToChangeTo === this.currentAnimation) {
      return;
    }

    this.currentAnimation = animationToChangeTo;
    if (animationToChangeTo && this.animations) {
      sprite.textures = this.animations[animationToChangeTo];
      sprite.play();
    } else if (!animationToChangeTo) {
      sprite.stop();
    }
  }
}
