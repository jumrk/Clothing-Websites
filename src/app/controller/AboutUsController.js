class AboutUsController {
    renderAboutUs(req, res) {
        res.render('page/aboutUs', { layout: 'main', title: 'Về chúng tôi' });
    }
}

module.exports = new AboutUsController();