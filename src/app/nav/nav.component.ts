import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { KanbanService } from '../services/kanban.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnDestroy {
  
  private breakpointObserver: BreakpointObserver;
  isDarkTheme: boolean = false;
  destroyed = new Subject<void>();
  currentScreenSize: string = '';

  displayNameMap = new Map([
    ['(max-width: 599px)', 'Handset'],
    ['(min-width: 600px) and (max-width: 959px)', 'Tablet'],
    ['(min-width: 960px) and (max-width: 1279px)', 'Web'],
    ['(min-width: 1280px) and (max-width: 1919px)', 'Web'],
    ['(min-width: 1920px)', '4k'],
  ]);

  constructor( breakpointObserver: BreakpointObserver, public auth: AuthService) {
    this.breakpointObserver = breakpointObserver;
    this.breakpointObserver
      .observe(Array.from(this.displayNameMap.keys()))
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });
  }

  logout() {
    this.auth.logout();
  }
  
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? "Dark" : "Light");
  }
  
  ngOnInit() {
    this.isDarkTheme = localStorage.getItem('theme') === "Dark";
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}