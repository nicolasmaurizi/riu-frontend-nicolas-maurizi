import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Hero } from '../../models/hero.model';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './hero-list.html',
  styleUrl: './hero-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroList {
  @Input() heroes: Hero[] = [];
  @Output() edit = new EventEmitter<Hero>();
  @Output() delete = new EventEmitter<Hero>();

  onEdit(hero: Hero): void {
    this.edit.emit(hero);
  }

  onDelete(hero: Hero): void {
    this.delete.emit(hero);
  }
}
