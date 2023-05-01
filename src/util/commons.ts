
export type Direction = 'None' | 'Left' | 'Right' | 'Up' | 'Down';

export interface Vec2 {
  x: number;
  y: number;
}
export namespace Vec2 {
  export function sub(v1: Vec2, v2: Vec2): Vec2 {
    return {
      x: v1.x - v2.x,
      y: v1.y - v2.y
    }
  }
}
