const fs = require('fs');

async function main() {
  const quranReq = await fetch('https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/ara-quranuthmanihaf.min.json');
  const enReq = await fetch('https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/eng-yusufaliorig.min.json');


  if (!quranReq.ok) {
    console.log(await quranReq.text());
    return;
  }
  
  const ara = await quranReq.json();
  const eng = await enReq.json();

  console.log("Arabic: ", ara.quran.length);
  console.log("English: ", eng.quran.length);
  
  const surahs = [];
  for(let i = 1; i <= 114; i++) {
    surahs.push({
      id: i,
      name: `Surah ${i}`,
      verses: []
    });
  }
  
  for(let i=0; i < ara.quran.length; i++) {
    const araVerse = ara.quran[i];
    const engVerse = eng.quran[i];
    surahs[araVerse.chapter - 1].verses.push({
      id: araVerse.verse,
      text: araVerse.text,
      translation: engVerse.text
    });
  }
  
  const infoReq = await fetch('https://raw.githubusercontent.com/fawazahmed0/quran-api/1/info.json');
  const info = await infoReq.json();
  
  for(let i=0; i<114; i++) {
    const s = info.chapters[i];
    surahs[i].name = s.name;
    surahs[i].englishName = s.englishname;
    surahs[i].type = s.revelation;
  }

  if (!fs.existsSync('./quran-app/public/data')) {
    fs.mkdirSync('./quran-app/public/data', { recursive: true });
  }
  fs.writeFileSync('./quran-app/public/data/quran.json', JSON.stringify(surahs));
  console.log("Data saved to ./quran-app/public/data/quran.json");
}

main().catch(console.error);
