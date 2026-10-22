// Independent, keyboard-accessible screenshot selectors; no runtime dependencies.
for (const tablist of document.querySelectorAll('[data-screenshot-tabs]')) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  function select(tab) {
    for (const item of tabs) {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      const panelID = item.getAttribute('aria-controls');
      document.getElementById(panelID).hidden = !active;
      const caption = document.querySelector(`[data-caption-for="${panelID}"]`);
      if (caption) caption.hidden = !active;
    }
  }
  for (const tab of tabs) {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      const index = tabs.indexOf(tab);
      if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (event.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
      if (event.key === 'Home') next = tabs[0];
      if (event.key === 'End') next = tabs.at(-1);
      if (next) {
        event.preventDefault();
        select(next);
        next.focus();
      }
    });
  }
}
