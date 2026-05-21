import { createCanvas, loadImage, registerFont } from "canvas";
import assets from "@putuofc/assetsku";

export async function scrapeEktpGet(query) {
  const {
    provinsi,
    kota,
    nik,
    nama,
    ttl,
    jenis_kelamin,
    golongan_darah,
    alamat,
    "rt/rw": rt_rw,
    "kel/desa": kel_desa,
    kecamatan,
    agama,
    status,
    pekerjaan,
    kewarganegaraan,
    masa_berlaku,
    terbuat,
    pas_photo,
  } = query;

  registerFont(assets.font.get("ARRIAL"), { family: "Arial" });
  registerFont(assets.font.get("OCR"), { family: "Ocr" });
  registerFont(assets.font.get("SIGN"), { family: "Sign" });

  const template = await loadImage(assets.image.get("TEMPLATE"));
  const pasPhoto = await loadImage(pas_photo);

  const width = 850;
  const height = 530;
  const radius = 20;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#F0F0F0";
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(width - radius, 0);
  ctx.quadraticCurveTo(width, 0, width, radius);
  ctx.lineTo(width, height - radius);
  ctx.quadraticCurveTo(width, height, width - radius, height);
  ctx.lineTo(radius, height);
  ctx.quadraticCurveTo(0, height, 0, height - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();

  ctx.drawImage(template, 0, 0, width, height);

  ctx.fillStyle = "black";
  ctx.font = "bold 25px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`PROVINSI ${provinsi.toUpperCase()}`, width / 2, 45);
  ctx.fillText(`${kota.toUpperCase()}`, width / 2, 75);

  ctx.textAlign = "left";
  ctx.font = "35px Ocr";
  ctx.fillText(nik, 205, 140);

  ctx.font = "bold 20px Arial";
  const valueX = 225;
  ctx.fillText(nama.toUpperCase(), valueX, 180);
  ctx.fillText(ttl.toUpperCase(), valueX, 205);
  ctx.fillText(jenis_kelamin.toUpperCase(), valueX, 230);
  ctx.fillText(golongan_darah.toUpperCase(), 550, 230);
  ctx.fillText(alamat.toUpperCase(), valueX, 255);
  ctx.fillText(rt_rw.toUpperCase(), valueX, 282);
  ctx.fillText(kel_desa.toUpperCase(), valueX, 307);
  ctx.fillText(kecamatan.toUpperCase(), valueX, 332);
  ctx.fillText(agama.toUpperCase(), valueX, 358);
  ctx.fillText(status.toUpperCase(), valueX, 383);
  ctx.fillText(pekerjaan.toUpperCase(), valueX, 409);
  ctx.fillText(kewarganegaraan.toUpperCase(), valueX, 434);
  ctx.fillText(masa_berlaku.toUpperCase(), valueX, 459);

  const photoX = 635;
  const photoY = 150;
  const photoWidth = 180;
  const photoHeight = 240;

  const photoCanvas = createCanvas(photoWidth, photoHeight);
  const photoCtx = photoCanvas.getContext("2d");
  photoCtx.fillStyle = "#FF0000";
  photoCtx.fillRect(0, 0, photoWidth, photoHeight);

  const aspectRatio = pasPhoto.width / pasPhoto.height;
  let srcWidth, srcHeight, srcX, srcY;

  if (aspectRatio > photoWidth / photoHeight) {
    srcHeight = pasPhoto.height;
    srcWidth = srcHeight * (photoWidth / photoHeight);
    srcX = (pasPhoto.width - srcWidth) / 2;
    srcY = 0;
  } else {
    srcWidth = pasPhoto.width;
    srcHeight = srcWidth * (photoHeight / photoWidth);
    srcX = 0;
    srcY = (pasPhoto.height - srcHeight) / 2;
  }

  photoCtx.drawImage(pasPhoto, srcX, srcY, srcWidth, srcHeight, 0, 0, photoWidth, photoHeight);
  ctx.drawImage(photoCanvas, photoX, photoY, photoWidth, photoHeight);

  ctx.textAlign = "center";
  ctx.font = "16px Arial";
  ctx.fillText(kota.toUpperCase(), photoX + photoWidth / 2, photoY + photoHeight + 35);
  ctx.fillText(terbuat, photoX + photoWidth / 2, photoY + photoHeight + 60);

  const signName = nama.split(" ")[0];
  ctx.font = "36px Sign";
  ctx.fillText(signName, photoX + photoWidth / 2, photoY + photoHeight + 110);

  return canvas.toBuffer("image/png", { quality: 0.95 });
}