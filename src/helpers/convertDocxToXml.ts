import JSZip from "jszip";

export const convertDocxToXml = (file: File): Promise<Document | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async function (e) {
      const arrayBuffer = e.target?.result;

      if (!arrayBuffer) {
        throw new Error();
      }

      try {
        const zip = await JSZip.loadAsync(arrayBuffer);
        const xml = await zip.file("word/document.xml").async("string");

        const parser = new DOMParser();
        const result = parser.parseFromString(xml, "text/xml");

        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsArrayBuffer(file);
  });
};
