// Interfaces
export interface Observer {
  update(): any;
}
export interface Observable {
  attach(o: Observer): any;
  detach(o: Observer): any;
  notify(): any;
  run(): any;
  payload: any;
}
