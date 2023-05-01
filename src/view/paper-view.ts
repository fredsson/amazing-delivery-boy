import { Application, Graphics } from "pixi.js";
import { EventPublisher } from "../util/event-publisher";
import { MoveEvent } from "../model/player";
import { Camera } from "../util/camera";

export class PaperView {
  private box?: Graphics;

  constructor(private app: Application, private eventPublisher: EventPublisher, private startPosition: {x: number, y: number}) {
  }

  public async init(camera: Camera): Promise<void> {
    this.box = new Graphics();
    this.box.beginFill(0xFFFF00);

    // draw a rectangle
    this.box.drawRect(0, 0, 50, 50);

    const screenSpace = camera.toScreenSpace(this.startPosition);
    this.box.x = screenSpace.x;
    this.box.y = screenSpace.y;

    this.eventPublisher.on('CameraTargetChanged', () => {
      if (!this.box) {
        return;
      }
      const screenSpace = camera.toScreenSpace(this.startPosition);
      this.box.x = screenSpace.x;
      this.box.y = screenSpace.y;
    });

    this.app.stage.addChild(this.box);
  }
}
