import { Application } from 'pixi.js';
import { MoveEvent, Player } from './model/player';
import { PlayerView } from './view/player-view';
import { EventPublisher } from './util/event-publisher';
import { MapView } from './view/map-view';
import { CenteredCamera } from './util/camera';
import * as bikeRoute1 from '../assets/maps/bike-route1.json';

async function main() {
  const container = document.querySelector('#app');
  if (!container) {
    console.error('Could not find container for the game!');
    return;
  }
  const app = new Application({ backgroundColor: '#1099bb', width: 1366, height: 768});
  container.appendChild(app.view as any);

  const eventPublisher = new EventPublisher();
  const camera = new CenteredCamera(app, eventPublisher);
  camera.target(bikeRoute1.startPosition);
  eventPublisher.on<MoveEvent>('PlayerMoved', event => {
    camera.target({x: event.x, y: event.y});
  });

  const mapView = new MapView(app, eventPublisher);
  mapView.init(camera).then(() => {
    const playerView = new PlayerView(app, eventPublisher);
    playerView.init(camera).then(() => {
      const papers: any[] = [];
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

