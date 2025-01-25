import { processEJSData } from '../utils/index.js';

class AboutController {
  // [GET] /about
  index(req, res, next) {
    res.render('about', {
      ...processEJSData(req),
      navStatus: 'about',
      docSubTitle: 'About',
    });
  }
}

export default new AboutController();
