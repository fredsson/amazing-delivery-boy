import { EventPublisher } from "../util/event-publisher";

export type MoveDirection = 'None' | 'Left' | 'Right' | 'Up' | 'Down';

const DirectionByKey: Record<string, MoveDirection> = {
  w: 'Up',
  s: 'Down',
  a: 'Left',
  d: 'Right'
};

const MovementByKey: Record<string, number[]> = {
  w: [0, -1],
  a: [-1, 0],
  s: [0, 1],
  d: [1, 0]
}

export interface MoveEvent {
  x: number;
  y: number;
  direction: MoveDirection;
}

export class Player {
  private abort = new AbortController();
  private position = {
    x: 0,
    y: 0
  };
  private directions: string[] = [];

  constructor(private eventPublisher: EventPublisher) {
    window.addEventListener('keydown', event => {
      this.pushMovementDirection(event.key);
    }, {signal: this.abort.signal});

    window.addEventListener('keyup', event => {
      this.clearMovementDirection(event.key);
    }, {signal: this.abort.signal});
  }

  public update(dt: number): void {
    const {dx, dy, direction} = this.movementFromDirectionStack();

    this.position.x += dx * dt;
    this.position.y += dy * dt;

    this.eventPublisher.emit<MoveEvent>('PlayerMoved', {...this.position, direction})
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

  private movementFromDirectionStack(): {dx: number, dy: number, direction: MoveDirection} {
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
