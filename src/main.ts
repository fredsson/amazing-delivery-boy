import { Application } from 'pixi.js';
import { Player } from './model/player';
import { PlayerView } from './view/player-view';
import { EventPublisher } from './util/event-publisher';

async function main() {
  const container = document.querySelector('#app');
  if (!container) {
    console.error('Could not find container for the game!');
    return;
  }
  const app = new Application({ backgroundColor: '#1099bb', width: 1366, height: 768});
  container.appendChild(app.view as any);

  const eventPublisher = new EventPublisher();

  const player = new Player(eventPublisher);

  const playerView = new PlayerView(app, eventPublisher);
  const mapView = new MapView(app, eventPublisher);


  const ticker = app.ticker.add((dt: number) => {
    player.update(dt);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  main();
});

