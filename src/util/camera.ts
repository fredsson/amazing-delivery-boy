import { Application } from "pixi.js";
import { Vec2 } from "./commons";
import { EventPublisher } from "./event-publisher";

export interface Camera {
  toScreenSpace(position: Vec2): Vec2;
}

export class CenteredCamera implements Camera {
  private offset: Vec2 = {
    x: 0,
    y: 0
  };
  private screenCenter: Vec2;

  constructor(app: Application, public eventPublisher: EventPublisher) {
    this.screenCenter = {
      x: app.screen.width / 2,
      y: app.screen.height / 2
    }
  }

  public target(position: Vec2): void {
    this.offset = {
      x: position.x - this.screenCenter.x,
      y: position.y - this.screenCenter.y
    };
    this.eventPublisher.emit<Vec2>('CameraTargetChanged', {
      ...this.offset,
    });
  }

  public toScreenSpace(position: Vec2): Vec2 {
    return Vec2.sub(position, this.offset);
  }
}
