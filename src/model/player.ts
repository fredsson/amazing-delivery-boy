import { EventPublisher } from "../util/event-publisher";
import * as bikeRoute1 from '../../assets/maps/bike-route1.json';
import { Direction, Vec2 } from "../util/commons";

const PLAYER_SPEED = 5;

const PLAYER_MAX_THROW_CHARGE_IN_SEC = 4;
const PLAYER_MAX_THROW_DISTANCE_IN_PIXELS = 400;

const DirectionByKey: Record<string, Direction> = {
  w: 'Up',
  s: 'Down',
  a: 'Left',
  d: 'Right'
};

const ThrowDirectionByDirection: Record<Direction, Direction> = {
  Up: 'Left',
  Down: 'Right',
  Left: 'Down',
  Right: 'Up',
  None: 'None',
}

const MovementByKey: Record<string, number[]> = {
  w: [0, -1],
  a: [-1, 0],
  s: [0, 1],
  d: [1, 0]
}

export interface MoveEvent {
  x: number;
  y: number;
  direction: Direction;
}

export interface PlayerThrowPaperEvent {
  x: number;
  y: number;
  distance: number;
  direction: Direction;
}

export class Player {
  private abort = new AbortController();
  private position: Vec2 = {
    x: bikeRoute1.startPosition.x,
    y: bikeRoute1.startPosition.y
  };
  private directions: string[] = [];
  private currentDirection: Direction = 'Right';
  private throwStartTime: Date | undefined;

  private previousdelta: Vec2 = {
    x: 0,
    y: 0
  };

  constructor(private eventPublisher: EventPublisher) {
    window.addEventListener('keydown', event => {
      this.pushMovementDirection(event.key);
      if (event.key === ' ' && !this.throwStartTime) {
        this.throwStartTime = new Date();
      }

    }, {signal: this.abort.signal});

    window.addEventListener('keyup', event => {
      this.clearMovementDirection(event.key);
      if (event.key === ' ' && this.throwStartTime) {
        const differenceInSec = (new Date().getTime() - this.throwStartTime.getTime()) / 1000;
        this.throwStartTime = undefined;

        const strengh = Math.min(differenceInSec / PLAYER_MAX_THROW_CHARGE_IN_SEC, 1);
        const distance = strengh * PLAYER_MAX_THROW_DISTANCE_IN_PIXELS;

        this.eventPublisher.emit<PlayerThrowPaperEvent>('PlayerThrowPaper', {
          ...this.position,
          distance,
          direction: ThrowDirectionByDirection[this.currentDirection]
        });
      }
    }, {signal: this.abort.signal});

    eventPublisher.emit<MoveEvent>('PlayerMoved', {
      ...this.position,
      direction: this.currentDirection,
    });
  }

  public update(dt: number): void {
    const {dx, dy, direction} = this.movementFromDirectionStack();

    this.position.x += Math.round(PLAYER_SPEED * dx * dt);
    this.position.y += Math.round(PLAYER_SPEED * dy * dt);

    const moving = (dx !== 0 || dy !== 0);
    const stillMoving = (dx !== this.previousdelta.x || dy !== this.previousdelta.y);
    if (moving || stillMoving) {
      this.previousdelta = {
        x: dx,
        y: dy
      };

      if (direction !== 'None') {
        this.currentDirection = direction;
      }

      this.eventPublisher.emit<MoveEvent>('PlayerMoved', {...this.position, direction})
    }
  }

  public destroy() {
    this.abort.abort();
  }

  private pushMovementDirection(key: string) {
    const validDirection = ['w', 'a', 's', 'd'].some(v => v === key);
    const current = this.directions[this.directions.length - 1];
    if (!validDirection || key === current) {
      return;
    }

    this.directions.push(key);
  }

  private clearMovementDirection(key: string) {
    this.directions = this.directions.filter(k => k !== key);
  }

  private movementFromDirectionStack(): {dx: number, dy: number, direction: Direction} {
    if (!this.directions.length) {
      return {
        dx: 0,
        dy: 0,
        direction: 'None',
      }
    }
    const current = this.directions[this.directions.length - 1];

    const [dx, dy] = MovementByKey[current]
    const direction = DirectionByKey[current];

    return {
      dx,
      dy,
      direction
    };
  }
}
