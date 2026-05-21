const zodiakList = [
  { name: 'capricorn', start: [12, 22], end: [1, 19], range: '22 Desember - 19 Januari' },
  { name: 'aquarius', start: [1, 20], end: [2, 18], range: '20 Januari - 18 Februari' },
  { name: 'pisces', start: [2, 19], end: [3, 20], range: '19 Februari - 20 Maret' },
  { name: 'aries', start: [3, 21], end: [4, 19], range: '21 Maret - 19 April' },
  { name: 'taurus', start: [4, 20], end: [5, 20], range: '20 April - 20 Mei' },
  { name: 'gemini', start: [5, 21], end: [6, 20], range: '21 Mei - 20 Juni' },
  { name: 'cancer', start: [6, 21], end: [7, 22], range: '21 Juni - 22 Juli' },
  { name: 'leo', start: [7, 23], end: [8, 22], range: '23 Juli - 22 Agustus' },
  { name: 'virgo', start: [8, 23], end: [9, 22], range: '23 Agustus - 22 September' },
  { name: 'libra', start: [9, 23], end: [10, 22], range: '23 September - 22 Oktober' },
  { name: 'scorpio', start: [10, 23], end: [11, 21], range: '23 Oktober - 21 November' },
  { name: 'sagittarius', start: [11, 22], end: [12, 21], range: '22 November - 21 Desember' }
];

const monthMap = {
  januari: 1, febuari: 2, februari: 2, maret: 3, april: 4, mei: 5, juni: 6, 
  juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, desember: 12
};

const ramalanSet = [
  {
    cinta: "Hari ini penuh keharmonisan dengan pasangan.",
    karir: "Kesempatan baru akan datang, jangan ragu mengambil langkah.",
    kesehatan: "Tubuhmu butuh relaksasi, coba meditasi atau yoga."
  },
  {
    cinta: "Ada kejutan manis dari orang terdekat.",
    karir: "Selesaikan tugas tepat waktu, atasan memperhatikan usahamu.",
    kesehatan: "Perhatikan pola tidurmu agar tidak kelelahan."
  },
  {
    cinta: "Jangan biarkan kesalahpahaman merusak hubunganmu.",
    karir: "Satu keputusan hari ini bisa berdampak besar ke depannya.",
    kesehatan: "Waspadai gejala flu, perbanyak minum air putih."
  },
  {
    cinta: "Hari yang baik untuk menyatakan perasaanmu.",
    karir: "Kreativitasmu akan membuahkan hasil luar biasa.",
    kesehatan: "Energi positif mengalir, tapi tetap jaga pola makan."
  },
  {
    cinta: "Perhatikan perasaan pasangan, jangan terlalu sibuk sendiri.",
    karir: "Rezeki datang tak terduga, manfaatkan sebaik mungkin.",
    kesehatan: "Kesehatan stabil, tapi jangan lupakan olahraga ringan."
  }
];

function getZodiak(day, month) {
  for (const z of zodiakList) {
    const [startMonth, startDay] = z.start;
    const [endMonth, endDay] = z.end;

    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      (startMonth > endMonth && (month === startMonth || month === endMonth))
    ) {
      return z;
    }
  }
  return null;
}

const handler = async (m, { fukusima, args }) => {
  if (args.length < 2) return m.reply('Masukkan tanggal dan bulan lahir. Contoh: .zodiak 24 juli');

  const day = parseInt(args[0]);
  const monthName = args[1].toLowerCase();
  const month = monthMap[monthName];

  if (!day || !month || day < 1 || day > 31) return m.reply('Format tidak valid. Contoh: .zodiak 12 desember');

  const z = getZodiak(day, month);
  if (!z) return m.reply('Gagal mendeteksi zodiak. Coba lagi.');

  const set = ramalanSet[Math.floor(Math.random() * ramalanSet.length)];

  const teks = `
♈ *Zodiak:* ${z.name.charAt(0).toUpperCase() + z.name.slice(1)}
📆 *Tanggal:* ${z.range}

❤️ *Percintaan:* ${set.cinta}
💼 *Karir:* ${set.karir}
⚕️ *Kesehatan:* ${set.kesehatan}
  `.trim();

  fukusima.reply(m.chat, teks, m);
};

handler.command = ['zodiak'];
handler.tags = ['fun'];
handler.help = ['zodiak <tanggal> <bulan>'];
handler.limit = false;

export default handler;