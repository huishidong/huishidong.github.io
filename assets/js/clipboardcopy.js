/* Simple copy to clipboard action
 * ---
 * This script adds a simple "copy to clipboard" button to code elements located within <pre> elements. 
 * Requires jQuery. Can be used with the Jekyll Minimal Mistakes theme by adding it to the 'after_footer_scripts'.
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function onClickEffect(btn, style) {
  btn.removeClass("btn-light");
  btn.addClass(style);
  await sleep(250);
  btn.removeClass(style);
  btn.addClass("btn-light");
}

$(document).ready(function() {
  $(".page__content pre > code").each(function() {
    const parent = $(this).parent();
    // parent.addClass('line-numbers');
    // parent.attr('data-start', '10');

    // Create a container div for the header
    const headerDiv = $(document.createElement('div'))
      .css({
        'display': 'flex',
        'justify-content': 'space-between',
        'align-items': 'center',
        'position': 'absolute',
        'top': '0',
        'left': '0',
        'right': '0',
        'padding': '0.5em 1em'
      });

      const codeText = $(this).text();
      const nameMatch = codeText.match(/\/\/ @name: (.*)\n/);
      const language = $(this).attr('class')?.split('language-')[1] || 'text';
      const name = nameMatch ? nameMatch[1] : '';
      const label = name ? `${language} - ${name}` : language;
    const languageSpan = $(document.createElement('span'))
      .text(label)
      .css({
        'color': '#666',
        'font-size': '0.9em'
      });

    // Create copy button (your existing button code)
    const copyButton = $(document.createElement('button')).prop({
      type: 'button',
      innerHTML: '<i class="far fa-copy"></i>',
    })
    .attr('title', 'Copy to clipboard')
    .addClass('btn')
    .addClass('btn--primary')
    .addClass('btn--small')
    // Click listener remains the same
    .on('click', function() {
      let codeElement = $(this).closest('pre').children('code').first();

      if (!codeElement) {
          throw new Error("Unexpected error! No corresponding code block was found for this button.");
      }

      onClickEffect($(this), "btn--success")
      navigator.clipboard.writeText($(codeElement).text()).then(() => true, () => true);
      return true;
    });

    // Add both elements to the header div
    headerDiv.append(languageSpan);
    headerDiv.append(copyButton);

    // Add the header div to the pre element
    parent.prepend(headerDiv);

    // Add some padding to the pre element to make room for the header
    parent.css('padding-top', '2.5em');

    // // Add line numbers
    // const lines = codeText.split("\n");
    // const lineNumbers = [];
    // let currentLine = 1;

    // // Calculate line numbers considering wrapping
    // for(let i = 0; i < lines.length; i++) {
    //   // Skip empty last line
    //   if (lines[i] === "" && i === lines.length - 1) {
    //     continue;
    //   }

    //   // // Calculate wrapped lines based on content length
    //   // const wraps = Math.floor(lines[i].length / 70);  // 70 chars per line
    //   lineNumbers.push(currentLine);
      
    //   // // Add empty lines for wrapped content
    //   // for(let j = 0; j < wraps; j++) {
    //   //   lineNumbers.push("");
    //   // }
      
    //   currentLine++;
    // }

    // // Create and style line numbers container
    // const lineNumbersDiv = $(document.createElement('pre'))
    //   .addClass('line-numbers')
    //   .css({
    //     'position': 'absolute',
    //     'left': '0',
    //     'top': '2.5em',  // Account for header
    //     'margin': '0',
    //     'padding': '1em 0.5em',
    //     'text-align': 'right',
    //     'width': '3em',
    //     'color': '#666',
    //     'border-right': '1px solid #ddd',
    //     'user-select': 'none'
    //   })
    //   .text(lineNumbers.join("\n"));

    // // Adjust main code block padding
    // parent.css({
    //   'position': 'relative',
    //   'padding-left': '3em'  // Make room for line numbers
    // });

    // // Insert line numbers
    // parent.append(lineNumbersDiv);
  });
});