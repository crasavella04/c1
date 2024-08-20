export const convertXmlToHtml = (xml: any) => {
  let html = "";

  const body = xml.getElementsByTagName("w:body")[0];
  const paragraphs = body.getElementsByTagName("w:p");

  for (let i = 0; i < paragraphs.length; i++) {
    html += "<p>";

    const runs = paragraphs[i].getElementsByTagName("w:r");

    for (let j = 0; j < runs.length; j++) {
      let runHtml = "<span>";

      const runProperties = runs[j].getElementsByTagName("w:rPr")[0];

      let style = "";

      if (runProperties) {
        if (runProperties.getElementsByTagName("w:b").length > 0) {
          runHtml = "<b>" + runHtml;
        }

        if (runProperties.getElementsByTagName("w:i").length > 0) {
          runHtml = "<i>" + runHtml;
        }

        if (runProperties.getElementsByTagName("w:u").length > 0) {
          runHtml = "<u>" + runHtml;
        }

        const colorNode = runProperties.getElementsByTagName("w:color")[0];
        if (colorNode) {
          const color = colorNode.getAttribute("w:val");
          if (color) {
            style += `color:#${color};`;
          }
        }

        const sizeNode = runProperties.getElementsByTagName("w:sz")[0];
        if (sizeNode) {
          const size = sizeNode.getAttribute("w:val");
          if (size) {
            const fontSize = parseInt(size, 10) / 2;
            style += `font-size:${fontSize}pt;`;
          }
        }
      }

      const textNodes = runs[j].getElementsByTagName("w:t");
      for (let k = 0; k < textNodes.length; k++) {
        const text = textNodes[k].textContent || "";
        runHtml += text;
      }

      if (runProperties) {
        if (runProperties.getElementsByTagName("w:b").length > 0) {
          runHtml += "</b>";
        }
        if (runProperties.getElementsByTagName("w:i").length > 0) {
          runHtml += "</i>";
        }
        if (runProperties.getElementsByTagName("w:u").length > 0) {
          runHtml += "</u>";
        }
      }

      if (style) {
        runHtml = `<span style="${style}">${runHtml}</span>`;
      }

      html += runHtml;
    }

    html += "</p>";
  }

  return html;
};
