let verifying = false;

const successBox = document.querySelector(".success-box");
const failedBox = document.querySelector(".failed-box");

function addSuccess({ id, username, discriminator, avatar }, token) {
  const element = document.createElement("div");
  element.innerHTML = `
    <div>
      <img src="${
        avatar
          ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=80" alt="avatar" style="border-radius: 50%; `
          : "https://pbs.twimg.com/profile_images/1392925163969200136/wNZYmQXx_400x400.jpg"
      }" alt="${username}'s avatar"></img>
      <span>${username}<span>#${discriminator}</span></span>
      <button class="styled-button" onclick="copyToClipboard('${token}')">Copiar token</button>

    </div>
  `;

  successBox.appendChild(element);
}

function copyToClipboard(text) {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText)
    return navigator.clipboard.writeText(text);
  return Promise.reject("The Clipboard API is not available.");
}

function addFailed(token) {
  const element = document.createElement("div");
  element.innerText = token;

  failedBox.appendChild(element);
}

async function verifyTokens() {
  if (verifying) {
    return;
  }

  const tokens = document
    .querySelector(".main-box > textarea")
    .value?.trim()
    .split("\n")
    .filter((str) => !!str);
  if (!tokens?.length) {
    return;
  }

  verifying = true;
  for (const token of tokens) {
    await fetch("https://discord.com/api/v9/users/@me", {
      headers: {
        authorization: `${token}`,
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.id) {
          addSuccess(res, token);
        } else {
          addFailed(token);
        }
      })
      .catch(() => addFailed(token));
  }

  verifying = false;
}
