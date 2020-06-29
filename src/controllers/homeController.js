const getHome = (req, res) => {
  res.render("main/home/home", {
    success: req.flash("success"),
    errors: req.flash("error"),
  });
};

module.exports = {
  getHome,
};
