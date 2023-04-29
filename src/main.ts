import { Application, Graphics } from 'pixi.js';

function main() {
  const container = document.querySelector('#app');
  if (!container) {
    console.error('Could not find container for the game!');
    return;
  }
  const app = new Application();
  document.body.appendChild(app.view as any);

  const graphics = new Graphics();
  graphics.beginFill(0xFF0000);
  graphics.drawRect(0, 0, 300, 200);
  app.stage.addChild(graphics);
}

document.addEventListener('DOMContentLoaded', () => {
  main();
});

