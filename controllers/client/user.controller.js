const md5 = require('md5')
const User = require('../../models/user.model')

//[GET] /user/register
module.exports.register = async (req, res) => {
  res.render('client/pages/user/register', {
    pageTitle: 'Trang đăng ký',
  })
}

module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
  })

  if (existEmail) {
    req.flash('error', 'Email đã tồn tại!')
    res.redirect(req.get('referer'))
    return
  }
  req.body.password = md5(req.body.password)

  const user = new User(req.body)
  await user.save()

  console.log(user)

  res.cookie('tokenUser', user.tokenUser)
  res.redirect('/')
}
