import { sendInteractiveMessage } from "buttons-warpper"

const handler = async (m, { fukusima }) => {
  // Test 1: LegacyButton format
  await sendInteractiveMessage(fukusima, m.chat, {
    body: "🔘 TEST 1: LegacyButton Format\n\nButton dengan format LegacyButton: {id, displayText}",
    footer: "Tes Button 1/8",
    buttons: [
      {
        id: "test1_button1",
        displayText: "Button 1 (Legacy)"
      },
      {
        id: "test1_button2",
        displayText: "Button 2 (Legacy)"
      }
    ]
  })
  await delay(2000)

  // Test 2: OldBaileysButton format
  await sendInteractiveMessage(fukusima, m.chat, {
    body: "🔘 TEST 2: OldBaileysButton Format\n\nButton dengan format OldBaileys: {buttonId, buttonText: {displayText}}",
    footer: "Tes Button 2/8",
    buttons: [
      {
        buttonId: "test2_button1",
        buttonText: {
          displayText: "Button 1 (OldBaileys)"
        }
      },
      {
        buttonId: "test2_button2",
        buttonText: {
          displayText: "Button 2 (OldBaileys)"
        }
      }
    ]
  })
  await delay(2000)

  // Test 3: NativeFlowButton - Quick Reply
  await sendInteractiveMessage(fukusima, m.chat, {
    body: "🔘 TEST 3: NativeFlowButton - Quick Reply\n\nButton dengan format NativeFlow untuk quick reply",
    footer: "Tes Button 3/8",
    buttons: [
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "Quick Reply Button 1",
          id: "test3_button1"
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "Quick Reply Button 2",
          id: "test3_button2"
        })
      }
    ]
  })
  await delay(2000)

  // Test 4: NativeFlowButton - URL Button
  await sendInteractiveMessage(fukusima, m.chat, {
    body: "🔘 TEST 4: NativeFlowButton - URL Button\n\nButton dengan format NativeFlow untuk URL",
    footer: "Tes Button 4/8",
    buttons: [
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "🌐 Google",
          url: "https://google.com",
          merchant_url: "https://google.com"
        })
      },
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "📘 GitHub",
          url: "https://github.com"
        })
      }
    ]
  })
  await delay(2000)

  // Test 5: NativeFlowButton - Copy Button
  await sendInteractiveMessage(fukusima, m.chat, {
    body: "🔘 TEST 5: NativeFlowButton - Copy Button\n\nButton dengan format NativeFlow untuk copy text",
    footer: "Tes Button 5/8",
    buttons: [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "📋 Copy Code",
          copy_code: "INI_CODE_YANG_DICOPY"
        })
      }
    ]
  })
  await delay(2000)

  // Test 6: NativeFlowButton - Call Button
  await sendInteractiveMessage(fukusima, m.chat, {
    body: "🔘 TEST 6: NativeFlowButton - Call Button\n\nButton dengan format NativeFlow untuk panggilan",
    footer: "Tes Button 6/8",
    buttons: [
      {
        name: "cta_call",
        buttonParamsJson: JSON.stringify({
          display_text: "📞 Call Support",
          phone_number: "+6281234567890"
        })
      }
    ]
  })
  await delay(2000)

  // Test 7: NativeFlowButton - Single Select (List)
  await sendInteractiveMessage(fukusima, m.chat, {
    body: "🔘 TEST 7: NativeFlowButton - Single Select\n\nButton dengan format NativeFlow untuk list selection",
    footer: "Tes Button 7/8",
    buttons: [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "Pilih Menu",
          sections: [
            {
              title: "Main Menu",
              rows: [
                {
                  title: "Option 1",
                  description: "Deskripsi option 1",
                  id: "option1"
                },
                {
                  title: "Option 2",
                  description: "Deskripsi option 2",
                  id: "option2"
                }
              ]
            }
          ]
        })
      }
    ]
  })
  await delay(2000)

  // Test 8: Mixed Buttons (Kombinasi berbagai tipe)
  await sendInteractiveMessage(fukusima, m.chat, {
    body: "🔘 TEST 8: Mixed Buttons Format\n\nMencoba kombinasi berbagai format button",
    footer: "Tes Button 8/8 - Final Test",
    buttons: [
      // Legacy
      {
        id: "mixed_legacy",
        displayText: "📱 Legacy"
      },
      // OldBaileys
      {
        buttonId: "mixed_oldbaileys",
        buttonText: {
          displayText: "📦 OldBaileys"
        }
      },
      // Native Quick Reply
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "⚡ Quick Reply",
          id: "mixed_quickreply"
        })
      }
    ]
  })

  m.reply("✅ Semua tes button telah dikirim! Periksa chat Anda.")
}

// Fungsi delay untuk jeda antar pesan
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

handler.help = ["tesbtn", "testbutton", "buttontest"]
handler.tags = ["tools"]
handler.command = /^(tesbtn|testbutton|buttontest)$/i
handler.register = true

export default handler