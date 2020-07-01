const getHome = (req, res) => {
  res.render("main/home/home", {
    success: req.flash("success"),
    errors: req.flash("error"),
    user: req.user
  });
};

module.exports = {
  getHome,
};
