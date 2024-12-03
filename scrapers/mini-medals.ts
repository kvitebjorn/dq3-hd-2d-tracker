import axios from "axios";
import { load } from "cheerio";

const source =
  "https://www.rpgsite.net/guide/16518-dragon-quest-iii-hd-2d-rem-all-mini-medals-locations";

type MinimedalEntry = {
  ImageUrl?: string;
  Id?: string;
  Hint?: string;
};

async function scrapeSite(): Promise<MinimedalEntry[]> {
  const response = await axios.get(source);
  const html = response.data;
  const $ = load(html);
  const minimedalEntries: MinimedalEntry[] = [];

  $("figure.image-with-caption").each((i, minimedalHTMLElement) => {
    const imageUrl = $(minimedalHTMLElement).find("a").first().attr("href");
    const caption = $(minimedalHTMLElement)
      .find("figcaption.caption")
      .first()
      .text();

    const matches = caption.match(/Mini Medal #(\d+): (.+)/);
    if (matches) {
      const minimedalEntry: MinimedalEntry = {
        ImageUrl: imageUrl,
        Id: matches[1],
        Hint: matches[2],
      };
      minimedalEntries.push(minimedalEntry);
    } else {
      console.log("No match found");
    }
  });

  return minimedalEntries;
}

async function main() {
  console.log("scraping mini-medals from preferred source...");
  const minimedals = await scrapeSite();
  console.log(minimedals);
}

main();

// TODO: download each image and save to public resources of our app
//       and save the Id & Hint... somewhere... db?
// implement `saveMinimedals`
