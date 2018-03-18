/**
 * Describe the snake body
 */
interface BodyNode {
  x: number;
  y: number;
}

/**
 * Enumerate the snake move directions
 */
enum MoveDirection {
  UP    = 'UP',
  RIGHT = 'RIGHT',
  DOWN  = 'DOWN',
  LEFT  = 'LEFT'
}

/**
 * Snake initial data
 */
let snakeBodyData: BodyNode[] = [
  {
    x: 312,
    y: 1056
  },
  {
    x: 312,
    y: 1068,
  },
  {
    x: 312,
    y: 1080
  },
  {
    x: 312,
    y: 1092
  },
  {
    x: 312,
    y: 1104
  },
  {
    x: 312,
    y: 1116
  }
]
