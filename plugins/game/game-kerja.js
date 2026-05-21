let handler = async (m, { args }) => {
    const sender = m.sender;

    // --- Inisialisasi database ---
    global.db = global.db || {};
    global.db.data = global.db.data || {};
    global.db.data.users = global.db.data.users || {};
    global.db.data.users[sender] = global.db.data.users[sender] || {
        job: null,
        saldo: 100000, // Pastikan tipe number
        currentTask: null,
        currentAnswer: null,
        taskPoints: 0
    };
    let user = global.db.data.users[sender];

    // Pastikan saldo valid number
    if (typeof user.saldo !== 'number' || isNaN(user.saldo)) user.saldo = 100000;

    const cmd = m.text.split(' ')[0].slice(1).toLowerCase();
    const jobs = ['kantoran', 'gojek', 'bangunan'];

    if (cmd === 'kerja') {
        if (!user.job || args[0] === 'ganti') {
            if (!args[0] || !jobs.includes(args[0].toLowerCase())) {
                let listJobs = jobs.map(j => `- ${j}`).join('\n');
                return m.reply(`Pilih pekerjaan kamu:\n${listJobs}\nKetik .kerja <nama pekerjaan> untuk memilih.`);
            }
            user.job = args[0].toLowerCase();
            return m.reply(`Kamu sekarang bekerja di: *${user.job}*`);
        }
        return m.reply(`Kamu bekerja di: *${user.job}*`);
    }

    if (cmd === 'kerja' && args[0] === 'status') {
        return m.reply(`📊 *Status Kerja*\n• Pekerjaan: ${user.job || 'Belum memilih'}\n• Saldo: ${user.saldo}\n• Tugas Aktif: ${user.currentTask || 'Tidak ada'}\n• Poin Tugas: ${user.taskPoints}`);
    }

    if (cmd === 'lakukan' || cmd === 'lkkn') {
        if (!user.job) return m.reply('Kamu belum memilih pekerjaan. Gunakan .kerja <nama pekerjaan> terlebih dahulu.');
        if (user.currentTask) return m.reply(`Kamu masih memiliki tugas aktif: ${user.currentTask}\nGunakan .jawab <jawaban> untuk menyelesaikan atau .nyerah untuk menyerah.`);

        let tasks = {
            kantoran: [
                { soal: 'Warna baju pegawai kantor?', jawaban: 'putih' },
                { soal: 'Minuman di meja?', jawaban: 'kopi' },
                { soal: 'Jumlah layar monitor?', jawaban: '2' },
            ],
            gojek: [
                { soal: 'Warna jaket gojek?', jawaban: 'hijau' },
                { soal: 'Jumlah roda motor?', jawaban: '2' },
                { soal: 'Kamu mengantar apa?', jawaban: 'penumpang' },
            ],
            bangunan: [
                { soal: 'Bangun apa hari ini?', jawaban: 'rumah' },
                { soal: 'Jumlah batu bata?', jawaban: '100' },
                { soal: 'Alat utama?', jawaban: 'semen' },
            ]
        };

        let taskList = tasks[user.job];
        let task = taskList[Math.floor(Math.random() * taskList.length)];

        user.currentTask = task.soal;
        user.currentAnswer = task.jawaban.toLowerCase();

        return m.reply(`📝 Tugas kamu:\n*${task.soal}*\nGunakan .jawab <jawaban> untuk menyelesaikan atau .nyerah untuk menyerah.`);
    }

    if (cmd === 'jawab') {
        if (!user.currentTask) return m.reply('Kamu tidak memiliki tugas aktif.');
        let answer = args.join(' ').toLowerCase();
        if (!answer) return m.reply('Ketik jawaban kamu setelah .jawab');

        if (answer === user.currentAnswer) {
            user.taskPoints += 1;
            user.saldo = Number(user.saldo) + 5000; // pastikan saldo number
            let taskDone = user.currentTask;
            user.currentTask = null;
            user.currentAnswer = null;
            return m.reply(`🎉 Jawaban benar! Poin tugas +1.\nSaldo +5000\nTugas "${taskDone}" selesai.\nTotal poin: ${user.taskPoints}\nSaldo sekarang: ${user.saldo}`);
        } else {
            return m.reply(`❌ Jawaban salah! Coba lagi.\nTugas: ${user.currentTask}`);
        }
    }

    if (cmd === 'nyerah') {
        if (!user.currentTask) return m.reply('Kamu tidak memiliki tugas aktif.');
        let taskName = user.currentTask;
        user.currentTask = null;
        user.currentAnswer = null;
        return m.reply(`⚠️ Kamu menyerah pada tugas: "${taskName}". Tugas dibatalkan.`);
    }

    if (cmd === 'gaji') {
        if (!user.job) return m.reply('Kamu belum memiliki pekerjaan.');
        let gaji = user.taskPoints * 5000; 
        if (gaji === 0) return m.reply('❌ Kamu belum memiliki poin tugas. Selesaikan dulu tugas dengan .lakukan');
        user.saldo = Number(user.saldo) + gaji; // pastikan saldo number
        user.taskPoints = 0;
        return m.reply(`💰 Kamu menerima gaji: ${gaji}\nSaldo sekarang: ${user.saldo}`);
    }

    global.db.data.users[sender] = user;
};

handler.help = ['kerja','lakukan','jawab','nyerah','gaji','kerja status'];
handler.tags = ['game','rpg'];
handler.command = /^(kerja|lakukan|lkkn|jawab|nyerah|gaji)$/i;

export default handler;