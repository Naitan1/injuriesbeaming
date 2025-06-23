function switchTab(tab) {
  const shortenTab = document.getElementById('shortenTab');
  const unshortenTab = document.getElementById('unshortenTab');
  const tabs = document.querySelectorAll('.tab');

  tabs.forEach(t => t.classList.remove('active'));

  if (tab === 'shorten') {
    tabs[0].classList.add('active');
    shortenTab.style.display = 'block';
    unshortenTab.style.display = 'none';
  } else {
    tabs[1].classList.add('active');
    shortenTab.style.display = 'none';
    unshortenTab.style.display = 'block';
  }

  document.getElementById('resultBox').classList.remove('show');
}

async function generateLink() {
  const urlInput = document.getElementById('urlInput');
  const option = document.getElementById('optionSelect').value;
  const customSlug = document.getElementById('customSlug').value.trim();
  const originalUrl = urlInput.value.trim();
  const resultBox = document.getElementById('resultBox');
  const resultText = document.getElementById('resultText');

  if (!originalUrl) {
    alert('Please enter a URL!');
    urlInput.focus();
    return;
  }

  resultText.innerHTML = '<span class="loading">Generating secure link...</span>';
  resultBox.classList.add('show');

  try {
    const apiUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(originalUrl)}${customSlug ? `&shorturl=${customSlug}` : ''}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok || !data.shorturl) {
      throw new Error(data.errormessage || "Shortening failed.");
    }

    let displayUrl;
    const userId = originalUrl.match(/users\/(\d+)/)?.[1] || 'ID';
    const groupId = originalUrl.match(/groups\/(\d+)/)?.[1] || 'ID';
    const serverCode = originalUrl.match(/code=([a-f0-9]+)/i)?.[1] || 'abc123';

    switch (option) {
      case 'profile':
        displayUrl = `https*:*//www.roblox.com/users/${userId}/profile`;
        break;
      case 'group':
        displayUrl = `https*:*//www.roblox.com/groups/${groupId}`;
        break;
      case 'private-server':
        displayUrl = `https*:*//www.roblox.com/share?code=${serverCode}&type=Server`;
        break;
      default:
        displayUrl = originalUrl.replace('robiox.com.tg', 'roblox.com');
    }

    resultText.textContent = `[${displayUrl}](${data.shorturl})`;
  } catch (err) {
    resultText.textContent = `Error: ${err.message}`;
  }
}

async function unshortenLink() {
  const url = document.getElementById('shortenedUrlInput').value.trim();
  const resultBox = document.getElementById('resultBox');
  const resultText = document.getElementById('resultText');

  if (!url) {
    alert('Please enter a shortened URL!');
    return;
  }

  resultText.innerHTML = '<span class="loading">Revealing original URL...</span>';
  resultBox.classList.add('show');

  try {
    const response = await fetch(`https://is.gd/forward.php?format=simple&shorturl=${encodeURIComponent(url)}`);
    const originalUrl = await response.text();

    if (originalUrl.startsWith('http')) {
      resultText.textContent = originalUrl;
    } else {
      throw new Error(originalUrl);
    }
  } catch (err) {
    resultText.textContent = `Error: ${err.message}`;
  }
}

function copyResult() {
  const text = document.getElementById('resultText').textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  });
}
