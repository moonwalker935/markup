document.addEventListener('DOMContentLoaded', () => {
  const checkInterpolation = () => {
    const el = document.getElementById('css');
    const a = 2;
    const b = 3;

    el.textContent = `JS: ${a} + ${b} = ${a + b}`;
  };

  const checkJson = async () => {
    const load = async () => {
      try {
        const host = `${location.protocol}//${location.hostname}`;
        const response = await fetch(`${host}/markups/example/scripts/contacts.json`);
        return await response.json();
      } catch (error) {
        console.log('Error on load contacts.json', error);
        return null;
      }
    };

    const createHtml = (contacts) => {
      if (!contacts.isVisible) return '';

      return contacts.list
        .map(({ name, link }) => {
          return `<li>${name}<br><a href="${link}">Profile</a></li>`;
        })
        .join('');
    };

    const appendHtml = (htmlString) => {
      const container = document.getElementById('json');
      container.innerHTML = `<ul>${htmlString}</ul>`;
    };

    const contacts = await load();
    if (!contacts) return;
    const html = createHtml(contacts);
    if (!html) return;
    appendHtml(html);
  };

  checkInterpolation();
  checkJson();
});
