import { Component, inject, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-preserve',
  templateUrl: './preserve.component.html',
  styleUrls: ['./preserve.component.scss']
})
export class PreserveComponent implements OnInit {

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruit[] = [{name: 'avidmx'}, {name: 'xvid'}, {name: 'libmad'}, {name: 'rfmpgvid'}];

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);

      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  edit(fruit: Fruit, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(fruit);
      return;
    }

    // Edit existing fruit
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits[index].name = value;
    }
  }

  drop(event: CdkDragDrop<Fruit[]>) {
    moveItemInArray(this.fruits, event.previousIndex, event.currentIndex);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
