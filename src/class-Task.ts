import { Entity } from './class-Entity';
import { Completable } from './completable';

export class Task extends Entity implements Completable {
  private _completed: boolean;
  private _priority: number;
  private _completedAt: Date;

  get completed(): boolean {
    return this._completed;
  }

  set completed(value: boolean) {
    this._completed = value;
  }

  get conpletedAt(): Date {
    return this._completedAt;
  }

  set conpletedAt(value: Date) {
    this._completedAt = value;
  }

  get priority(): number {
    return this._priority;
  }

  set priority(value: number) {
    this._priority = value;
  }
}
