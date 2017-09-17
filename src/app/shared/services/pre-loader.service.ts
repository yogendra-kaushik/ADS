import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class PreLoaderService {

  /**
   * Represents the emitter which will emit a loading state.
   */
  public loadingEmitter = new EventEmitter<boolean>();

  constructor() { }

  /**
   * Marks the loader as loading.
   */
  public start(): void {
    this.loadingEmitter.emit(true);
  }

  /**
   * Marks the loader as not loading.
   */
  public stop(): void {
    this.loadingEmitter.emit(false);
  }
}
