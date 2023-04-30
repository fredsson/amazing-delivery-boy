import { Application } from 'pixi.js';
import { Player } from './model/player';
import { PlayerView } from './view/player-view';
import { EventPublisher } from './util/event-publisher';
import { MapView } from './view/map-view';

async function main() {
  const container = document.querySelector('#app');
  if (!container) {
    console.error('Could not find container for the game!');
    return;
  }
  const app = new Application({ backgroundColor: '#1099bb', width: 1366, height: 768});
  container.appendChild(app.view as any);

  const eventPublisher = new EventPublisher();

  const mapView = new MapView(app, eventPublisher);
  mapView.init().then(() => {
    const playerView = new PlayerView(app, eventPublisher);
    playerView.init().then(() => {
      const player = new Player(eventPublisher);
      const ticker = app.ticker.add((dt: number) => {
        player.update(dt);
      });
    });
  });


}

document.addEventListener('DOMContentLoaded', () => {
  main();
});

