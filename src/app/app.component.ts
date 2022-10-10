import { Component, ElementRef, OnInit } from '@angular/core';
import template from './app.component.html';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  exampleCodesArr: string[] = [];
  componentTag = 'ngx-image-comparison-slider';
  headers: string[] = [];

  constructor() {
    const templateString = template.toString();
    const startTag = `<${this.componentTag}`;
    const endTag = `/${this.componentTag}>`;
    this.exampleCodesArr = this.getAllTextBetweenTags(
      templateString,
      startTag,
      endTag
    );
  }
  ngOnInit(): void {
    this._initCodeElements();
    this._initHeadingIds();
  }
  _initCodeElements(): void {
    const els = document.getElementsByTagName(this.componentTag);
    for (let i = 0; i < els.length; i++) {
      const newbtn = document.createElement('button');
      newbtn.addEventListener('click', () => {
        if (newbtn.nextElementSibling.getAttribute('hidden') == 'true') {
          newbtn.nextElementSibling.removeAttribute('hidden');
          newbtn.innerText = 'Hide code';
          newbtn.style.marginBottom = '0';
          newbtn.style.borderRadius = '0 0 1rem';
        } else {
          newbtn.nextElementSibling.setAttribute('hidden', 'true');
          newbtn.innerText = 'Show code';
          newbtn.style.marginBottom = '13px';
          newbtn.style.borderRadius = '0';
        }
      });
      els.item(i).before(newbtn);
      const newel = document.createElement('pre');
      newel.setAttribute('hidden', 'true');
      const newcodeel = document.createElement('code');
      newcodeel.setAttribute('data-language', 'html');
      newcodeel.innerHTML = this.exampleCodesArr[i];
      newel.appendChild(newcodeel);
      // newel.innerText = this.exampleCodesArr[i];
      els.item(i).before(newel);
      newbtn.click();
      newbtn.click();
    }
  }
  _initHeadingIds(): void {
    const els = document.getElementsByTagName('h2');
    for (let i = 0; i < els.length; i++) {
      els.item(i).id = 'ex' + (i + 1);
      this.headers.push(els.item(i).innerText);
    }
  }
  xd(e): void {
    e.click();
    setTimeout(() => (document.scrollingElement.scrollTop -= 65), 10);
  }

  getAllTextBetweenTags(
    temp: string,
    startTag: string,
    endTag: string
  ): string[] {
    let i = 0;
    let arr = [];
    while (true) {
      const x = this._getTextBetweenTags(temp, startTag, endTag, i);
      i = x.endPos;
      if (i < 0) {
        break;
      }
      // Transform code
      x.res.trim();
      x.res = x.res.replaceAll(/ +/g, ' '); // smanji sve razmake na 1
      x.res = x.res.replaceAll('\n', ''); // skloni nove redove
      x.res = x.res.replaceAll('" ', '"\n    '); // novi red posle svakog atributa
      x.res = x.res.replace(/(?<=<([\w-])+) /g, '\n    '); // novi red posle otvarajuceg taga
      x.res = x.res.replace(/ +<\//g, '</'); // povuci zatvarajuci tag
      x.res = x.res.replace('></', '>\n</'); // novi red izmedju tagova
      arr.push(this._htmlEnc(x.res));
    }
    return arr;
  }
  _getTextBetweenTags(
    temp: string,
    startTag: string,
    endTag: string,
    startPos: number = 0
  ): { res: string; endPos: number } {
    const i1 = temp.indexOf(startTag, startPos);
    const i2 = temp.indexOf(endTag, i1);
    if (i1 < 0 || i2 < 0) {
      return { res: '', endPos: -1 };
    }
    return {
      res: temp.substring(i1, i2 + endTag.length),
      endPos: i2 + endTag.length
    };
  }
  _htmlEnc(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&#34;');
  }
}
