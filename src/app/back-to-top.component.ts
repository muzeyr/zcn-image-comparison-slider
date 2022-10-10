import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'back-to-top',
  template: `
    <div class="backToTop" [hidden]="isOnTop" (click)="onClick()">
      <div>
        <a href="#" #a>^</a>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes a {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      .backToTop {
        z-index: 999999;
        animation: a 1s;

        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 2rem;
        height: 2rem;
        background-color: gray;
        padding: 1rem;
        border-radius: 2rem;
        cursor: pointer;
      }
      .backToTop > div {
        width: 2rem;
        height: 2rem;
        text-align: center;
      }
      .backToTop > div > a {
        text-decoration: none;
        font-size: 2rem;
        font-weight: 700;
        color: white;
      }
    `
  ]
})
export class BackToTopComponent implements OnInit {
  @ViewChild('a') link: ElementRef;
  isOnTop = true;
  ngOnInit() {
    document.addEventListener('scroll', e => {
      this.isOnTop = document.scrollingElement.scrollTop < 200;
    });
  }

  onClick(): void {
    this.link.nativeElement.click();
  }
}
