import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const separatorImages = {
  black:
    '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',
  white:
    'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5QYQEiYIh6P+pgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAChElEQVR42u3dQVLDMBBEUTxF5f7nzQYuAEkcsDRSv79lEan7W3bsyBwfYdzv969Hf7/dbkdSHofis0U4lJ8twaH8bAlK+dmUCLIlIkA4hyM3+1rACuAaAAQAAUAAEAAEAAFAABAABAABQAAQAAQAAUAAEAAEAAFAABAABAABQAAQAATAcnyO+JBH+/TSXsnSLZtj5gSvnGz3zaGzchl6CjhTQtLLHDrlUh0miXlZVqcBJ0jTLZty5GevBNVtgDsL1DGfcuRnrwSl/GwJqlv5O98Y6nivoxz52StBKT9bgupUfsJzgavm+G4npfxsCUr52RKU8rMlKOVnS1DKz5aglJ8tQSk/W4JSfrYEx6jyRwc06xnFavkdKw3+TCGjBVg1u1pxAt3Gu3J2teIEOgW/ena1+lO9mePfITtbw8LZQoAZR+Iuv4ewAlgBQAAQAARYlhnPGHZ5rmEFSF8BVjd55vh3yK5WnkiHca+e3ZJPA18Jfcbj4BXzG/Z7gNFHyup7Fkf1UKMmaitZv/J//RZAgozyH34NJMH+5T+9D0CCvct/KgAJ9i7/JQFIsG/5LwtAgj3LPyUACfYr/7QAJNir/LcEIME+5b8twJUSYGwXNeuDE1eBK+b21w5q9gAwN/vqMhDMyby6DYhMYzOqrgNT3JiMq7OduD7b6jRQr4odn011mahXxc7JpjpM1Kti52UzLPifboJcObmVfhQ6OpspAozGfzJpcAoAAUAAEAAEAAFAABAABAABQAAQAAQAAUAAEAAEAAFAABAABAABQAAQAAQAAXARW2/K/K/tYTtvXrUCOAUg9ejfXgCvqwm/BvjrtUCCQDFHyFkJUlaPuCXymQhpp41vCXPA3GxbkbAAAAAASUVORK5CYII='
};

@Component({
  selector: 'test-ngx-image-comparison-slider',
  template: `
    <div style="overflow: hidden;" #d1>
      <img [src]="src1" [alt]="alt1" #i1 />
    </div>
    <div style="position: relative; cursor: col-resize;" #s>
      <div style="position: absolute;" [hidden]="!showSliderBall" #sb>
        <img
          alt="separate image"
          [src]="sliderBallImageSrc"
          width="60%"
          style="left: 20%; top: 20%; position: absolute"
        />
      </div>
    </div>
    <div style="overflow: hidden; position: relative;" #d2>
      <img [src]="src2" [alt]="alt2" style="position: absolute;" #i2 />
    </div>
  `,
  styles: []
})
export class NgxImageComparisonSliderComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('d1') div: ElementRef;
  @ViewChild('d2') div2: ElementRef;
  @ViewChild('s') slider: ElementRef;
  @ViewChild('i1') image: ElementRef;
  @ViewChild('i2') image2: ElementRef;
  @ViewChild('sb') sliderBall: ElementRef;

  value = new Subject<number>();
  valueSub: Subscription;
  @Input() src1: string;
  @Input() src2: string;
  @Input() maxWidth = 600;
  @Input() maxHeight = 400;
  @Input() imageFit: 'cover' | 'contain' | 'fill' = 'cover';
  @Input() sliderWidth = 5;
  @Input() sliderColor = 'whitesmoke';
  @Input() showSliderBall = true;
  @Input() calcSliderBallDif = true;
  @Input() sliderBallSize;
  @Input() sliderBallImageColor: 'black' | 'white' = 'black';
  sliderBallImageSrc: SafeResourceUrl = '';
  @Input() leftBorder: number;
  @Input() rightBorder: number;
  @Input() alt1 = 'sliderImage1';
  @Input() alt2 = 'sliderImage2';
  @Input() zIndexStart = 1000;
  @Input() startPos: 'leftBorder' | 'middle' | 'rightBorder' | number =
    'middle';
  @Input() sliderShadow = true;
  isDragging = false;

  constructor(private sanitizer: DomSanitizer) {}

  _setElementWidthHeight(x: ElementRef, w: number, h: number): void {
    x.nativeElement.style.height = h + 'px';
    x.nativeElement.style.width = w + 'px';
  }

  _setElementStyle(x: ElementRef, attr: string, val: string | number): void {
    (x.nativeElement.style as CSSStyleDeclaration)[attr] = val;
  }

  _setElementStylesObj(
    x: ElementRef,
    styles: Record<string, string | number>
  ): void {
    Object.keys(styles).forEach(k => {
      this._setElementStyle(x, k, styles[k]);
    });
  }

  _initValues(): void {
    this.sliderBallSize = !!this.sliderBallSize
      ? this.sliderBallSize
      : this.sliderWidth * 4;
    const sliderBallDif =
      this.showSliderBall && this.calcSliderBallDif
        ? this.sliderBallSize / 2 - this.sliderWidth / 2
        : 0;
    this.leftBorder =
      !!this.leftBorder && this.leftBorder > 0
        ? this.leftBorder
        : sliderBallDif;
    this.rightBorder =
      !!this.rightBorder && this.rightBorder < this.maxWidth
        ? this.rightBorder
        : this.maxWidth - this.sliderWidth - sliderBallDif;
    this.sliderBallImageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:image/png;base64, ${separatorImages[this.sliderBallImageColor]}`
    );
  }

  _initStyles(): void {
    // LEFT CONTAINER
    this._setElementWidthHeight(this.div, this.maxWidth, this.maxHeight);
    this._setElementStylesObj(this.div, {
      zIndex: this.zIndexStart + 1
    });
    // RIGHT CONTAINER
    this._setElementWidthHeight(this.div2, this.maxWidth, this.maxHeight);
    this._setElementStylesObj(this.div2, {
      top: -this.maxHeight * 2 + 'px',
      marginBottom: -this.maxHeight * 2 + 'px',
      zIndex: this.zIndexStart
    });
    // SLIDER
    this._setElementWidthHeight(this.slider, this.sliderWidth, this.maxHeight);
    this._setElementStylesObj(this.slider, {
      top: -this.maxHeight + 'px',
      backgroundColor: this.sliderColor,
      zIndex: this.zIndexStart + 2,
      boxShadow: this.sliderShadow ? '0 0 15px black' : 'none'
    });
    this._setElementWidthHeight(
      this.sliderBall,
      this.sliderBallSize,
      this.sliderBallSize
    );
    this._setElementStylesObj(this.sliderBall, {
      top: this.maxHeight / 2 - this.sliderBallSize / 2 + 'px',
      left: this.sliderWidth / 2 - this.sliderBallSize / 2 + 'px',
      borderRadius: this.sliderBallSize / 2 + 'px',
      backgroundColor: this.sliderColor
    });
    // LEFT IMAGE
    this._setElementWidthHeight(this.image, this.maxWidth, this.maxHeight);
    // RIGHT IMAGE
    this._setElementWidthHeight(this.image2, this.maxWidth, this.maxHeight);
    this._setElementStylesObj(this.image2, {
      objectFit: this.imageFit
    });
  }

  _initListeners(): void {
    this.valueSub = this.value.subscribe(x => {
      this.div.nativeElement.style.width = x + 'px';
      this.slider.nativeElement.style.left = x + 'px';
      this.image2.nativeElement.style.clip =
        'rect(0px,2000px,2000px,' + x + 'px)';
    });

    let clickOffset = 0;
    const divOffset = this.div.nativeElement.getBoundingClientRect().left;
    const startListener = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      console.log(e);
      this.isDragging = true;
      if (e instanceof MouseEvent) {
        clickOffset = e.offsetX;
      }
    };
    const moveListener = (e: MouseEvent | TouchEvent) => {
      if (this.isDragging) {
        if (e instanceof MouseEvent) {
          e.preventDefault();
        }
        const clientX =
          e instanceof MouseEvent ? e.clientX : e.touches.item(0).clientX;
        const newVal = clientX - clickOffset - divOffset;
        this.value.next(
          Math.max(Math.min(newVal, this.rightBorder), this.leftBorder)
        );
      }
    };
    const endListener = (e: MouseEvent | TouchEvent) => {
      this.isDragging = false;
    };

    this.slider.nativeElement.addEventListener('mousedown', startListener);
    this.slider.nativeElement.addEventListener('touchstart', startListener);
    window.addEventListener('mousemove', moveListener);
    window.addEventListener('touchmove', moveListener);
    window.addEventListener('mouseup', endListener);
    window.addEventListener('touchend', endListener);
  }

  _initStartPos(): void {
    let startVal: number;
    switch (this.startPos) {
      case 'leftBorder':
        startVal = this.leftBorder;
        break;
      case 'middle':
        startVal =
          this.maxWidth / 2 -
          this.sliderWidth / 2 -
          (this.showSliderBall ? this.sliderBallSize / 2 : 0);
        break;
      case 'rightBorder':
        startVal = this.rightBorder;
        break;
      default:
        startVal = this.startPos;
        break;
    }
    this.value.next(startVal);
  }

  ngOnInit(): void {
    this._initValues();
  }

  ngAfterViewInit(): void {
    this._initStyles();
    this._initListeners();
    this._initStartPos();
  }

  ngOnDestroy(): void {
    if (this.valueSub) {
      this.valueSub.unsubscribe();
    }
  }
}
