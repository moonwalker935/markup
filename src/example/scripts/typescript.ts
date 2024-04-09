enum Term {
    First = 2,
    Second = 3,
}

document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('less');

    el.textContent = `TS: ${Term.First} + ${Term.Second} = ${Term.First + Term.Second}`;
});
