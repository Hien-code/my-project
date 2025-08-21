const md5 = require('md5')
const User = require('../../models/user.model')

//[GET] /user/register
module.exports.register = async (req, res) => {
  res.render('client/pages/user/register', {
    pageTitle: 'Trang đăng ký',
  })
}

//[POST] /user/register
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

//[GET] /user/login
module.exports.login = async (req, res) => {
  res.render('client/pages/user/login', {
    pageTitle: 'Trang đăng nhập',
  })
}

//[POST] /user/login
module.exports.loginPost = async (req, res) => {
  console.log(req.body)

  const email = req.body.email
  const password = md5(req.body.password)

  const user = await User.findOne({
    email: email,
    delete: false,
  })

  if (!user) {
    req.flash('error', 'Tài khoản không tồn tại!')
    res.redirect(req.get('referer'))
    return
  }

  if (password !== user.password) {
    req.flash('error', 'Nhập sai mật khẩu')
    res.redirect(req.get('referer'))
    return
  }

  if (user.status === 'inactive') {
    req.flash('error', 'Tài khoản đã bị khóa!')
    res.redirect(req.get('referer'))
    return
  }

  res.cookie('tokenUser', user.tokenUser)

  res.redirect('/')
}

//[GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie('tokenUser')
  res.redirect(req.get('referer'))
}
