import fetch from 'node-fetch';

let handler = async (m, { fukusima, q, setReply }) => {
  try {
    // Pesan pengantar jika input tidak diberikan
    const teks = `📖 *Silakan masukkan nama dan nomor hadits yang ingin dicari*:
    
    Contoh: *hadist muslim 1*
    
    Berikut daftar kitab hadits yang tersedia:
    
    1. Abu-Daud (1 - 4419)
    2. Ahmad (1 - 4305)
    3. Bukhari (1 - 6638)
    4. Darimi (1 - 2949)
    5. Ibnu-Majah (1 - 4285)
    6. Malik (1 - 1587)
    7. Muslim (1 - 4930)
    8. Nasai (1 - 5364)
    9. Tirmidzi (1 - 3625)
    `;

    // Jika pengguna tidak memberikan input
    if (!q) return fukusima.reply(teks);

    // Mendapatkan input dari pengguna
    const hadist = q.split(' ')[0].toLowerCase(); // Kitab hadits
    const nomer = q.split(' ')[1]; // Nomor hadits

    // Validasi jika nomor hadits tidak diberikan
    if (!nomer) {
      return fukusima.reply("🚫 *Mohon masukkan nomor hadits setelah nama kitab.*\n\nContoh: *hadist muslim 1*");
    }

    // Fetch hadits dari API
    const response = await fetch(`https://api.hadith.gading.dev/books/${hadist}/${nomer}`);

    // Jika respons gagal atau API tidak merespon dengan benar
    if (!response.ok) {
      throw new Error('API tidak dapat diakses, coba lagi nanti.');
    }

    const result = await response.json();

    // Jika hadits tidak ditemukan atau terjadi error
    if (result.error || !result.data) {
      return fukusima.reply(`🚫 *Maaf, hadits tidak ditemukan.* Pastikan nama kitab dan nomor hadits benar.\nContoh: *hadist muslim 1*`);
    }

    // Menyusun hasil dengan format yang lebih rapi
    const mess = `
*📜 Hadits dari Kitab ${hadist.charAt(0).toUpperCase() + hadist.slice(1)}*

📌 *Nomor Hadits*: ${result.data.contents.number}

🕌 *Teks Arab*: 
${result.data.contents.arab}

📖 *Terjemahan*: 
${result.data.contents.id}

🤲 *Semoga kita senantiasa diberkahi oleh Allah melalui ilmu dari hadits ini.*`;

    // Kirim hasil hadits
    await m.reply(mess); // Kirim hasil hadits yang sudah disusun

  } catch (e) {
    // Menangani error dengan pesan yang ramah
    console.error(e.message); // Log pesan error
    fukusima.reply("🚫 *Terjadi kesalahan, silakan coba lagi.*"); // Pesan kesalahan untuk pengguna
  }
};

handler.help = ["hadist"];
handler.tags = ["islami"];
handler.command = ["hadist"];
handler.register = true;

export default handler;