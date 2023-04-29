
export class EventPublisher {
  listeners: Record<string, ((event: any) => void)[]> = {
  };

  public on<T>(eventName: string, callback: (event: T) => void) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  public emit<T>(eventName: string, event: T) {
    if (!this.listeners[eventName]) {
      return;
    }
    this.listeners[eventName].forEach(callback => {
      callback(event);
    });
  }
}
