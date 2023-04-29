import { AnimatedSprite, Application, Assets, Texture } from "pixi.js";
import { EventPublisher } from "../util/event-publisher";
import { MoveEvent, MoveDirection } from "../model/player";

type PlayerAnimation = 'bike_left' | 'bike_right' | 'bike_up' | 'bike_down';

const animationNameByMoveDirection: Record<MoveDirection, PlayerAnimation | undefined>  = {
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

  constructor(private app: Application, eventPublisher: EventPublisher) {
    Assets.load('assets/bike_boy.json').then(sheet => {
      if (sheet.data) {
        this.animations = Object.keys(sheet.data.animations).reduce((total, animKey) => {
          const frames = sheet.data.animations[animKey].map((f: string) => Texture.from(f));
          total[animKey as PlayerAnimation] = frames;
          return total;
        }, {} as Record<PlayerAnimation, Texture[]>);

        this.sprite = new AnimatedSprite(this.animations['bike_left']);
        app.stage.addChild(this.sprite);
        this.sprite.animationSpeed = 0.2;

        eventPublisher.on<MoveEvent>('PlayerMoved', (event: MoveEvent) => {
          if (!this.sprite) {
            return;
          }

          this.changeAnimation(this.sprite, event.direction);

          this.sprite.x = event.x;
          this.sprite.y = event.y;
        });

      }
    });
  }

  public destroy() {
    if (this.sprite) {
      this.app.stage.removeChild(this.sprite);
    }
  }

  private changeAnimation(sprite: AnimatedSprite, direction: MoveDirection) {
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
