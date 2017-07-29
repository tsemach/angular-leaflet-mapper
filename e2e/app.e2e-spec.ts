import { Angular4LeafletMapperPage } from './app.po';

describe('angular4-leaflet-mapper App', () => {
  let page: Angular4LeafletMapperPage;

  beforeEach(() => {
    page = new Angular4LeafletMapperPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
