const bcrypt = require("bcryptjs")

async function registerAccount(req, res) {
  let {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body

  const hashedPassword = await bcrypt.hash(account_password, 10)

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("notice", "Registration successful.")
    res.redirect("/account/login")
  } else {
    req.flash("notice", "Registration failed.")
    res.redirect("/account/register")
  }
}