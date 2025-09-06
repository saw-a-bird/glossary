import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {

  @Input() contentRef! : string;
  @ViewChild('content') content?:ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {}

  ngAfterContentChecked() {
    this.renderContent();
  }

  renderContent(): void {
    if (this.content) {
      this.content.nativeElement.innerHTML = ''; // clear 
      const formattedSpan: HTMLSpanElement = this.renderer.createElement('span');
      formattedSpan.innerHTML = this.adjustContent(this.contentRef);
      this.renderer.appendChild(this.content.nativeElement, formattedSpan)
    }
  }

  adjustContent(htmlContent: string) : string {

    htmlContent = htmlContent.replace(/^(.+)\n([=]){2}\2+$/mg, "<h1>$1</h1>");
    htmlContent = htmlContent.replace(/^(.+)\n([-]){2}\2+$/mg, "<h2>$1</h2>");
    // htmlContent = htmlContent.replace(/^\w/gm, '&emsp;$&');
    // htmlContent = htmlContent.replace(/(\s)(\w\.)/g, '$1&emsp;$2');
    htmlContent = htmlContent.replace(/^(.+?)$/mg, '<p>$1</p>');
    htmlContent = htmlContent.replace(/\*\*(.*?)\*\*/mg, '<strong>$1</strong>');
    htmlContent = htmlContent.replace(/\*(.+?)\*/mg, '<em>$1</em>');
    htmlContent = htmlContent.replace(/_(.+?)_/mg, '<u>$1</u>');

    return htmlContent;
  }
}  