import axios from 'axios'

let handler = async (m) => {
  async function getDropletInfo() {
    try {
      const accountResponse = await axios.get('https://api.digitalocean.com/v2/account', {
        headers: {
          Authorization: `Bearer ${global.doToken}`,
        },
      });

      const dropletsResponse = await axios.get('https://api.digitalocean.com/v2/droplets', {
        headers: {
          Authorization: `Bearer ${global.doToken}`,
        },
      });

      if (accountResponse.status === 200 && dropletsResponse.status === 200) {
        const dropletLimit = accountResponse.data.account.droplet_limit;
        const dropletsCount = dropletsResponse.data.droplets.length;
        const remainingDroplets = dropletLimit - dropletsCount;

        return {
          dropletLimit,
          remainingDroplets,
          totalDroplets: dropletsCount,
        };
      } else {
        throw new Error('Gagal mendapatkan data akun DigitalOcean atau droplet!');
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function sisadropletHandler() {
    try {
      const dropletInfo = await getDropletInfo();
      m.reply(`Sisa droplet yang dapat kamu pakai: ${dropletInfo.remainingDroplets}\n\nTotal droplet terpakai: ${dropletInfo.totalDroplets}`);
    } catch (err) {
      m.reply(`Terjadi kesalahan: ${err.message}`);
    }
  }

  sisadropletHandler();
}

handler.help = ['sisadroplet']
handler.tags = ['vps']
handler.command = /^sisadroplet$/i
handler.owner = true
export default handler