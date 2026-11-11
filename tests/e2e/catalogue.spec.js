const { test, expect } = require('./fixtures');

test.describe('Catalogue', () => {
  test('le tri par prix croissant classe vraiment les articles', async ({ connecte }) => {
    await connecte.trierPar('lohi');
    const prix = await connecte.lirePrix();
    expect(prix.length).toBeGreaterThan(1);
    expect(prix).toEqual([...prix].sort((a, b) => a - b));
  });

  test('le tri par prix décroissant classe vraiment les articles', async ({ connecte }) => {
    await connecte.trierPar('hilo');
    const prix = await connecte.lirePrix();
    expect(prix).toEqual([...prix].sort((a, b) => b - a));
  });

  test('le tri de Z à A classe les noms', async ({ connecte }) => {
    await connecte.trierPar('za');
    const noms = await connecte.noms.allTextContents();
    expect(noms).toEqual([...noms].sort((a, b) => b.localeCompare(a)));
  });
});
