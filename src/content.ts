const id = 'drink-banner';
const animId = 'drink-banner-anim';

if (!document.getElementById(animId)) {
  const style = document.createElement('style');
  style.id = animId;
  style.textContent = `
    @keyframes walk-right {
      0% {
        left: -220px;
        opacity: 0;
      }
      10% {
        left: 10px;
        opacity: 1;
      }
      80% {
        left: calc(100vw - 220px);
        opacity: 1;
      }
      100% {
        left: calc(100vw + 20px);
        opacity: 0;
      }
    }
    #${id} {
      animation: walk-right 10s linear forwards;
      will-change: left, opacity;
    }
  `;
  document.head.appendChild(style);
}

if (!document.getElementById(id)) {
  const img = document.createElement('img');
  img.id = id;
  img.src = chrome.runtime.getURL('banner.jpg');
  Object.assign(img.style, {
    position: 'fixed',
    bottom: '10px',
    left: '-220px',
    width: '200px',
    zIndex: '2147483647',
    boxShadow: '0 0 10px black',
    opacity: '0',
  });
  document.body.appendChild(img);
  setTimeout(() => img.remove(), 10000);
}
