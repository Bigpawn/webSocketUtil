class EventMap {
  deps = new Map();

  depend(eventType: EventTypes, callback: (event: any) => void) {
    this.deps.set(eventType, callback);
  }

  notify(eventType: EventTypes, event: any) {
    if (this.deps.has(eventType)) {
      this.deps.get(eventType)(event);
    }
  }
}

export default EventMap;
