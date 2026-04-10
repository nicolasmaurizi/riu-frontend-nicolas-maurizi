import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../../core/services/notification';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { HeroDialogComponent } from '../hero-dialog-component/hero-dialog-component';
import { HeroFormValue } from '../../models/hero-form.model';
import { Hero } from '../../models/hero.model';
import { DuplicateHeroNameError, HeroesService } from '../../services/heroes.service';

interface HeroRow extends Hero {
  publisher: string;
}

@Component({
  selector: 'app-heroes-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './heroes-home.html',
  styleUrl: './heroes-home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesHome {
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  private readonly dialog = inject(MatDialog);
  private readonly heroesService = inject(HeroesService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);

  readonly displayedColumns = ['image', 'name', 'publisher', 'alignment', 'power', 'intelligence', 'actions'];
  readonly pageSizeOptions = [2, 4, 8];
  readonly searchTerm = signal('');

  readonly heroes = computed<HeroRow[]>(() =>
    this.heroesService.heroes().map((hero) => ({
      ...hero,
      publisher: hero.universe,
    })),
  );
  readonly pageIndex = signal(0);
  readonly pageSize = signal(4);
  readonly filteredHeroes = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.heroes();
    }

    return this.heroes().filter((hero) =>
      [hero.name, hero.alias, hero.publisher, hero.alignment]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(term)),
    );
  });
  readonly totalHeroes = computed(() => this.filteredHeroes().length);

  readonly pagedHeroes = computed(() => {
    const startIndex = this.pageIndex() * this.pageSize();
    return this.filteredHeroes().slice(startIndex, startIndex + this.pageSize());
  });

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.pageIndex.set(0);

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onAddHero(): void {
    this.dialog
      .open(HeroDialogComponent, {
        width: '640px',
        maxWidth: 'calc(100vw - 32px)',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((payload: HeroFormValue | undefined) => {
        if (!payload) {
          return;
        }

        try {
          this.heroesService.create(payload);
          this.pageIndex.set(0);
          this.notification.success(this.translate.instant('heroes.notifications.created'));
        } catch (error) {
          if (error instanceof DuplicateHeroNameError) {
            this.notification.error(this.translate.instant('heroes.notifications.duplicateName'));
            return;
          }

          this.notification.error(this.translate.instant('heroes.notifications.createError'));
        }
      });
  }

  onEditHero(hero: HeroRow): void {
    this.dialog
      .open(HeroDialogComponent, {
        width: '640px',
        maxWidth: 'calc(100vw - 32px)',
        autoFocus: false,
        data: hero,
      })
      .afterClosed()
      .subscribe((payload: HeroFormValue | undefined) => {
        if (!payload) {
          return;
        }

        try {
          const updatedHero = this.heroesService.update(hero.id, payload);

          if (!updatedHero) {
            this.notification.error(this.translate.instant('heroes.notifications.updateError'));
            return;
          }

          this.notification.success(this.translate.instant('heroes.notifications.updated'));
        } catch (error) {
          if (error instanceof DuplicateHeroNameError) {
            this.notification.error(this.translate.instant('heroes.notifications.duplicateName'));
            return;
          }

          this.notification.error(this.translate.instant('heroes.notifications.updateError'));
        }
      });
  }

  onDeleteHero(hero: HeroRow): void {
    const dialogData: ConfirmDialogData = {
      title: this.translate.instant('dialog.deleteHeroTitle'),
      message: this.translate.instant('dialog.deleteHeroMessage', {
        name: hero.alias || hero.name,
      }),
      confirmText: this.translate.instant('dialog.delete'),
      cancelText: this.translate.instant('common.cancel'),
      variant: 'danger',
    };

    this.dialog
      .open(ConfirmDialog, {
        width: '420px',
        maxWidth: 'calc(100vw - 32px)',
        autoFocus: false,
        data: dialogData,
      })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) => {
        if (!confirmed) {
          return;
        }

        const wasDeleted = this.heroesService.delete(hero.id);

        if (!wasDeleted) {
          this.notification.error(this.translate.instant('heroes.notifications.deleteError'));
          return;
        }

        this.syncPageIndexAfterDelete();
        this.notification.success(this.translate.instant('heroes.notifications.deleted'));
      });
  }

  getPowerTone(powerLevel: number): 'low' | 'medium' | 'high' {
    return this.getMetricTone(powerLevel);
  }

  getUniverseLabelKey(universe: Hero['universe']): string {
    if (universe === 'Marvel') {
      return 'heroes.publisherValues.marvel';
    }

    if (universe === 'DC') {
      return 'heroes.publisherValues.dc';
    }

    return 'heroes.publisherValues.other';
  }

  getAlignmentLabelKey(alignment: Hero['alignment']): string {
    if (alignment === 'Hero') {
      return 'heroes.alignmentValues.hero';
    }

    if (alignment === 'Anti-Hero') {
      return 'heroes.alignmentValues.antiHero';
    }

    return 'heroes.alignmentValues.neutral';
  }

  private syncPageIndexAfterDelete(): void {
    const nextMaxPageIndex = Math.max(0, Math.ceil(this.totalHeroes() / this.pageSize()) - 1);

    if (this.pageIndex() > nextMaxPageIndex) {
      this.pageIndex.set(nextMaxPageIndex);
    }
  }

  getIntelligenceTone(intelligence: number): 'low' | 'medium' | 'high' {
    return this.getMetricTone(intelligence);
  }

  private getMetricTone(value: number): 'low' | 'medium' | 'high' {
    if (value <= 39) {
      return 'low';
    }

    if (value <= 69) {
      return 'medium';
    }

    return 'high';
  }
}
