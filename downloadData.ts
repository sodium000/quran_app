import fs from "fs";

interface QuranEditionVerse {
  chapter: number;
  verse: number;
  text: string;
}

interface QuranEditionResponse {
  quran: QuranEditionVerse[];
}

interface ChapterInfo {
  name: string;
  englishname: string;
  revelation: string;
}

interface InfoResponse {
  chapters: ChapterInfo[];
}

interface OutputVerse {
  id: number;
  text: string;
  translation: string;
}

interface OutputSurah {
  id: number;
  name: string;
  englishName: string;
  type: string;
  verses: OutputVerse[];
}

async function main() {
  const quranReq = await fetch("https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/ara-quranuthmanihaf.min.json");
  const enReq = await fetch("https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/eng-yusufaliorig.min.json");

  if (!quranReq.ok) {
    console.log(await quranReq.text());
    return;
  }

  const ara = (await quranReq.json()) as QuranEditionResponse;
  const eng = (await enReq.json()) as QuranEditionResponse;

  console.log("Arabic: ", ara.quran.length);
  console.log("English: ", eng.quran.length);

  const surahs: OutputSurah[] = [];
  for (let i = 1; i <= 114; i += 1) {
    surahs.push({
      id: i,
      name: `Surah ${i}`,
      englishName: `Surah ${i}`,
      type: "",
      verses: [],
    });
  }

  for (let i = 0; i < ara.quran.length; i += 1) {
    const araVerse = ara.quran[i];
    const engVerse = eng.quran[i];
    surahs[araVerse.chapter - 1].verses.push({
      id: araVerse.verse,
      text: araVerse.text,
      translation: engVerse.text,
    });
  }

  const infoReq = await fetch("https://raw.githubusercontent.com/fawazahmed0/quran-api/1/info.json");
  const info = (await infoReq.json()) as InfoResponse;

  for (let i = 0; i < 114; i += 1) {
    const s = info.chapters[i];
    surahs[i].name = s.name;
    surahs[i].englishName = s.englishname;
    surahs[i].type = s.revelation;
  }

  if (!fs.existsSync("./quran-app/public/data")) {
    fs.mkdirSync("./quran-app/public/data", { recursive: true });
  }
  fs.writeFileSync("./quran-app/public/data/quran.json", JSON.stringify(surahs));
  console.log("Data saved to ./quran-app/public/data/quran.json");
}

main().catch(console.error);
