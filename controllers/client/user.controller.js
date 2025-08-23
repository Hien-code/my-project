const md5 = require('md5')
const User = require('../../models/user.model')
const Cart = require('../../models/cart.model')

const ForgotPassword = require('../../models/forgot-password.model')

const generateHelper = require('../../helpers/generate')
const sendMailHelper = require('../../helpers/sendMail')

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

  const cart = await Cart.findOne({
    user_id: user.id,
  })
  if (cart) {
    res.cookie('cartId', cart.id)
  } else {
    await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: user.id })
  }

  res.cookie('tokenUser', user.tokenUser)

  res.redirect('/')
}

//[GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie('tokenUser')
  res.clearCookie('cartId')
  res.redirect(req.get('referer'))
}

//[GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render('client/pages/user/forgot-password', {
    pageTitle: 'Trang lấy lại mật khẩu',
  })
}

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email

  const user = await User.findOne({
    email: email,
    delete: false,
  })

  if (!user) {
    req.flash('error', 'Email không tồn tại!')
    res.redirect(req.get('referer'))
    return
  }
  //Lưu thông tin vào database
  const otp = generateHelper.generateRandomNumber(8)
  const objForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  }
  const forgotPassword = new ForgotPassword(objForgotPassword)
  await forgotPassword.save()

  //Nếu tồn tại email gửi mã OTP qua email
  const subject = 'Mã OTP xác minh lấy lại mật khẩu'
  const html = `Mã OTP để xác nhận mật khẩu : <b>${otp}</b>`
  sendMailHelper.sendMail(email, subject, html)

  res.redirect(`/user/password/otp?email=${email}`)
}

//[GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email
  res.render('client/pages/user/otp-password', {
    pageTitle: 'Trang nhập otp',
    email: email,
  })
}

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email
  const otp = req.body.otp

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  })
  if (!result) {
    req.flash('error', 'OTP không hợp lệ!')
    res.redirect(req.get('referer'))
    return
  }

  const user = await User.findOne({ email: email })
  res.cookie('tokenUser', user.tokenUser)

  res.redirect('/user/password/reset')
}

//[GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  const email = req.query.email
  res.render('client/pages/user/reset-password', {
    pageTitle: 'Đổi mật khẩu',
    email: email,
  })
}

//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password
  const tokenUser = req.cookies.tokenUser

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    { password: md5(password) }
  )

  res.redirect('/')
}

module.exports.info = async (req, res) => {
  res.render('client/pages/user/info', {
    pageTitle: 'Trang thông tin cá nhân',
  })
}
