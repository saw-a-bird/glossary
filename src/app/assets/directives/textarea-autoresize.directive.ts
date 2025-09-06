import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appTextareaAutoresize]'
})

export class AutoTextareaDirective implements OnInit {
  self = this.elementRef.nativeElement;
  selectedText = {begin: 0, end: 0};

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {}

  // @Output() contentLoad: EventEmitter<any> = new EventEmitter();
  @HostListener('input') onInput() {
    this.update();
  }

  @HostListener('focusout', ['$event']) onFocusOut(event: EventTarget) {
    var self = this.elementRef.nativeElement;
    // obtain the index of the first selected character
    this.selectedText.begin = self.selectionStart;
    // obtain the index of the last selected character
    this.selectedText.end = self.selectionEnd;
  }

  /**
   * Auto-resizes textarea based on content height.
   */
  update() {
    this.elementRef.nativeElement.style.height = '0';
    this.elementRef.nativeElement.style.height = 30 + this.elementRef.nativeElement.scrollHeight + 'px';
  }

  private safeInsert(str: string, insertAt: number, insertText: string) {
    return str.slice(0, insertAt) + insertText + str.slice(insertAt);
  }

  /**
   * Inserts or toggles formatting around selected text.
   * @param textToAdd - String to insert (e.g., "**", "*", "header")
   * @param defaultText - Default text if no selection is made
   * @returns Updated string value for the textarea
   */

  addFormatting(formatType: string, defaultText: string) {
    const { begin, end } = this.selectedText;   // Get current selection start/end
    const content = this.self.value;             // Current textarea content

    if (begin >= 0) {                           // Ensure a valid selection
      let selection = content.substring(begin, end); // Extract selected text
      if (!selection) selection = defaultText;     // Use default if empty

      var negativeString : string;
      if (formatType == "header")
        // Special case for headers
        return this.applyHeader(content, selection, begin, end);
      else {
        // Remove the formatting around the selection first
        negativeString = this.removeFormatting(content, selection, begin, end, formatType);
        if (content == negativeString) 
          // If nothing was removed, so we add the formatting around the selection
          return content.substring(0, begin) + formatType + selection + formatType + content.substr(end); 
        
      }
      return negativeString; // remove or replaced string
    }
    return content;
  };

  /**
   * Removes formatting surrounding selected text if present.
   * @param content - Original textarea value
   * @param selectedText - Selected text
   * @param beginIndex - Start index of selection
   * @param endIndex - End index of selection
   * @param textToRemove - String to remove (e.g., "**", "*")
   * @returns Updated string with formatting removed, or original string if not present
   */
  removeFormatting(content: string, selectedText: string, beginIndex: number, endIndex: number, format: string) {
    const rLen = format.length;
    const start = beginIndex - rLen;
    const finish = endIndex + rLen;

    if (start >= 0 && content.substring(start, beginIndex) === format && content.substring(endIndex, finish) === format) {
      return content.slice(0, start) + selectedText + content.slice(finish);
    }
    return content;
  }

  /**
   * Applies header formatting around selected text.
   * Handles Markdown-style headers with "=" or "-" lines.
   * @param content - Original textarea value
   * @param selectedText - Selected text
   * @param beginIndex - Start index of selection
   * @param endIndex - End index of selection
   * @returns Updated string with header formatting applied
   */
  applyHeader(content: string, selectedText: string, beginIndex: number, endIndex: number) {
    const lines = content.split('\n');
    let lineIndex = content.substring(0, beginIndex).split('\n').length - 1;
    const line = lines[lineIndex].trim();

    if (line.startsWith('#')) {
      // Toggle to next header level or remove if already H3
      const level = Math.min(line.match(/^#+/)![0].length + 1, 3);
      lines[lineIndex] = '#'.repeat(level) + ' ' + selectedText;
    } else {
      lines[lineIndex] = '# ' + selectedText;
    }

    return lines.join('\n');
  }


  /**
   * Apply formatting based on icon/button name
   * @param iconName - Name of the formatting action ("bold", "italic", "underline", "text-width")
   */
  apply(iconName: string) {
    if (iconName == "underline")
      this.underline();
    else if (iconName == "italic")
      this.italic();
    else if (iconName == "text-width")
      this.size();
    else if (iconName == "bold")
      this.bold();
    this.update()
  }
  
  bold() { // Add Markdown bold formatting
    this.self.value = this.addFormatting("**", "strong text");
  }

  size() { // Add Markdown header formatting
    this.self.value = this.addFormatting("header", "Header");
  }

  italic() { // Add Markdown italic formatting
    this.self.value = this.addFormatting("*", "italic text");
  }

  underline() { // Add Markdown underline formatting
    this.self.value = this.addFormatting("_", "underlined text");
  }

  getContent() { // Get current textarea content
    console.log(this.self.value);
    return this.self.value.replace(/\n/g, '<br>');
  }
}