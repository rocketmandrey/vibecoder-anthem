(() => {
  function kitTest(t) {
    nightCity(t, {});
    spell('ITGIRL', 960, 200, 120, t, 0, { step: .33 });
    sailorClawd(650, 930, 46, { ...move('bounce', t), wand: true, eyes: 'happy', blush: true });
    blackCat(1150, 930, 16, t, {});
    tuxResearcher(1450, 930, 26, { rose: true, aR: .4, mouth: 'smile' });
    lips(300, 400, 60, t, {});
  }
  chapter('kit', 0, 25.4, [[0, kitTest]]);
})();
